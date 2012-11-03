var Map = function(data, options, africa) {
  this.data = data
  this.options = options
  this.africa = africa

  this.gMap = new google.maps.Map(document.getElementById("map"), this.options);
  this.markers = []
  this.markerHash = {}

  this.barGraph = null
  this.markerWidth = 10
  this.markerHeight = 18

  this.selectedMarkerWidth = 20
  this.selectedMarkerHeight = 38
  this.selectedMarker = null


  this.default = this.data[51]

  this.barGraph = new BarGraph("#graph", this.default, 250, 900)
}

Map.method("init", function() {
  this.placeMarkers()
  this.barGraph.render()
  this.africa.setSelected(this.default.ID)
})

Map.method("setSelectedMarker", function(id) {
  var markerImage;
  var marker = this.markerHash[id]
  if (this.selectedMarker !== null) {
    markerImage = this.getMarkerImage(this.selectedMarker.d,
        this.markerWidth,
        this.markerHeight)
    this.selectedMarker.setIcon(markerImage)
  }

  markerImage = this.getMarkerImage(marker.d, this.selectedMarkerWidth, this.selectedMarkerHeight)
  marker.setIcon(markerImage)
  this.selectedMarker = marker

  this.barGraph.update(this.selectedMarker.d)

})

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
    marker.d = d
    this.markers.push(marker)
    this.markerHash[d.ID] = marker

    var that = this
    google.maps.event.addListener(marker, "click", (function(marker, d) {
      return function() {
        that.africa.setSelected(d.ID)
      }
    })(marker, d))


  }.bind(this))
})

Map.method("brush", function(ids) {
  for (var key in this.markerHash) {
    if (ids.indexOf(key) !== -1 && this.markerHash[key].getMap() === null)
      this.markerHash[key].setMap(this.gMap)
    else if (ids.indexOf(key) === -1 && this.markerHash[key].getMap() !== null)
      this.markerHash[key].setMap(null)
  }
})
