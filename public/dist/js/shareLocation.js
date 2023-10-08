function getLocation(){
    navigator.geolocation.getCurrentPosition((position) => {
        const {latitude:lat , longitude:long} = position.coords;
        const latlong = new google.maps.LatLng(lat,long);
        const li = stringToHtml(`
                <li class="sent">
                <img src="/dist/images/photo-1529665253569-6d01c0eaf7b6.jpg"
                        alt="picture" />
                </li>   
        `)
        const p = stringToHtml(`<p id="location-me" style="width: 200px; height: 150px;"></p>`)
        const myOptions = {
            center: latlong,
            zoom: 15,
            mapTypeId : google.maps.MapTypeId.ROADMAP,
            mapTypeControl : false,
            navigationControlOptions : {
                style : google.maps.NavigationControlStyle.SMALL,
            },
        }
        const map = new google.maps.Map(p , myOptions)
        li.appendChild(p);
        document.querySelector(".messages ul").appendChild(li);
        new google.maps.Marker({
            position: latlong,
            map,
            title: "You Are Here",
        })
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