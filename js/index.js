let map = L.map('map').setView([37.7707, -122.4378], 12);
const parkingLayer = L.layerGroup().addTo(map);
const parkingLayer2 = L.layerGroup().addTo(map);
const parkingLayer3 = L.layerGroup().addTo(map);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
}).addTo(map);

var slider = document.getElementById("mySlider");
var output = document.getElementById("output-value");
output.innerHTML = `Day ${Math.floor(slider.value/24)+1}, ${(slider.value)%24}:00`; // Display the default slider value
// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = `Day ${Math.floor(this.value/24)+1}, ${(this.value)%24}:00`;
}

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
  //console.log(barValue);
  var options = {
    chart: {
      type: 'bar',
      height: 250,
      events: {
        click: function(event, chartContext, config) {
          //console.log(config.seriesIndex);
          //console.log(config.config.series[config.seriesIndex]);
          //console.log(config.dataPointIndex);
          console.log(parkings.features[config.dataPointIndex].properties.nhood);
          //console.log('hey');
          parkingLayer3.clearLayers();
          nameHood = parkings.features[config.dataPointIndex].properties.nhood;
          nhoodSelected = parkings.features.filter((layer) => layer.properties.nhood === nameHood);
          L.geoJSON(nhoodSelected, {
            style: {color: '#0000FF'}
          })
          .bindPopup(layer => {
            let nam = nameHood;
            return `${nam}`;
          })
          .openPopup()
          .addTo(parkingLayer3);
        }
      }
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
    },
    
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
const nhoodSelect = document.querySelector('#nhood-select');

let initialSelectList = () => {
  let nhoodList = [];
  for(let i = 0; i < 5000; i++) {
    nhoodList = nhoodList.concat(parkings_long.nhood[i]);
  };
/*
  parkings.feature.forEach((nhood) => {
    const nhood_name = nhood.properties.nhood;
    nhoodList = nhoodList.concat(nhood_name);
  });
  */
  let nhoodUnique = [...new Set(nhoodList)].sort();
  nhoodUnique.forEach((nhood) => {
    nhoodSelect.appendChild(htmlToElement(`<option>${nhood}</option>`));
  });
  console.log('Type list set up!');
};
initialSelectList();

let initialLineChart = () => {
  let valueList = [];
  let timeList = [];
  for(let i = 0; i < 5000; i++) {
    if (parkings_long.nhood[i] === nhoodSelect.value) {
      valueList = valueList.concat(parkings_long.value[i]);
      timeList = timeList.concat(parkings_long.timeIndex[i]);
    };
    
  };
  var options_line = {
    series: [{
      name: "Parking Counts",
      data: valueList
  }],
    chart: {
    height: 300,
    type: 'line',
    zoom: {
      enabled: true
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'straight'
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  xaxis: {
    categories: timeList,
    tickAmount: 10
  }
  };
  
  var chart_line = new ApexCharts(document.querySelector("#line-chart"), options_line);
  chart_line.render();
  chart_line.updateSeries([{
    data: valueList
  }], 
  //animate = true
  )
};
let updateMaker = () => {
  console.log(nhoodSelect.value);
  parkingLayer2.clearLayers();
  nhoodSelected = parkings.features.filter((layer) => layer.properties.nhood === nhoodSelect.value);
  L.geoJSON(nhoodSelected, {
    style: {color: '#FF0000'}
  })
  .bindPopup(layer => {
    let nam = nhoodSelect.value;
    return `${nam}`;
  })
  .openPopup()
  .addTo(parkingLayer2);
}

let initialPieChart = () => {
  let valueList = [];
  let timeList = [];
  for(let i = 0; i < 140; i++) {
    if (timePeriod.nhood[i] === nhoodSelect.value) {
      valueList = valueList.concat(timePeriod.value[i]);
      //console.log(timePeriod.value[i]);
      timeList = timeList.concat(timePeriod.timePeriod[i]);
    };  
  };
  let timeUnique = [...new Set(timeList)].sort();
  console.log(valueList);
  console.log(timeList);
  var options_pie = {
    series: valueList,
    chart: {
      height: 250,
      type: 'donut',
  },
  labels: timeUnique,
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        height: 50,
        width: 50
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
  };


  var chart_pie = new ApexCharts(document.querySelector("#pie-chart"), options_pie);
  chart_pie.render();
  chart_pie.updateSeries(
    valueList
  )
}

let handleSelectChange = () => {
  initialLineChart();
  initialPieChart();
  updateMaker();
};

nhoodSelect.addEventListener('change', handleSelectChange);


//initialLineChart();


