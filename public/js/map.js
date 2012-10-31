var Map = function(data, options) {
  this.data = data
  this.options = options

  this.gMap = new google.maps.Map(document.getElementById("map"), this.options);
  this.markers = []

  this.barGraph = null
  this.markerWidth = 10
  this.markerHeight = 18

  this.selectedMarkerWidth = 20
  this.selectedMarkerHeight = 38
  this.selectedMarker = null


  this.default = this.data[51]

  this.barGraph = new BarGraph("#graph", this.default, 200, 480)
}

Map.method("init", function() {
  this.placeMarkers()
  this.barGraph.render()
})

// TODO: Speed this up
Map.method("getMarkerImage", function(d, width, height) {
  var markerImage;

  if (d.Type_of_accom === "Undefined") {
    markerImage = new google.maps.MarkerImage( "images/undefined_marker.png", null, null, null,
        new google.maps.Size(width, height))
  } else if (d.Type_of_accom === "Camp") {
    markerImage = new google.maps.MarkerImage( "images/camp_marker.png", null, null, null,
        new google.maps.Size(width, height))
  } else if (d.Type_of_accom === "Individual accommodation") {
    markerImage = new google.maps.MarkerImage( "images/individual_marker.png", null, null, null,
        new google.maps.Size(width, height))
  } else if (d.Type_of_accom === "Dispersed") {
    markerImage = new google.maps.MarkerImage( "images/dispersed_marker.png", null, null, null,
        new google.maps.Size(width, height))
  } else if (d.Type_of_accom === "Center") {
    markerImage = new google.maps.MarkerImage( "images/center_marker.png", null, null, null,
        new google.maps.Size(width, height))
  } else if (d.Type_of_accom === "Settlement") {
    markerImage = new google.maps.MarkerImage( "images/settlement_marker.png", null, null, null,
        new google.maps.Size(width, height))
  } else {
    markerImage = new google.maps.MarkerImage( "images/undefined_marker.png", null, null, null,
        new google.maps.Size(width, height))
  }
  return markerImage
})

Map.method("placeMarkers", function() {
  var marker;
  this.data.forEach(function(d) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(d.Lat, d.Lng),
      map: this.gMap,
      title: d.Address,
      icon: this.getMarkerImage(d, this.markerWidth, this.markerHeight)
    })
    this.markers.push(marker)

    var that = this
    google.maps.event.addListener(marker, "click", (function(marker, d) {
      return function() {
        var markerImage;
        if (that.selectedMarker !== null) {
          markerImage = that.getMarkerImage(d,
              that.selectedMarkerWIdth,
              that.selectedMarkerHeight)
          that.selectedMarker.setIcon(markerImage)
        }

        markerImage = that.getMarkerImage(d, that.selectedMarkerWidth, that.selectedMarkerHeight)
        marker.setIcon(markerImage)
        that.selectedMarker = marker

        that.barGraph.update(d)
      }
    })(marker, d))


  }.bind(this))
})


