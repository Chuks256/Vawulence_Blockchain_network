// define npm package elliptic 
const elliptic=require('elliptic').ec;
const Ec=new elliptic('secp256k1');
// export module to external file 
module.exports=Ec;