#[cfg(test)]
mod tests{
    fn add_one(x:u32)->u32{
        x+1
    }

    #[test]
    fn test_add_one(){
        let x:u32=1;
        let y:u32=add_one(x);
        assert!(x==1);
        assert!(y==2);
    }
    
    #[derive(Drop,Copy)]
    struct Person{
        height:u32,
        age:u32
    }

    fn get_age(person:Person)->u32{
        person.age
    }

    #[test]
    fn test_get_age(){
        let  person:Person=Person{
            height:180,age:30
        };

        let age:u32=get_age(person);
        assert!(age==30);
        assert!(person.age==30);

    }

    fn increase_age(mut person:Person){
        person.age+=1
    }

    #[test]
    fn test_increase_age(){
          let  person:Person=Person{
            height:180,age:30
        };
        increase_age(person);
        assert!(person.age==30);

    }

    
}