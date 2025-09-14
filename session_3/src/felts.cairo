#[cfg(test)]
mod tests {

    #[test]
    fn test_implict_vs_explicit(){
        let a: felt252=5;
        let b: felt252=5;
        assert!(a==b);
    }

    #[test]
    fn test_math(){
        let a:felt252=4;
        let b:felt252=2;

        assert!(a+b==6);
        assert!(a-b==2);
        assert!(a*b==8);
    }

    #[test]
    fn test_overflow_felt_should_panic(){
        //p=3618502788666131213697322783095070105623107215331596699973092056135872020481
        let p_div_by_ten=3618502788666131213697322783095070105623107215331596699973092056135872020480;
         p_div_by_ten*100000000000000000000;      
    }

    #[test]
    #[should_panic]
    fn test_overflow_u256_should_panic(){
        let max_U256:u256=115792089237316195423570985008687907853269984665640564039457584007913129639935;
        max_U256*100;
    }

    #[test]
    fn test_short_string(){
        let short_string:felt252='a';
        assert!(short_string==97);
    }

    #[test]
    fn test_byte_array(){
        let bytes_array:ByteArray="No limit";
        assert!(bytes_array.len()==8);
    }


}