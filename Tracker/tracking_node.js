// Vawulence tracking server for peer discovery 
// this server enable peer discovery it allows node to discover each other 

let ws=require('ws'); // import websocket 

// create transaction class 
class Transaction{
    constructor(tracker_addr,port){
        this.tracker_addr=tracker_addr;
        this.port=port || 5028;
        this.session_storage=[]; 
        this.peers_storage=[]; // storage for storing peers 
        this.peers=[];
    }

    // method to packaging message 
    msghelper(data,type){
        return {data,type}
    }


    // method for starting tracking server 
    start_tracker(){
        if(this.port==""){
            let default_msg="Tracking server will be using default 5028"
            return default_msg;
        }
        // create new tracking server object 
        let tr_server=new ws.Server({port:this.port});
        // use try and catch syntax 
        try{
            tr_server.on("connection" , async(session)=>{
                // after connection connect session 
                this.connectsession(session);
                this.Handlemsg(session);
            })
        }
        catch{
            throw new Error("Error in connection")
        }
    }


    // method to connect socket session 
    connectsession(session){
        this.session_storage.push(session);
        this.RequestNodeAddr(session);
        console.log('Connected')
    }

    // request / send request msg to client node 
    RequestNodeAddr(session){
        let msg=this.msghelper("","REQUEST_NODE_ADDR");
        session.send(msg);
    }


    // method to handle incoming message
    Handlemsg(session){
        // use try and catch syntax 
        try{
            // listen for incoming message 
            session.on("message", async(data)=>{
                let msg=JSON.parse(data);
                // check incoming msg type 
                if(msg.type=="REQUEST_NODE_ADDR_ACCEPTED"){
                    // connect back to node and store address
                    this.respondnode(msg,session);
                }
            })
        }
        catch{
            throw new Error("something went wrong")
        }
    }

    respondnode(msg,session){
        this.peers.push(msg.data); // add node addr to peer list
        this.peers_storage.push(msg.data) // add node to add list
        // connect back to client node to detect disconnection
        this.connectNode();
        // method for sending list of connected peer
        this.send_peer_list(session);
    }

    
    connectNode(){
        // loop peers list 
        this.peers.forEach(nodes=>{
            // use try and catch syntax 
            try{
            let client=new ws(nodes);
            /// listen if server is open 
            client.on("open", async()=>{
                // connect to socket 
                this.session_storage.push(client)
            });

            // listen if server close connection 
            client.on("close",async()=>{
                console.log("connection closed ")
            })

            }
            catch{
                // throw new error 
                throw new Error("Something went wrong")
            }
        })
    }


    send_peer_list(session){
        let msg=this.msghelper(this.peers_storage,"ACTIVE_NODE_LIST")
        session.send(msg)
    }

}

