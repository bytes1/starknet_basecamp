#[cfg(test)]
mod tests{

    // #[test]
    // fn test_immutabilit(){
    //     let a:u32=1;
    //     a=2;
    // }
#[test]
fn test_shadowing(){
    let _a:u32=1;
    let _a:u8=2;
    assert!(_a==2_u8);
}

#[test]
fn test_mutability(){
    let mut a:u32=2;
    a=2;
    assert!(a==2_u32);
}

#[test]
fn test_constants(){
    const A:u32=1;
assert!(A==1_u32);
}

}