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
                socket.on("joinRoom",roomName => {
                    const lastRoom = Array.from(socket.rooms)[1];
                    if(lastRoom) socket.leave(lastRoom)
                    socket.join(roomName);
                    const roomInfo = conversation.rooms.find(item => item.name == roomName);
                    socket.emit("roomInfo",roomInfo)
                });
                socket.emit("roomList",conversation.rooms);
            });
        }
    }
}