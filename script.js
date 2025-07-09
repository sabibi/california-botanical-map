mapboxgl.accessToken =
  "pk.eyJ1Ijoic2FiaWJpbWFwcyIsImEiOiJja3FkeTVqaDUwZDF5Mm5xdjg2c2xyNHM2In0.uHrRU6F7xEd0K3Zn7FffXw";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/sabibimaps/cky7dw57q6eni15nu4ujulb22",
  center: [-117.19443507492541, 32.77499181354771],
  zoom: 17,
  customAttribution:
    '<a target="_blank" href=http://www.geocadder.bg/en>geocadder</a>',
});

// Add zoom controls
map.addControl(new mapboxgl.NavigationControl());

// Add geolocate control
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  })
);

var bounds = new mapboxgl.LngLatBounds();

$.getJSON(
  "https://sheets.googleapis.com/v4/spreadsheets/1xH0EH8D8PWbjwP94I1c3MuCFqyWi6H_mg5gbn-JeafE/values/Sheet1!A2:N1000?majorDimension=ROWS&key=AIzaSyA-Wt-8yMvheATdrLFKSx9at3oJ01YTBwQ",
  function (response) {
    //start adding path between points
    var coordsArray = [];
    response.values.forEach(function (point) {
      if (typeof point[12] !== 'undefined' && typeof point[13] != 'undefined') {
        var pointCoordsArray = [point[12], point[13]];
        coordsArray.push(pointCoordsArray);
      }
    });

    map.on("load", function () {
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
          "line-dasharray": [1, 3]
        },
      });
    });
    // end adding path between points

    response.values.forEach(function (marker) {
      var name = marker[0];
      var address = marker[1];
      var image = marker[2];
      var article = marker[3];
      var video = marker[4];
      var lat = marker[5];
      var lng = marker[6];


      //add markers to map

      bounds.extend([longitude, latitude]);

      var popup = new mapboxgl.Popup().setHTML(
        '<div class="popup-image"><img src = "images/' +
        image +
        '"></div><div class="popup-details"><h2>' +
        name +
        "</h2></br>" +
        "<p>" +
        address +
        '</p></div><div class="arrow-link"></div>'
      );

      // create a HTML element for each feature
      var el = document.createElement("div");
el.className = "marker";

// 🔧 Add inline fallback styling
el.style.width = "30px";
el.style.height = "30px";
el.style.backgroundColor = "#f04e98";
el.style.borderRadius = "50%";
el.style.border = "2px solid white";
el.style.boxShadow = "0 0 6px rgba(0, 0, 0, 0.3)";

el.style.cursor = "pointer";

      new mapboxgl.Marker(el)
  .setLngLat([longitude, latitude])
  .addTo(map);

      
      // create a custom popup
      $(el).on("click", function (e) {
        // Prevent the `map.on('click')` from being triggered
        e.stopPropagation();
        $("div.custom-popup").addClass("visible");
        $("div.custom-popup").html(
          '<div class="popup-image"><img src = "images/' +
          image +
          '"></div><div class="popup-details"><h2>' +
          name +
          "</h2></br>" +
          "<p>" +
          address +
          '</p></div><div class="arrow-link"></div>'
        );

        // check windowSize
        var windowSize = $(window).width();
        /////////////////

        var topOffset = $(el).offset().top - 80;
        if (topOffset < 5) {
          topOffset = 10;
          $("div.custom-popup").css("top", topOffset);
        } else {
          $("div.custom-popup").css("top", topOffset);
        }

        var leftOffset = $(el).offset().left - 160;
        if (leftOffset < 5) {
          leftOffset = 10;
          $("div.custom-popup").css("left", leftOffset);
        } else {
          $("div.custom-popup").css("left", leftOffset);
        }

        var bottomOffset = $(el).offset().bottom;
        if (bottomOffset < 5) {
          bottomOffset = 10;
          $("div.custom-popup").css("bottom", bottomOffset);
        }

        var rightOffset = $(el).offset().right;
        if (rightOffset < 5) {
          rightOffset = 10;
          $("div.custom-popup").css("right", rightOffset);
        }

        $("div.custom-popup").on("click", function () {
          $("div.sidebar").addClass("visible");
          $("div.sidebar").html(
            '<div class="sidebar-content"><span class="close-button item-close-button"><img class="close-button-image" src="svg/garden.svg"></span><div class="sidebar-video-player">' +
            video +
            '</div><div class="sidebar-content-inner"> <h3>' +
            name +
            '</h3> <p class="description">' +
            article +
            '</p> </div> <div></div><div class="buildings"></div></div><span class="close-back-button">Back</span>'
          );

          $(".close-button").on("click", function () {
            $("div.sidebar").removeClass("visible");
          });

          $(".close-back-button").on("click", function () {
            $("div.sidebar").removeClass("visible");
          });

          // close popup on map click
          map.on("click", function () {
            $("div.custom-popup").removeClass("visible");
          });

          // close popup on map move
          map.on("mouseup", function () {
            $("div.custom-popup").removeClass("visible");
          });

          // close popup on map touch
          map.on("touchmove", function () {
            $("div.custom-popup").removeClass("visible");
          });
        });
      });

      // web - move popup when map is moved, so the popup will remain at the same distance from the marker
      // map.on('mouseup', function () {
      //     console.log('A mouseup event has occurred.');
      //     var topOffset = $(el).offset().top - 80;
      //     $('div.custom-popup').css('top', topOffset);

      //     var leftOffset = $(el).offset().left - 160;
      //     $('div.custom-popup').css('left', leftOffset);
      // });

      // mobile - move popup when map is moved, so the popup will remain at the same distance from the marker
      // map.on('touchmove', function () {
      //     console.log('A mouseup event has occurred.');
      //     var topOffset = $(el).offset().top - 80;
      //     $('div.custom-popup').css('top', topOffset);

      //     var leftOffset = $(el).offset().left - 160;
      //     $('div.custom-popup').css('left', leftOffset);
      // });

      // add marker to map
      new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        // .setPopup(popup)
        .addTo(map);

      map.fitBounds(bounds, { padding: 80 });
    });
  }
);
