let map = L.map('map').setView([37.7707, -122.4378], 12);
const parkingLayer = L.layerGroup().addTo(map);

L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
}).addTo(map);

var slider = document.getElementById("mySlider");
//var output = document.getElementById("demo");
//output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
/*
slider.oninput = function() {
  output.innerHTML = this.value;
}
*/
let parkings = parkings_nhood_0327_0402;

slider.addEventListener('change', () => {
  console.log(slider.value);
  updateMap();
  initialBarChart();
});

let getColor = (value) => {
  if (value === 0) {
    return '#F8F8D4';
  };
  if (value > 0 && value <= 5) {
    return '#ECF3BF';
  };
  if (value > 5 && value <= 10) {
    return '#DCEFAB';
  };
  if (value > 10 && value <= 20) {
    return '#C7EA97';
  };
  if (value > 20 && value <= 50) {
    return '#AEE483';
  };
  if (value > 50 && value <= 100) {
    return '#91DF70';
  };

  if (value > 100 && value <= 200) {
    return '#71D85D';
  };
  if (value > 200 && value <= 500) {
    return '#4ED24A';
  };
  if (value > 500 && value <= 1000) {
    return '#38CB49';
  };
  if (value > 1000 && value <= 1500) {
    return '#33BE54';
  };
  if (value > 1500 && value <= 2000) {
    return '#2EB15D';
  };
  if (value > 2000 && value <= 4000) {
    return '#29A363';
  };
  if (value > 4000 && value <= 5000) {
    return '#249568';
  };

}


let updateMap = () => {
  parkingLayer.clearLayers();
  L.geoJSON(parkings, {
    style: feature => {
      let col = feature.properties[slider.value];
      return { color: getColor(col) };
    },
  })
  .bindTooltip(layer => {
    let nam = layer.feature.properties.nhood;
    return `${nam}`;
})
  .addTo(parkingLayer);
}

// barchart
let initialBarChart = () => {
  
  let nhood = parkings.features.map((layer) => {
    let result = layer.properties.nhood; 
    return result;
  });
  let barValue = parkings.features.map((layer) => {
    let result = layer.properties[slider.value]; 
    return result;
  });
  console.log(barValue);
  var options = {
    chart: {
      type: 'bar',
      height: 250,
    },
    series: [{
      name: 'parkings',
      data: barValue
    }],
    xaxis: {
      categories: nhood,
      labels: {
        rotate: -90
      },
      tickPlacement: 'on'
    }
  }
  
  var chart = new ApexCharts(document.querySelector("#bar-chart"), options);
  
  chart.render();
  chart.updateSeries([{
    data: barValue
  }], 
  //animate = true
  )
};
//initialBarChart();
