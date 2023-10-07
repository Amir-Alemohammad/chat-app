const socket = io("http://localhost:3000");
let namespaceSocket;
function stringToHtml(str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str,"text/html");
    return doc.body.firstChild
}
function getRoomInfo(endpoint , room){
    namespaceSocket.emit("joinRoom",room);
    namespaceSocket.on("roomInfo",roomInfo => {
        document.querySelector("#roomName h3").innerText = roomInfo.description;
        document.querySelector("#roomName h3").setAttribute("roomName",roomInfo.name)
        document.querySelector("#roomName h3").setAttribute("endpoint",endpoint)
    });
    namespaceSocket.on("onlineUsers",count => {
        document.getElementById("count").innerText = count;
    })
}
function sendMessage(){
    const roomName = document.querySelector("#roomName h3").getAttribute("roomName")
    const endpoint = document.querySelector("#roomName h3").getAttribute("endpoint")
    let message = document.querySelector(".message-input input#messageInput").value;
    if(message == "") return alert("input message cannot be empty!");
    const userId = document.getElementById("userID").value
    console.log(userId)
    namespaceSocket.emit("newMessage",{
        message,
        roomName,
        endpoint,
        sender : userId,
    });
    namespaceSocket.on("confirmMessage",data => {
        console.log(data)
    });
    const li = stringToHtml(`
    <li class="sent">
        <img src="/dist/images/photo-1529665253569-6d01c0eaf7b6.jpg"
            alt="image" />
        <p>${message}</p>
    </li>
    `);
    document.querySelector(".messages ul").appendChild(li);
    document.querySelector(".message-input input#messageInput").value = ""
    const messageElement = document.querySelector("div.messages");
    messageElement.scrollTo(0,messageElement.scrollHeight);
}
function initNamespaceConnection(endpoint){
    if(namespaceSocket) namespaceSocket.close();
    namespaceSocket = io(`http://localhost:3000/${endpoint}`);
    namespaceSocket.on("connect",() => {
        namespaceSocket.on("roomList",rooms => {
            const roomsElement = document.querySelector("#contacts ul");
            roomsElement.innerHTML = "";
            for (const room of rooms) {
                const html = stringToHtml(`
                <li class="contact" roomName="${room.name}">
                <div class="wrap">
                    <img src="${room.image}" />
                    <div class="meta">
                        <p class="name">${room.name}</p>
                        <p class="preview">${room.description}</p>
                    </div>
                </div>
                </li>`)
                roomsElement.appendChild(html)
            }
            const roomNodes = document.querySelectorAll("ul li.contact");
            for (const room of roomNodes) {
                room.addEventListener("click", () => {
                    const roomName = room.getAttribute("roomName");
                    getRoomInfo(endpoint,roomName);
                })
            }
        })
    })
}
socket.on("connect",() => {
    socket.on("namespacesList",namespacesList=>{
        const namespacesElement = document.getElementById("namespaces");
        namespacesElement.innerHTML = "";
        initNamespaceConnection(namespacesList[0].endpoint)
        for (const namespace of namespacesList){
            const li = document.createElement("li");
            const p = document.createElement("p");
            p.setAttribute("class","namespaceTitle")
            p.setAttribute("endpoint",namespace.endpoint)
            p.innerText = namespace.title;
            li.appendChild(p);
            namespacesElement.appendChild(li); 
        }
        const namespaceNodes = document.querySelectorAll("#namespaces li p.namespaceTitle");
        for (const namespace of namespaceNodes) {
            namespace.addEventListener("click",() => {
            const endpoint = namespace.getAttribute("endpoint");
            initNamespaceConnection(endpoint)
        });
    }
    });
    window.addEventListener("keydown",(e) => {
        if(e.code === "Enter") sendMessage();
        document.querySelector("button.submit").addEventListener("click",() => sendMessage())
    })
});
