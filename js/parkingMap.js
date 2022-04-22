let map = L.map('map').setView([37.7707, -122.4378], 13);
const parkingLayer = L.layerGroup().addTo(map);
const parkingLayer2 = L.layerGroup().addTo(map);
const parkingLayer3 = L.layerGroup().addTo(map);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
}).addTo(map);

let parkings = parkings_nhood_0327_0402;


L.geoJSON(offStreet)
.bindTooltip(layer => {
  let add = layer.feature.properties.street_address;
  let cap = parseInt(layer.feature.properties.capacity);
  return `<p>ADDRESS: ${add}</p><p>CAPACITY: ${cap}</p>`;
})
.addTo(map);

var searchBar = document.getElementById("search-bar");
console.log(searchBar.value);

// Geolocation Tracking Button
const trackingStyle = { color: 'blue' };
const nonTrackingStyle = { color: 'red' };

const positionMarker = L.circleMarker(
  [39.95, -75.16],
  nonTrackingStyle,
).addTo(map);
let trackingID = null;

/*
  When the user clicks the tracking button for the first time, we'll start
  following their position. When the user clicks the tracking button again, we
  will STOP following their position.
*/
const trackingButton = document.querySelector('#button');
trackingButton.addEventListener('click', () => {
  if (trackingID === null) {
    startTracking();
  } else {
    stopTracking();
  }
});


const startTracking = function () {
  // Start tracking the position.
  console.log('Starting to track position...');
  trackingID = navigator.geolocation.watchPosition(handlePositionUpdated);
  //console.log(trackingID);

  // Update the button text.
  trackingButton.innerHTML = 'Stop Tracking Me.';
};


const stopTracking = function () {
  // Stop tracking the position.
  navigator.geolocation.clearWatch(trackingID);
  trackingID = null;
  console.log('No longer tracking position...');

  // Update the marker style.
  positionMarker.setStyle(nonTrackingStyle);

  // Update the button text.
  trackingButton.innerHTML = 'Track Me!';
};

const offList = document.querySelector('#off-list');
const handlePositionUpdated = function (position) {
  // Move the position marker to the
  const latlng = [position.coords.latitude, position.coords.longitude];
  let lat0 = position.coords.latitude;
  let long0 = position.coords.longitude;
  positionMarker.setLatLng(latlng);
  //map.panTo(latlng);

  // Now that we know the user's position, update the marker style.
  positionMarker.setStyle(trackingStyle);

  console.log(position);
  
  let disDict = {};
  // calculate the distance
  for (let i = 0; i < 46; i++) {
    let lat1 = offStreet.features[i].properties.main_entrance_lat;
    let long1 = offStreet.features[i].properties.main_entrance_long;
    distance = getDistanceFromLatLonInKm(lat0, long0, lat1, long1);
    console.log(offStreet.features[i].properties.street_address);
    console.log(distance);
    disDict[offStreet.features[i].properties.street_address] = distance;

  };
  console.log(disDict);
  var sortDist = Object.keys(disDict).map(function(key) {
    return [key, disDict[key]];
  });
  
  // Sort the array based on the second element
  sortDist.sort(function(first, second) {
    return first[1] - second[1];
  });

  console.log(sortDist);
  sortDist = sortDist.slice(0, 10);

  offList.innerHTML = '';
  sortDist.forEach((item) => {
    offList.appendChild(htmlToElement(`<li>${item[0]}</li>`));
  });

};

let getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
};

let  deg2rad = (deg) => {
  return deg * (Math.PI/180)
};





