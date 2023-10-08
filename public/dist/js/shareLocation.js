function getLocation(){
    navigator.geolocation.getCurrentPosition((position) => {
        const roomName = document.querySelector("#roomName h3").getAttribute("roomName")
        const endpoint = document.querySelector("#roomName h3").getAttribute("endpoint")
        const userId = document.getElementById("userID").value
        const {latitude:lat , longitude:long} = position.coords;
        const latlong = new google.maps.LatLng(lat,long);
        const myOptions = {
            center: latlong,
            zoom: 15,
            mapTypeId : google.maps.MapTypeId.ROADMAP,
            mapTypeControl : false,
            navigationControlOptions : {
                style : google.maps.NavigationControlStyle.SMALL,
            },
        }
        namespaceSocket.emit("newLocation",{
            location : myOptions,
            roomName,
            endpoint,
            sender : userId,
        });
        namespaceSocket.off("confirmLocation")
        namespaceSocket.on("confirmLocation",data => {
            const li = stringToHtml(`
                <li class="${(userId == data.sender) ? 'sent' : 'replies'}">
                <img src="/dist/images/photo-1529665253569-6d01c0eaf7b6.jpg"
                        alt="picture" />
                </li>   
            `)
            const p = stringToHtml(`<p id="location-me" style="width: 200px; height: 150px;"></p>`)
            const map = new google.maps.Map(p , data.location)
            li.appendChild(p);
            document.querySelector(".messages ul").appendChild(li);
            new google.maps.Marker({
                position: data.location.center,
                map,
                title: "You Are Here",
            });
            const messageElement = document.querySelector("div.messages");
            messageElement.scrollTo(0,messageElement.scrollHeight);
        });
    },(err) => {
        const li = stringToHtml(`
                <li class="sent">
                <img src="/dist/images/photo-1529665253569-6d01c0eaf7b6.jpg"
                        alt="picture" />
                </li>   
        `)
        const p = stringToHtml(`<p id="location-me" style="width: 200px; height: 150px;">${err.message}</p>`)
        li.appendChild(p);
        document.querySelector(".messages ul").appendChild(li);
    })
}