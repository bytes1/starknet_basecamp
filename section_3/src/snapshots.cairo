#[cfg(test)]
mod tests{

    #[derive(Drop)]
    struct Person{
        height:u32,
        age:u32
    }

    fn get_age(person:Person)->u32{
        person.age
    }

    #[test]
    fn test_get_age(){
        let person:Person=Person{
            height:180,
            age:30,
        };

        assert!(get_age(person)==30);
    }

    fn get_age_return_ownership(person:Person)->(u32,Person){
        (person.age,person)
    }

    #[test]
    fn test_get_age_retun_ownership(){
         let person:Person=Person{
            height:100,
            age:30,
        };
    let (age,person)=get_age_return_ownership(person);
    assert!(age==30);
    assert!(person.age==30);
    }

    fn get_age_with_snapshot(person: @Person)->u32{
        *person.age
    }

    #[test]
    fn test_get_age_with_snapshot(){
        let person:Person=Person{
            height:180,age:30
        };
        let age:u32=get_age_with_snapshot(@person);
        assert!(age==30);
        assert!(person.age==30);
    }

  

}