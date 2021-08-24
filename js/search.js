var maparea;
var startDate;
var endDate
var searchResults = document.querySelector(".results");;
var searchText = document.querySelector(".text");
var searchLocation = document.querySelector(".search-location");
var location1 = document.querySelector(".location");
var date1 = document.querySelector(".date");
var guest = document.querySelector(".guest")
var card = document.querySelector(".card");
var data;
var adulth;

const progress = new barOfProgress({

    // bar height
    size: 4,

    // background color
    color: "#FF5A5F",
     
});
info = JSON.parse(localStorage.getItem("searchInfo"));

function dateFormat() {
    var splitDate = date1.value.split('-');
    var a = splitDate[0];
    var b = splitDate[1];
    var a = a.trim().split("/");
    var b = b.trim().split("/");
    startDate = a[2] + "-" + a[0] + "-" + a[1];
    endDate = b[2] + "-" + b[0] + "-" + b[1];
    adulth = info.guest;
}

function setValue() {
    info = JSON.parse(localStorage.getItem("searchInfo"));
    searchText.innerText = `20 stays · ${info.date} · ${info.guest} guests`;
    searchLocation.textContent = `Stays in ${info.location}`
    location1.value = info.location;
    date1.value = info.date;
    guest.value = info.guest + '  guest';
}

function getDestinationId() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://hotels4.p.rapidapi.com/locations/search?query=${info.location}`);
    xhr.setRequestHeader("x-rapidapi-host", "hotels4.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "2cb594876cmsh93ad02cc1e5d782p1e1e9ajsn7f9230100a28");
    xhr.onloadstart = function () {
        progress.start();
    }
    xhr.onloadend = function () {
        var api = JSON.parse(xhr.responseText);
        console.log(api)
        getData(api.suggestions[0].entities[0].destinationId);
        maparea = api.suggestions[0].entities[0];
    }
    xhr.send();
}

function getData(destinationId) {

    var xhr = new XMLHttpRequest();
    xhr.open("GET", `https://hotels4.p.rapidapi.com/properties/list?destinationId=${destinationId}&pageNumber=1&pageSize=10 &checkIn=${startDate}&checkOut=${endDate}&adults=${adulth}&sortOrder=PRICE&locale=en_US&currency=USD`);
    xhr.setRequestHeader("x-rapidapi-host", "hotels4.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "2cb594876cmsh93ad02cc1e5d782p1e1e9ajsn7f9230100a28");

    xhr.onloadstart = function () {
        //progress.start()
    }

    xhr.onloadend = function () {
        var api = JSON.parse(xhr.responseText);
        var res = api.data.body.searchResults.results.filter(x => x.address.locality == location1.value.trim());
        data = res;
        genereteData(res)
        genereteMap(res)
        progress.finish();


    }

    xhr.send();
}

function genereteData(collection) {

    collection.forEach(element => {
        searchResults.innerHTML += renderSearchResults(element);
    });
}

function renderSearchResults(obj) {
    return `<div class="card mb-3" style="cursor:pointer;">
    <div class="row g-0">
    <div class="col-md-4">
    <img src="${obj.optimizedThumbUrls.srpDesktop}" alt="...">
    </div>
    <div class="col-md-8">
    <div class="card-body">
    <h5 class="card-title">${obj.name}</h5>
    <div class="price-star">
    <i class="fas fa-star"> ${obj.starRating}</i>
    <p>${obj.ratePlan.price.current} / night</p>
    </div>
    <button class="btn detail-btn"  onclick = "showInnerPage(${obj.id})"> Show Details</button>
    </div>
    </div>
    </div>
    </div>`
};

function showInnerPage(id) {
    var elemen = data.filter(o => o.id == id)
    localStorage["id"] = JSON.stringify(elemen[0].id);
    var href = window.location.href;
    var splitHref = href.split("/");
    splitHref.pop();
    splitHref.push("inner.html");
    var newUrl = splitHref.join("/");
    window.location.href = newUrl;
}

function genereteMap(mapObject) {
    console.log(mapObject)
    mapboxgl.accessToken = 'pk.eyJ1IjoidG9ybmlrZTY1IiwiYSI6ImNrc2c3MWJoczFoZm4ydnFrM2xwdm00djYifQ.H1YeZ1y1n2zunMZXaU0-PA';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/tornike65/cksg75e1o6mr417rzp8xnocve', // style URL
        center: [maparea.longitude, maparea.latitude], // starting position [lng, lat]
        zoom: 11 // starting zoom
    });
    mapObject.forEach(element => {
        var geojson = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [element.coordinate.lon, element.coordinate.lat]
                },
                properties: {
                    title: `${element.ratePlan.price.current}`,
                    description: `${element.name}`
                }
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
            new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
                .addTo(map);
        });
    });



}

setValue();
dateFormat()
getDestinationId()
