// Creating the map object
let myMap = L.map("map", {
  center: [40.7128, -74.0060], // Replace with your desired initial map center coordinates
  zoom: 5, // Adjust the zoom level as needed
});

// Adding the tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Define a function to set the marker size based on magnitude
function markerSize(magnitude) {
  return magnitude * 5;
}

// Define a function to set the marker color based on depth
function markerColor(depth) {
  if (depth < 10) return "#FFC107"; // Yellow
  if (depth < 30) return "#FF9800"; // Orange
  if (depth < 50) return "#F44336"; // Red
  if (depth < 70) return "#800080"; // Purple
  if (depth < 90) return "#0000FF"; // Blue
  return "#"; // Black
}

// Load earthquake data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data => {
  // Add earthquake markers to the map
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).bindPopup(`<h3>${feature.properties.place}</h3><hr>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]}`);
    }
  }).addTo(myMap);

  // Create a legend for marker depth
  let depthLegend = L.control({ position: 'bottomright' });

  depthLegend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend');
    let depths = [-10, 10, 30, 50, 70, 90];
    div.innerHTML += '<strong>Depth (km)</strong><br>';

    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +
        (depths[i] === -10 ? '0' : depths[i]) + (depths[i + 1] ? '&ndash;' + (depths[i + 1] - 1) + ' km' : '+ km') + '<br>';
    }

    return div;
  };

  depthLegend.addTo(myMap);

  // Add a row of colored boxes to the legend
  let colorBoxes = document.createElement('div');
  colorBoxes.className = 'color-boxes';
  for (let i = 0; i < depths.length; i++) {
    let colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    colorBox.style.backgroundColor = markerColor(depths[i] + 1);
    colorBoxes.appendChild(colorBox);
  }
  depthLegend.getContainer().appendChild(colorBoxes);
});


