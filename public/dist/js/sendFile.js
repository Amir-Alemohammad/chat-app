function sendFile(files) {
    const roomName = document.querySelector("#roomName h3").getAttribute("roomName")
    const endpoint = document.querySelector("#roomName h3").getAttribute("endpoint")
    const userId = document.getElementById("userID").value
    namespaceSocket.emit("upload", { file: files[0], filename: files[0]?.name, roomName, endpoint, userId }, (status) => {
        console.log(status)
    });
}