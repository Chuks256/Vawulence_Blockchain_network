// vawulence blockchain wallet system 
// import elliptic module 
const Ec=require('../Utils/Ec');

 // create wallet class 
class Wallet{
    constructor(){
        this.internalkey; // internal key
        this.externalkey;
    }

    // method for creating new private key 
    Create_new_internalKey(){
        this.internalkey=Ec.genKeyPair(); 
        return this.internalkey;
    }

    // method for getting internal key 
    get_internalkey(key){
        this.internalkey=Ec.keyFromPrivate(key);
        return this.internalkey;
    }

    // method for displaying external key 
    Display_publickey(){
        this.externalkey=this.internalkey.getPublic('hex');
        return this.externalkey;       
    }
}

module.exports=Wallet;