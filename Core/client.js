let ws=require('ws');
let client=new ws('ws://localhost:5500');
client.on("open",async()=>{
    console.log("connected to server")
})

client.on("close", async()=>{
    console.log("Server is closed",client)
})