const conversationModel = require("../models/conversation");

module.exports = class NamespaceSocketHandler{
    #io;
    constructor(io){
        this.#io = io;
    }
    async initConnection(){
        this.#io.on("connection",async socket => {
            const namespaces = await conversationModel.find({},{title:1,endpoint:1}).sort({_id:-1});
            socket.emit("namespacesList",namespaces)
        });
    }
    async createNamespacesConnection(){
        const namespaces = await conversationModel.find({},{title:1,endpoint:1,rooms:1}).sort({_id:-1});
        for(const namespace of namespaces){
            this.#io.of(`/${namespace.endpoint}`).on("connection",async socket=>{
                const conversation = await conversationModel.findOne({endpoint:namespace.endpoint},{rooms:1}).sort({_id:-1});
                socket.emit("roomList",conversation.rooms);
                socket.on("joinRoom",async roomName => {
                    const lastRoom = Array.from(socket.rooms)[1];
                    if(lastRoom) {
                        socket.leave(lastRoom)
                        await this.getCountOfOnlineUsers(namespace.endpoint,roomName)    
                    }
                    socket.join(roomName);
                    await this.getCountOfOnlineUsers(namespace.endpoint,roomName)
                    const roomInfo = conversation.rooms.find(item => item.name == roomName);
                    socket.emit("roomInfo",roomInfo)
                    this.getNewMessages(socket)
                    this.getNewLocation(socket)
                    socket.on("disconnect",async () => {
                        await this.getCountOfOnlineUsers(namespace.endpoint,roomName)
                    });
                });
            });
        }
    }
    async getCountOfOnlineUsers(endpoint,roomName){
        const onlineUsers = await this.#io.of(`/${endpoint}`).in(roomName).allSockets();
        this.#io.of(`/${endpoint}`).in(roomName).emit("onlineUsers",Array.from(onlineUsers).length)
    }
    getNewMessages(socket){
        socket.on("newMessage",async data => {
            const {message,roomName,endpoint , sender} = data;
            await conversationModel.updateOne({endpoint, "rooms.name": roomName}, {
                $push : {
                    "rooms.$.messages" : {
                        sender,
                        message, 
                        dateTime: Date.now()
                    } 
                }
            });
            this.#io.of(`/${endpoint}`).in(roomName).emit("confirmMessage", data)
        });
    }
    getNewLocation(socket){
        socket.on("newLocation",async data => {
            const {location,roomName,endpoint , sender} = data;
            await conversationModel.updateOne({endpoint, "rooms.name": roomName}, {
                $push : {
                    "rooms.$.messages" : {
                        sender,
                        location, 
                        dateTime: Date.now()
                    } 
                }
            });
            this.#io.of(`/${endpoint}`).in(roomName).emit("confirmLocation", data)
        });
    }
}