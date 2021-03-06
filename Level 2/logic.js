// Get data url
queryurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"


// console.log("it's working")
// Get marker color based on earthquake magnitude
function getColor(mag) {
    if (mag >= 5) {
        return "rgb(240, 107, 107)" 
    } else {
        if (mag > 4) {
            return "rgb(240, 167, 107)"
        } else {
            if (mag > 3) {
                return "rgb(243, 186, 77)"
            } else {
                if (mag > 2) {
                    return "rgb(243, 219, 77)"
                } else {
                    if (mag > 1) {
                        return "rgb(226, 243, 77)"
                    } else {
                        return "rgbrgb(183, 243, 77)"
                    }
                }
            }
        }
    }
};

// Declare function to create map features.
function createFeatures(earthquakeData) {
    // Create popup layers using earthquake title, type and magnitude, and depth
    function onEachFeature(feature, layer) {
        layer.bindPopup("<p>" + feature.properties.title + "</p>" +
            "<p>Type: " + feature.properties.type + "</p>" +
            "<p>Magnitude: " + feature.properties.mag + "</p>" +
            "<p>" + "Depth: " + feature.geometry.coordinates[2] + "</p>");
    }
    //Create circle markers for each earthquake in the data set.
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            // Make circle radius dependent on the magnitude and get color based on the depth
            return new L.CircleMarker(latlng, {
                radius: feature.properties.mag * 5,
                fillOpacity: 1,
                color: getColor(feature.geometry.coordinates[2])
            })
        },
        // Append popups on each feature
        onEachFeature: onEachFeature
    });
    // Call create map function using the earthquakes data
    createMap(earthquakes);
};

// Declare function to create map (day 1, ex 1)
function createMap(earthquakes) {
    // Get initial light layer
    var mapLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "?? <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> ?? <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize:512,
      maxZoom: 11,
      zoomOffset: -1,
      id: "mapbox/satellite-v9",
      accessToken: API_KEY
    });
    
    // Declare map object and set it to the map element in the DOM
    var myMap = L.map("map", {
        center: [37.5407, -77.4360],
        zoom: 4.5,
        layers: [mapLayer, earthquakes]
    });

    //create plate lines
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(plateData) {
        L.geoJSON(plateData, {
            color:"orange",
            weight: 1.5
        })
            .addTo(myMap);
    });

    // Create a legend for the map based on the earthquakes data and colors
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var colors = [
            "rgb(183, 243, 77)",
            "rgb(226, 243, 77)",
            "rgb(243, 219, 77)",
            "rgb(243, 186, 77)",
            "rgb(240, 167, 107)",
            "rgb(240, 107, 107)"];
        var labels = [];

        var legendInfo = "<h1>Earthquake Depth<h1>" + 
            "<div class=\"labels\">" +
                "<div class=\"max\">5+</div>" +
                "<div class=\"fourth\">4-5</div>" +
                "<div class=\"third\">3-4</div>" +
                "<div class=\"second\">2-3</div>" +
                "<div class=\"first\">1-2</div>" +
                "<div class=\"min\">0-1</div>" +
            "</div>";

        div.innerHTML = legendInfo;

        colors.forEach(function(color) {
            labels.push("<li style=\"background-color: " + color + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    // Append label to the map
    legend.addTo(myMap);

};

// Get earthquakes data
d3.json(queryurl).then(function(data) {
    // Create features with the earthquakes data
    // console.log ("it's working")
    createFeatures(data.features)
});

