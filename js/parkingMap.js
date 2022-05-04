let map = L.map('map').setView([37.7707, -122.4378], 13);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
}).addTo(map);

// let parkings = parkings_nhood_0327_0402;
let parkIcon = L.icon({
  iconUrl: './image/logo3.png',
  iconSize: [25, 25], // size of the icon
});

L.geoJSON(offStreet, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, { icon: parkIcon });
  },
})
  .bindTooltip(layer => {
    let add = layer.feature.properties.street_address;
    let cap = parseInt(layer.feature.properties.capacity);
    return `<p>ADDRESS: ${add}</p><p>CAPACITY: ${cap}</p>`;
  })
  .addTo(map);

let searchBar = document.getElementById('search-bar');
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

const startTracking = function () {
  // Start tracking the position.
  console.log('Starting to track position...');
  trackingID = navigator.geolocation.watchPosition(handlePositionUpdated);
  // console.log(trackingID);

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

const trackingButton = document.querySelector('#button');
trackingButton.addEventListener('click', () => {
  if (trackingID === null) {
    startTracking();
  } else {
    stopTracking();
  }
});



const offList = document.querySelector('#off-list');
const handlePositionUpdated = function (position) {
  // Move the position marker to the
  const latlng = [position.coords.latitude, position.coords.longitude];
  let lat0 = position.coords.latitude;
  let long0 = position.coords.longitude;
  positionMarker.setLatLng(latlng);
  // map.panTo(latlng);

  // Now that we know the user's position, update the marker style.
  positionMarker.setStyle(trackingStyle);

  console.log(position);

  let disDict = {};
  // calculate the distance
  for (let i = 0; i < 45; i++) {
    let lat1 = offStreet.features[i].properties.main_entrance_lat;
    let long1 = offStreet.features[i].properties.main_entrance_long;
    let distance = getDistanceFromLatLonInKm(lat0, long0, lat1, long1);
    console.log(offStreet.features[i].properties.street_address);
    console.log(distance);
    disDict[offStreet.features[i].properties.street_address] = distance;
  }
  console.log(disDict);
  let sortDist = Object.keys(disDict).map(function (key) {
    return [key, disDict[key]];
  });

  // Sort the array based on the second element
  sortDist.sort(function (first, second) {
    return first[1] - second[1];
  });

  console.log(sortDist);
  sortDist = sortDist.slice(0, 10);

  offList.innerHTML = '';
  sortDist.forEach((item) => {
    offList.appendChild(htmlToElement(`<li><b>Location:</b> ${item[0]}<br><b>Distance:</b> ${Math.round(item[1] * 1000)} m</li>`));
  });
};

let  deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

let getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  let R = 6371; // Radius of the earth in km
  let dLat = deg2rad(lat2 - lat1);  // deg2rad below
  let dLon = deg2rad(lon2 - lon1);
  let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1))
    * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c; // Distance in km
  return d;
};



let searchAddress = () => {
  const search = searchBar.value;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?access_token=pk.eyJ1Ijoic2lzdW5jIiwiYSI6ImNsMHZscjk3dDE4OTYzam54OTJ4bjh6N2kifQ.daoGo-tfen82e1nw3iSYew`;
  let searchCoor = '';

  fetch(url)
    .then(resp => resp.json())
    .then(searchLoc => {
      searchCoor = searchLoc.features[0].center;
      let latSearch0 = searchCoor[1];
      let longSearch0 = searchCoor[0];

      let disDict = {};
      // calculate the distance
      for (let i = 0; i < 45; i++) {
        let lat1 = offStreet.features[i].properties.main_entrance_lat;
        let long1 = offStreet.features[i].properties.main_entrance_long;
        let distance = getDistanceFromLatLonInKm(latSearch0, longSearch0, lat1, long1);
        console.log(offStreet.features[i].properties.street_address);
        console.log(distance);
        disDict[offStreet.features[i].properties.street_address] = distance;
      }
      console.log(disDict);
      let sortDist = Object.keys(disDict).map(function(key) {
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
        offList.appendChild(htmlToElement(`<li><b>Location:</b> ${item[0]}<br><b>Distance:</b> ${Math.round(item[1] * 1000)} m</li>`));
      });
    });
};

const searchButton = document.querySelector('#button-search');
searchButton.addEventListener('click', () => {
  console.log('The term searched for was ' + searchBar.value);
  searchAddress();
});


