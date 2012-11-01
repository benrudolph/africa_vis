var Africa = function(data) {
  var mapOptions = {
    center: new google.maps.LatLng(0, 17),
    zoom: 3,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    minZoom: 3,
    maxZoom: 5
  }

  this.map = new Map(data, mapOptions, this)
  this.map.init()
  this.scatter = new ScatterPlot("#scatter", data, 300, 400, this)
  this.scatter.render()

}

Africa.method("setSelected", function(id) {
  this.map.setSelectedMarker(id)
  this.scatter.setSelectedCircle(id)

})

Africa.method("brush", function(ids) {
  this.map.brush(ids)
})
