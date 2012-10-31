Function.prototype.method = function(name, func) {
  this.prototype[name] = func
  return this
}

d3.csv("/data/age_data.csv", function(age_data) {
d3.csv("/data/refugee_data.csv", function(data) {
  var mapOptions = {
    center: new google.maps.LatLng(0, 17),
    zoom: 3,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    minZoom: 3,
    maxZoom: 5
  }

  var map = new Map(data, mapOptions)
  map.init()
  var scatter = new ScatterPlot("#scatter", age_data, 500, 500)
  scatter.render()
})
})
