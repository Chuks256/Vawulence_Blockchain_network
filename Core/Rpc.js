// Vawulence P2p network 
// This is a property of vawulence committe 
let ws=require("ws");

class Rpc{
    constructor(Ledger,Port,Peers){
        this.Ledger=Ledger;
        this.Port=Port || 5000;
        this.Peers=Peers ? Peers.split(",") : [];
        this.Networkstore=[];
    }

    Listen(){
        let Wss=new ws.Server({port:this.port});
        Wss.on("connection" , async(socket)=>{
            this.AddtoNetworkStore(socket);
        })
    }

    AddtoNetworkStore(socket){
        this.Networkstore.push(socket);
        this.connectPeers();
        return true;
    }

    connectPeers(){
        this.Peers.forEach(nodeClient => {
            let Client=new ws(nodeClient);
            Client.on("open", async()=>{
                try{
                    this.AddtoNetworkStore(Client);
                }
                catch{
                    throw new Error('could not connect to peer')
                }
            })
        });
    }
}

