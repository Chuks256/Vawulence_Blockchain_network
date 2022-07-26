/// Vawulence Core codebase writter by Alexanderchuks 
// Without vawulence man is nothing 
// this codebase is opensource for people to use :-)

//define modules 
const Sha=require("../Utils/Sha")
const Ec=require("../Utils/Ec")

// Class for transaction 
class Transaction{
    constructor(Sndr,Rcr,Amt){
        this.Sndr=Sndr;
        this.Rcr=Rcr;
        this.Amt=Amt;
    }

    // method for creating transaction hash  
    createTransHash(){
        const Trans_str=this.Sndr+this.Rcr+this.Amt;
        return Sha.encode(Trans_str)
    }

    // method to sign transaction 
    Sign(Key){
        if(Key.getPublic('hex') != this.Sndr){
            throw new Error('Signing Key appears not to be valid')
        }
        const getTransHash=this.createTransHash();
        const sign=Key.sign(getTransHash,"base64");
        this.Signature=sign.toDER("hex");
    }

    // method to check if transaction is valid 
    isValid(){
        // if network address is null return false 
        if(this.Sndr==null){
            return true;
        }
        if(! this.Signature || this.Signature.length==0){
            throw new Error("Signature is invalid")
        }
        const transHash=this.createTransHash()
        const pubKey=Ec.keyFromPublic(this.Sndr,"hex")
        return pubKey.verify(transHash,this.Signature);
        // verify transaction 
    }
}


// Class for block 
class Block{
    constructor(Blockindex,timestamp,transaction,prevhash=''){
        this.Blockindex=Blockindex;
        this.timestamp=timestamp;
        this.transaction=transaction;
        this.nonce=0;
        this.prevhash=prevhash;
        this.hash=this.createBlockhash();
    }

    // method to create block hashing 
    createBlockhash(){
        const Blockhash=this.Blockindex+this.timestamp+JSON.stringify(this.transaction)+this.nonce+this.prevhash;
        return Sha.encode(JSON.stringify(Blockhash));
    }

    // method for mining block in Mempool 
    mine(difficulty){
        while(! this.hash.startsWith(Array(difficulty+1).join(0))){
            this.nonce++;
            this.hash=this.createBlockhash();
            console.log(this.hash)
        }
    }   

}


 // class for blockchain  
class Blockchain{
    constructor(){
        this.Chain=[this.createGenesisBlock()]; // storage for storing blocks 
        this.Mempool=[];
        this.Symbol="Vaw";
        this.Difficulty=4; // difficulty set at 4 
        this.blocktime=3000; // blocktime 
        this.Supplylimit=2000000; // supplylimit 
        this.Comrade_Reward=50; // reward for mining block in mempool
        this.Netaddr="04d7a6049057ac2d1b4e7b22e1fdc0b528fda5fbfabf1b8c6a59ee628009daa44ac958f2c73b23fced2d0ecea99d7ce6cb891e3cfab7d232a20a900ae62f2cac6b"
        this.Version="1.0" // version of blockchain 
        this.createHardcodedtransact() 
    }

    // create Genesis block 
    createGenesisBlock(){
        let details='Without Vawulence,man is nothing'
        let gen_blk=new Block(0,Date.now(),details);
        return gen_blk;
    }

    // create hard coded  network address for distribution 
    createHardcodedtransact(){
        let tx=new Transaction('',this.Netaddr,500)
        let prevId=this.getblockindex();
        let blk=new Block(prevId,Date.now(),tx,this.getlastBlock().hash);
        return this.Chain.push(blk);
    }

    // get previous block from chain 
    getlastBlock(){
        return this.Chain[this.Chain.length-1]
    }

    // method to get no of block in chain 
    getChainSize(){
        return this.Chain.length;
    }

    // method to check if chain is valid 
    ischainvalid(){
        for(let i=1; i<this.Chain.length; i++){
            const currentBlock=this.Chain[i];
            const previousBlock=this.Chain[i-1];
            if(currentBlock.hash != currentBlock.createBlockhash()){
                return false 
            }
            if(previousBlock.hash != currentBlock.prevhash){
                return false 
            }
        }
        return true 
    }


    // method to automatically update block index / block id 
    getblockindex(){
        let block_id=[]; // block storage for id 
        for(const i of this.Chain){
           block_id.push(i.Blockindex)
        }
        return block_id[block_id.length-1]+1; // return last block id 
    }

    // Method to check balance 
    checkBalance(Addr){
        let Bal=0; // Balance as at zero 
        for(let i=1; i<this.Chain.length; i++){
            let Sndr=this.Chain[i].transaction.Sndr;
            let Rcr=this.Chain[i].transaction.Rcr;
            let Amt=this.Chain[i].transaction.Amt;
            /// Check if Addr is same as sender or reciever 
            if(Addr===Sndr){
                Bal -=Amt;
            }
            if(Addr===Rcr){
                Bal +=Amt;
            }
        } 
        return Bal;
}

    // Method to check difficulty 
    checkDifficulty(){
    if(Date.now()-parseInt(this.getlastBlock().timestamp)>this.blocktime){
        this.Difficulty -=1; 
    }
    else{
    this.Difficulty +=1;
    }
    }

    // method to mine pending transaction in mempool
    mineMempool(Comrade_Addr,trans_choice){
        const blk=new Block(this.getblockindex(),Date.now(),trans_choice,this.getlastBlock().hash);
        blk.mine(this.Difficulty); // mine block
        this.Chain.push(blk) // push block block into the chain 
        this.checkDifficulty(); // call difficulty
         // check supply limit 
         if(this.Supplylimit < this.Comrade_Reward){
             this.Mempool=[new Transaction(null,Comrade_Addr,0)]
         }
         else{
             this.Mempool=[new Transaction(null,Comrade_Addr,this.Comrade_Reward)];
         }
    }

    // method to add transaction into mempool
    Addtransaction(transaction){
        // check transaction values  
        if(! transaction.Sndr || ! transaction.Rcr){
            return false 
        }
        // if transaction is not valid return false  
        if(! transaction.isValid()){
            return false 
        }
        // check if UserAddr balance is low 
        // if user balance is low return an error 
         if(this.checkBalance(transaction.Sndr)<transaction.Amt){
            throw new Error("Low bal")
        }
        // then push transaction to mempool
        return this.Mempool.push(transaction)
    }

 }
 
// export Transaction and Blockchain Class 
module.exports={Transaction,Blockchain}