#[cfg(test)]
mod tests{
    mod simple_enum{
        
       #[derive(PartialEq,Drop)]
       enum Error{
            DivideByZero,
            DividendSmallerThanDivisor,
            InexactDivision,
          }

        fn divide(dividend:u32,divisor:u32)->Result<u32,Error>{
            if divisor==0{
               return Result::Err(Error::DivideByZero);
            }
            if divisor>dividend{
                return Result::Err(Error::DividendSmallerThanDivisor);
            }
            if dividend%divisor!=0{
              return   Result::Err(Error::InexactDivision);
            }

            Result::Ok(dividend/divisor)
        }

        #[test]
        fn test_simple_enum(){
            let result=divide(10,2);
            assert!(result == Result::Ok(5));
        }
    }

    mod enums_with_values{

       #[derive(PartialEq,Drop)]
       enum Error{
            DivideByZero,
            DividendSmallerThanDivisor:Divison,
            InexactDivision:Remainder,
        }
        
        #[derive(PartialEq,Drop)]
        struct Divison{
            dividend : u32,
            divisor:u32,
          }

        type Remainder=u32;

          fn divide(dividend:u32,divisor:u32)->Result<u32,Error>{
            if divisor==0{
               return Err(Error::DivideByZero);
            }
            if divisor>dividend{
                let division:basecamp::enums::tests::enums_with_values::Divison=Divison{
                    dividend: dividend,
                    divisor:divisor,
                };
                return Err(Error::DividendSmallerThanDivisor(division));
            }
            if dividend%divisor!=0{
                let reminder:Remainder=dividend%divisor;
              return   Err(Error::InexactDivision(reminder));
            }

           Ok(dividend/divisor)
        }
       
       #[test]
       fn test_enum_with_values(){
        let result=divide(10,2);
        assert!(result==Ok(5));
        let result=divide(10,0);
        assert!(result==Err(Error::DivideByZero));

        let result=divide(10,3);
        let remainder:Remainder=1;
        assert!(result==Err(Error::InexactDivision(remainder)));

          let result=divide(4,10);
        let divison:Divison=Divison{
            dividend:4, divisor:10
        };
        assert!(result==Err(Error::DividendSmallerThanDivisor(divison)));

       }

        

    }
}