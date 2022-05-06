let map = L.map('map').setView([37.7707, -122.4378], 12);
const parkingLayer = L.layerGroup().addTo(map);
const parkingLayer2 = L.layerGroup().addTo(map);
const parkingLayer3 = L.layerGroup().addTo(map);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
}).addTo(map);

let slider = document.getElementById('mySlider');
let output = document.getElementById('output-value');
output.innerHTML = `Day ${Math.floor(slider.value / 24) + 1}, ${(slider.value) % 24}:00`; // Display the default slider value
// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  output.innerHTML = `Day ${Math.floor(this.value / 24) + 1}, ${(this.value) % 24}:00`;
};

let parkings = parkingsNhood03270402;

let getColor = (value) => {
  if (value === 0) {
    return '#F8F8D4';
  }
  if (value > 0 && value <= 5) {
    return '#ECF3BF';
  }
  if (value > 5 && value <= 10) {
    return '#DCEFAB';
  }
  if (value > 10 && value <= 20) {
    return '#C7EA97';
  }
  if (value > 20 && value <= 50) {
    return '#AEE483';
  }
  if (value > 50 && value <= 100) {
    return '#91DF70';
  }
  if (value > 100 && value <= 200) {
    return '#71D85D';
  }
  if (value > 200 && value <= 500) {
    return '#4ED24A';
  }
  if (value > 500 && value <= 1000) {
    return '#38CB49';
  }
  if (value > 1000 && value <= 1500) {
    return '#33BE54';
  }
  if (value > 1500 && value <= 2000) {
    return '#2EB15D';
  }
  if (value > 2000 && value <= 4000) {
    return '#29A363';
  }
  if (value > 4000 && value <= 5000) {
    return '#249568';
  }
  return '#FFFFFF';
};

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
};

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
  // console.log(barValue);
  let options = {
    chart: {
      type: 'bar',
      height: 250,
      events: {
        click(event, chartContext, config) {
          console.log(parkings.features[config.dataPointIndex].properties.nhood);
          // console.log('hey');
          parkingLayer3.clearLayers();
          let nameHood = parkings.features[config.dataPointIndex].properties.nhood;
          let nhoodSelected = parkings.features.filter((lay) => lay.properties.nhood === nameHood);
          L.geoJSON(nhoodSelected, {
            style: { color: '#0000FF' },
          })
            .bindPopup(`${nameHood}`)
            .openPopup()
            .addTo(parkingLayer3);
        },
      },
    },
    series: [{
      name: 'parkings',
      data: barValue,
    }],
    xaxis: {
      categories: nhood,
      labels: {
        rotate: -90,
      },
      tickPlacement: 'on',
    },
  };
  let chart = new ApexCharts(document.querySelector('#bar-chart'), options);

  chart.render();
  chart.updateSeries([{
    data: barValue,
  }]);
};

slider.addEventListener('change', () => {
  console.log(slider.value);
  updateMap();
  initialBarChart();
});

const nhoodSelect = document.querySelector('#nhood-select');

let initialSelectList = () => {
  let nhoodList = [];
  for (let i = 0; i < 5000; i++) {
    nhoodList = nhoodList.concat(parkingsLong.nhood[i]);
  }

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
  for (let i = 0; i < 5300; i++) {
    if (parkingsLong.nhood[i] === nhoodSelect.value) {
      valueList = valueList.concat(parkingsLong.value[i]);
      timeList = timeList.concat(parkingsLong.timeIndex[i]);
    }
  }
  let optionsLine = {
    series: [{
      name: 'Parking Counts',
      data: valueList,
    }],
    chart: {
      height: 300,
      type: 'line',
      zoom: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: timeList,
      tickAmount: 10,
    },
  };

  let chartLine = new ApexCharts(document.querySelector('#line-chart'), optionsLine);
  chartLine.render();
  chartLine.updateSeries([{
    data: valueList,
  }]);
};
let updateMaker = () => {
  console.log(nhoodSelect.value);
  parkingLayer2.clearLayers();
  let nhoodSelected = parkings.features.filter((lay) => lay.properties.nhood === nhoodSelect.value);
  L.geoJSON(nhoodSelected, {
    style: { color: '#FF0000' },
  })
    .bindPopup(`${nhoodSelect.value}`)
    .openPopup()
    .addTo(parkingLayer2);
};

// let timePeriod;
let initialPieChart = () => {
  let valueList = [];
  let timeList = [];
  for (let i = 0; i < 140; i++) {
    if (timePeriod.nhood[i] === nhoodSelect.value) {
      valueList = valueList.concat(timePeriod.value[i]);
      // console.log(timePeriod.value[i]);
      timeList = timeList.concat(timePeriod.timePeriod[i]);
    }
  }
  let timeUnique = [...new Set(timeList)].sort();
  console.log(valueList);
  console.log(timeList);
  let optionsPie = {
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
          width: 50,
        },
        legend: {
          position: 'bottom',
        },
      },
    }],
  };

  let chartPie = new ApexCharts(document.querySelector('#pie-chart'), optionsPie);
  chartPie.render();
  chartPie.updateSeries(
    valueList,
  );
};

let handleSelectChange = () => {
  initialLineChart();
  initialPieChart();
  updateMaker();
};

nhoodSelect.addEventListener('change', handleSelectChange);


// initialLineChart();


