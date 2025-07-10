mapboxgl.accessToken = "pk.eyJ1Ijoic2FiaWJpbWFwcyIsImEiOiJjbWN4bDd3YzYwZm9vMmtxMG9obWd2d3J6In0.sBrl6aflArQtq4LyhY2xIw";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/sabibimaps/cky7dw57q6eni15nu4ujulb22",
  center: [-117.19443507492541, 32.77499181354771],
  zoom: 17,
  customAttribution: '<a target="_blank" href=http://www.geocadder.bg/en>geocadder</a>',
});

map.addControl(new mapboxgl.NavigationControl());
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
  })
);

var bounds = new mapboxgl.LngLatBounds();

// Fetch Google Sheet data
$.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1xH0EH8D8PWbjwP94I1c3MuCFqyWi6H_mg5gbn-JeafE/values/Sheet1!A2:N1000?majorDimension=ROWS&key=AIzaSyCElKhhcoSpRkhq4qy1PbnARsGVAGCYBCg",
  function (response) {
    var coordsArray = [];
console.log("Google Sheets response:", response.values);

    response.values.forEach(function (point) {
      var lat = parseFloat(point[5]);
      var lng = parseFloat(point[6]);
      if (!isNaN(lat) && !isNaN(lng)) {
        coordsArray.push([lng, lat]);
        bounds.extend([lng, lat]);
      }
    });

    map.on("load", function () {
      // Draw connecting path
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordsArray,
          },
        },
      });

      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#888",
          "line-width": 2,
          "line-dasharray": [1, 3],
        },
      });
    });

    response.values.forEach(function (marker) {
      var name = marker[0];
      var address = marker[1];
      var image = marker[2];
      var article = marker[3];
      var videoURL = marker[4]; // Should be a valid YouTube embed URL
      var lat = marker[5];
      var lng = marker[6];

      if (isNaN(lat) || isNaN(lng)) return;

      var popupHTML = `
        <div class="popup-content">
          <h2>${name}</h2>
          <p>${address}</p>
          <iframe width="100%" height="200" src="${videoURL}" frameborder="0" allowfullscreen></iframe>
          <p>${article}</p>
        </div>
      `;

      var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML);

      var el = document.createElement("div");
      el.className = "marker";
      el.style.width = "30px";
      el.style.height = "30px";
      el.style.backgroundColor = "#f04e98";
      el.style.borderRadius = "50%";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 0 6px rgba(0, 0, 0, 0.3)";
      el.style.cursor = "pointer";

      new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);
    });

    map.fitBounds(bounds, { padding: 80 });
  }
);
