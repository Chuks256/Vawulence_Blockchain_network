// Vawulence tracking server main aim 
// is to track guide node to discover other nodes 
// this tracking server main aim is to discover peers 
let ws=require('ws');

class Tracker{
    constructor(Port,Addr){
        this.Port=Port || 4000;
        this.Addr=Addr;
        this.Session_Storage=[];
        this.Node_Storage=[];
    }

    async start_tracker(){
        let Tr_Server=new ws.Server({port:this.Port})
        try{
            Tr_Server.on("connection", async(session)=>{
                this.Store_Session(session);
                this.Handlemessage(session);
            })
        }
        catch{
            throw new Error("error in connection")
        }
        console.log(`Tracking server is Listening @ Port: ${this.Port}`)
    }


    async MsgHelper(data,type){
        return {data,type}
    }


    async Store_Session(session){
        this.Session_Storage.push(session);
        console.log("Connected")
    }


    async Handlemessage(session){
        try{
            session.on("message", async(incomingMsg)=>{
                let msg=JSON.parse(incomingMsg);
                if(msg.type=="NODE_ADDR"){
                    this.Add_NodeAddr(msg)
                }
            })
        }
        catch{
            throw new Error("Error in message")
        }
    }

   async Add_NodeAddr(msg){
        console.log(msg.data)
    }



}


let b=new Tracker(5500,'ws://localhost:6000')
b.start_tracker()
