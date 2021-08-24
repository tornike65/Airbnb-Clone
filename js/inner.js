var date1 = document.querySelector(".date");
var guest = document.querySelector(".guest")
var container = document.querySelector(".container");
var id = JSON.parse(localStorage.getItem("id"));
var location1 = document.querySelector(".location");
var reserveInfo = JSON.parse(localStorage.getItem("searchInfo"));
const progress = new barOfProgress({

    // bar height
    size: 4,

    // background color
    color: "#FF5A5F",
     
});
function getData() {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", `https://hotels4.p.rapidapi.com/properties/get-details?id=${id}&currency=USD&locale=en_US`);
    xhr.setRequestHeader("x-rapidapi-host", "hotels4.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "2cb594876cmsh93ad02cc1e5d782p1e1e9ajsn7f9230100a28");
    xhr.onloadstart = function(){
    progress.start();
    }

    xhr.onloadend = function(){
       var data = JSON.parse(xhr.responseText)
       renderData(data)
       genereteMap(data.data.body.pdpHeader.hotelLocation.coordinates)
      progress.finish()
    }
    xhr.send();
}


function renderData(data) {
    console.log(data)
    console.log(reserveInfo)
    container.innerHTML += setData(data, reserveInfo);
}

function setData(data, reserveInfo) {

    return ` <article>
    <h1 class="place-name">${data.data.body.propertyDescription.name}</h1>
    <i class="fas fa-star">
        <span class="star">${data.data.body.guestReviews.rating}</span>
    </i>
    <i class="fas fa-map-marker-alt"><span> ${data.data.body.propertyDescription.address.cityName} ${data.data.body.propertyDescription.address.countryName}</span></i>
    <i class="fas fa-home"><span>${data.data.body.propertyDescription.roomTypeNames[1]}</span></i>
</article>
<article style="margin-top: 50px; height: 350px;">
    <img style="width: 100%; height: 100%; object-fit: cover; border-radius: 15px;"
        src="${data.img}" alt="">
</article>
<article class="detail">
    <div style="width: 50%;">
        <div class="place-info">
            <h1>All about place</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas nostrum pariatur omnis? Cum
                repellat vero ex? Natus repellat id molestiae reiciendis nesciunt, ad sunt neque veritatis.
                Corrupti laborum voluptatem adipisci, saepe necessitatibus explicabo rem, laboriosam veritatis
                similique, voluptatibus libero quidem nam tempore distinctio omnis fugiat maxime porro
                dignissimos ad impedit?</p>
        </div>
        <div class="place-offer">
            <h1>What this place offers</h1>
            <div>
                <i class="fas fa-wifi"><span>Wi-Fi</span></i>
                <i class="fas fa-snowflake"><span>Air conditioning</span></i>
                <i class="fas fa-calendar"><span>Long term stays allowed</span></i>
                <i class="fas fa-tv"><span>TV with cable</span></i>
                <i class="fas fa-smoking"><span>No smoking</span></i>
                <i class="fas fa-swimming-pool"><span>Swimming pool</span></i>
            </div>
        </div>
    </div>

    <div class="reservation">
        <h1>${data.data.body.propertyDescription.featuredPrice.currentPrice.formatted} / night</h1>
        <input type="text" class="date" name="daterange" value="${reserveInfo.date}">
        <input type="text" class="guest" name="guest" value=${reserveInfo.guest} + guest">
        <button class="btn">Reserve</button>
    </div>
</article>`
}


function setLocationData() {
    info = JSON.parse(localStorage.getItem("searchInfo"));
    location1.value = info.location;
    date1.value = info.date;
    guest.value = info.guest + '  guest';
}

function genereteMap(mapObject) {
    mapboxgl.accessToken = 'pk.eyJ1IjoidG9ybmlrZTY1IiwiYSI6ImNrc2c3MWJoczFoZm4ydnFrM2xwdm00djYifQ.H1YeZ1y1n2zunMZXaU0-PA';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/tornike65/cksg75e1o6mr417rzp8xnocve', // style URL
        center: [mapObject.longitude, mapObject.latitude], // starting position [lng, lat]
        zoom: 11 // starting zoom
    });

    var geojson = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [mapObject.longitude, mapObject.latitude]
            },           
        }]
    };
    geojson.features.forEach(function (marker) {

        // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = 'marker';

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
    });

    // new mapboxgl.Marker(el)
    //     .setLngLat(marker.geometry.coordinates)
    //     .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    //         .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
    //     .addTo(map);



}

getData()
// genereteMap(data)
 renderData()
setLocationData()