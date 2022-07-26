// import crypto module 
const sha=require('crypto');
 // create sha object 
const Sha={
    // create method encode 
    encode:(Word)=>{
        const str=sha.createHash('sha256').update(Word).digest('hex');
        str.toString(); // convert string to object 
        return str;
    }
}

// export module sha 
module.exports=Sha;