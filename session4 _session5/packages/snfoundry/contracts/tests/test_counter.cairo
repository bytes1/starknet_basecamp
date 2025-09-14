use snforge_std::DeclareResultTrait;
use starknet::ContractAddress;
use snforge_std::{declare,ContractClassTrait,spy_events,start_cheat_caller_address,stop_cheat_caller_address,EventSpyAssertionsTrait,set_balance,Token};
use contracts::counter::{IcounterDispatcher,IcounterDispatcherTrait};

use contracts::counter::CounterContract::{CounterChanged,ChangeReason,Event};

use contracts::utils::{strk_address, strk_to_fri};
use openzeppelin_token::erc20::interface::{IERC20Dispatcher,IERC20DispatcherTrait};

fn user_owner()->ContractAddress{
     'owner'.try_into().unwrap()
    
}

fn user_address()->ContractAddress{
    'user'.try_into().unwrap()
}

fn deploy_counter(init_counter:u32)->IcounterDispatcher{
    let contract=declare("CounterContract").unwrap().contract_class();
    let owner_address:ContractAddress=user_owner();

    let mut constructor_args= array![];
    init_counter.serialize(ref constructor_args);
    owner_address.serialize(ref constructor_args);

  let (contract_address,_)=contract.deploy(@constructor_args).unwrap();

  IcounterDispatcher{
   contract_address
  }

}



#[test]
fn test_contract_initialization(){
 let dispatcher=deploy_counter(5);   

 let current_counter=dispatcher.get_counter();

 let expected_counter:u32=5;
 assert!(current_counter==expected_counter,"counter failed"); 
    
}

#[test]
fn test_increase_counter(){
let init_counter:u32=0;
 let dispatcher=deploy_counter(init_counter); 
let mut spy=spy_events();
start_cheat_caller_address(dispatcher.contract_address,user_address());
 dispatcher.increment_counter();
 stop_cheat_caller_address(dispatcher.contract_address);
let current_counter:u32=dispatcher.get_counter();  
assert!(current_counter==1,"Increase counter fucntion doesn't work");
let expected_event:CounterChanged=CounterChanged{
     caller:user_address(),
   old_value:0,
   new_value:1,
    reason:ChangeReason::Increase,

};
spy.assert_emitted(@array![(dispatcher.contract_address,Event::CounterChange(expected_event))]);

}

#[test]
fn test_decrease_counter(){
    let init_counter:u32=5;
    let dispatcher=deploy_counter(init_counter);
    let mut spy=spy_events();
    start_cheat_caller_address(dispatcher.contract_address,user_address());
    dispatcher.decrease_counter();
    stop_cheat_caller_address(dispatcher.contract_address);
    let current_counter:u32=dispatcher.get_counter();  
    assert!(current_counter==4,"Decrease counter fucntion doesn't work");
    let expected_event:CounterChanged=CounterChanged{
     caller:user_address(),
   old_value:5,
   new_value:4,
    reason:ChangeReason::Decrease,

};
spy.assert_emitted(@array![(dispatcher.contract_address,Event::CounterChange(expected_event))]);
}

#[test]
#[should_panic]
fn test_decrease_counter_fail_path(){
    let init_counter:u32=0;
    let dispatcher=deploy_counter(init_counter);
    dispatcher.decrease_counter();
    dispatcher.get_counter();

}


#[test]
fn test_set_counter_owner(){
    let init_counter:u32=8;
    let dispatcher=deploy_counter(init_counter);
    let new_counter:u32=15;
    let mut spy=spy_events();
    start_cheat_caller_address(dispatcher.contract_address,user_owner());
    dispatcher.set_counter(new_counter);
    stop_cheat_caller_address(dispatcher.contract_address);

    assert!(dispatcher.get_counter()==15,"The owner is unable to reset the counter");

    let expected_event:CounterChanged=CounterChanged{
     caller:user_owner(),
   old_value:init_counter,
   new_value:new_counter,
    reason:ChangeReason::Set,};
spy.assert_emitted(@array![(dispatcher.contract_address,Event::CounterChange(expected_event))]);
}


#[test]
#[should_panic]
fn test_set_counter_non_owner(){
    let init_counter:u32=8;
    let dispatcher=deploy_counter(init_counter);
    let new_counter:u32=15;
    start_cheat_caller_address(dispatcher.contract_address,user_address());
    dispatcher.set_counter(new_counter);
    stop_cheat_caller_address(dispatcher.contract_address);
    

}

#[test]
#[should_panic(expected: "user doesnt have enough balance")]
fn test_reset_counter_insufficient_balance(){
    let init_counter:u32=8;
    let dispatcher=deploy_counter(init_counter);

     start_cheat_caller_address(dispatcher.contract_address,user_address());
    dispatcher.reset_counter();
    stop_cheat_caller_address(dispatcher.contract_address);


}

#[test]
#[should_panic(expected:"Contract is not allowed to spend enough STRK")]
fn test_reset_counter_insufficient_allowance(){
    let init_counter:u32=8;
    let dispatcher=deploy_counter(init_counter);
    let caller=user_address();
    set_balance(caller,10000000000000000000,Token::STRK);
    start_cheat_caller_address(dispatcher.contract_address,user_address());
    dispatcher.reset_counter();
    stop_cheat_caller_address(dispatcher.contract_address);
}

#[test]
fn test_reset_counter_success(){

    let init_counter:u32=8;
    let dispatcher=deploy_counter(init_counter);
    let caller=user_address();
    let mut spy=spy_events();
    set_balance(caller,strk_to_fri(10),Token::STRK);
    let erc_20=IERC20Dispatcher{
        contract_address:strk_address()
    };
    start_cheat_caller_address(erc_20.contract_address,user_address());
    erc_20.approve(dispatcher.contract_address,strk_to_fri(10));
    stop_cheat_caller_address(erc_20.contract_address);
    start_cheat_caller_address(dispatcher.contract_address,user_address());
    dispatcher.reset_counter();
    stop_cheat_caller_address(dispatcher.contract_address);

    assert!(dispatcher.get_counter()==0,"unable to reset the counter");

     let expected_event:CounterChanged=CounterChanged{
     caller:user_address(),
   old_value:init_counter,
   new_value:0,
    reason:ChangeReason::Reset,};
spy.assert_emitted(@array![(dispatcher.contract_address,Event::CounterChange(expected_event))]);

assert!(erc_20.balance_of(user_address())==strk_to_fri(9),"balance is not reduced");
assert!(erc_20.balance_of(user_owner())==strk_to_fri(1),"balance  not updated correctly");

}