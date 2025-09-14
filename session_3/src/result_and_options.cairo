fn find_even(x:u32) -> Option<u32> {
    if x%2==0{
        Option::Some(x)
    } else{
        Option::None
    }
}

fn divide(a:u32,b:u32)-> Result<u32, ByteArray>{
    if b==0{
        Result::Err("cant divide by zero")
    } else{
        Result::Ok(a/b)
    }
}

#[cfg(test)]
mod tests{

use super::*;

use super::divide;

#[test]
fn test_divide_by_zero_should_fail(){
    let result=divide(10,0);
assert!(result.is_err());
}

#[test]
fn test_divide_by_zero_should_failed_match(){
    let result=divide(10,0);
    match result{
        Result::Err(_)=>assert!(true),
        Result::Ok(_)=>assert!(false),
    }
}

#[test]
fn test_divide_by_zero_should_fail_match_error(){
        let result=divide(10,0);
  match result{
        Result::Err(error)=>assert!(error == "cant divide by zero"),
        Result::Ok(_)=>assert!(false),
    }
}

#[test]
fn test_divide_by_zero_should_fail_match(){
          let result=divide(10,0);
  match result{
        Result::Err(error)=>assert!(error == "cant divide by zero"),
        Result::Ok(_)=>assert!(false),
    }

}
#[test]
fn test_divide_by_zero_should_fail_shorthand(){
          let result=divide(10,0);
  match result{
        Err(_)=>assert!(true),
        Ok(_)=>assert!(false),
    }

}

#[test]
fn test_divide_by_zero_should_error_match_default(){
            let result=divide(10,0);
  match result{
        Err(_)=>assert!(true),
        _=>assert!(false),
    }

}


}