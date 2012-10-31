var Map = function(data, options) {
  this.data = data
  this.options = options

  this.gMap = new google.maps.Map(document.getElementById("map"), this.options);
  this.markers = []

  this.barGraph = null
  this.locations = window.locations
  this.placeMarkers()
  this.default = this.data[51]
  this.barGraph = new BarGraph("#graph", this.data.filter(function(d) {
    var loc = this.default.Location
    var country = this.default.Country
    if (d.Country === country && d.Location === loc && d.Year === "2011") {
      return d
    }
  }.bind(this)), 200, 480)
}

Map.method("init", function() {
  this.barGraph.render()
})

// TODO: Speed this up
Map.method("getMarkerImage", function(location) {
  var accom;
  var markerImage;
  var BreakException = {}
  try {
    this.data.forEach(function(d) {
      if (d.Location + "," + d.Country === location) {
        accom = d.Type_of_accom
        if (accom === "Undefined") {
          markerImage = new google.maps.MarkerImage( "images/undefined_marker.png", null, null, null,
              new google.maps.Size(20, 38))
        } else if (accom === "Camp") {
          markerImage = new google.maps.MarkerImage( "images/camp_marker.png", null, null, null,
              new google.maps.Size(20, 38))
        } else if (accom === "Individual accommodation") {
          markerImage = new google.maps.MarkerImage( "images/individual_marker.png", null, null, null,
              new google.maps.Size(20, 38))
        } else if (accom === "Dispersed") {
          markerImage = new google.maps.MarkerImage( "images/dispersed_marker.png", null, null, null,
              new google.maps.Size(20, 38))
        } else if (accom === "Center") {
          markerImage = new google.maps.MarkerImage( "images/center_marker.png", null, null, null,
              new google.maps.Size(20, 38))
        } else if (accom === "Settlement") {
          markerImage = new google.maps.MarkerImage( "images/settlement_marker.png", null, null, null,
              new google.maps.Size(20, 38))
        } else {
          markerImage = new google.maps.MarkerImage( "images/undefined_marker.png", null, null, null,
              new google.maps.Size(20, 38))
        }
        throw BreakException
      }
    })
  } catch (e) {
    if (e!==BreakException) throw e;
  }
  return markerImage
})

Map.method("placeMarkers", function() {
  var marker;
  for (var key in this.locations) {
    marker = new google.maps.Marker({
      position: this.locations[key],
      map: this.gMap,
      title: key,
      icon: this.getMarkerImage(key)
    })
    this.markers.push(marker)
    var that = this
    google.maps.event.addListener(marker, "click", (function(marker, key) {
      return function() {
        var location = marker.title.split(",")[0]
        var country = marker.title.split(",")[1]
        var data = that.data.filter(function(d) {
          if (d.Country === country && d.Location === location && d.Year === "2011") {
            return d
          }
        })
        that.barGraph.update(data)
      }
    })(marker, key))
  }
})


