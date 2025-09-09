fn unsigned_integers(){
    let _a:u8=255;
    let _b:u16=65535;
    let _c:u32=4294967295;
    let _e:u128=554555;
    let _f:u256=54545545;


    let _m:usize=4294967295;
    let _n:u32=429467295_usize;
}

fn signed_integers(){
    let _a:i8=120;
    let _b:i16=-32768;
    let _c:i32=-2147483648;
    let _e:i128=-1701411;
   

}

#[cfg(test)]
mod tests{
    use alexandria_math::fast_power::fast_power;
    use alexandria_math::fast_root::fast_sqrt;
    #[test]
    fn test_basic_uint_math(){
        let a:u8=3;
        let b:u8=5;

        assert!(a+b==8);
        assert!(b-a==2);
        assert!(a*b==15);
        assert!(b/a==1);
        assert!(b%a==2);
    }

    #[test]
    #[should_panic]
    fn test_uint_overflow_protection(){
        let a:u8=255;
        let b:u8=1;
        a+b;
    }

       #[test]
    #[should_panic]
    fn test_uint_underflow_protection(){
        let a:u8=0;
        let b:u8=1;
        a-b;
    }

     #[test]
    fn test_basic_int_math(){
        let a:i8=3;
        let b:i8=5;

        assert!(a+b==8);
        assert!(a-b==-2);
        assert!(a*b==15);
        assert!(b/a==1);
        assert!(b%a==2);
    }

      #[test]
    #[should_panic]
    fn test_int_overflow_protection(){
        let a:i8=127;
        let b:i8=1;
        a+b;
    }


        #[test]
    #[should_panic]
    fn test_int_underflow_protection(){
        let a:i8=-128;
        let b:i8=1;
        a-b;
    }

    #[test]
    fn test_mixing_types_success(){
        let a:u8=3;
        let b:i8=5;
        assert!(a+b.try_into().unwrap()==8)
    }

    #[test]
    fn test_mixing_types_fail(){
        let a:u8=3;
        let b:i8=-5;
        assert!(a.try_into().unwrap()+b==-2)
    }

   #[test]
   fn test_advanced_math(){
    let a:u32=4;
    assert!(fast_power(a,2)==16);
    assert!(fast_sqrt(a.try_into().unwrap(),1)==2);
   }

}