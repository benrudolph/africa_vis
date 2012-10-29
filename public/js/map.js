var Map = function(selector, options, countries) {
  this.options = options
  this.geocoder = new google.maps.Geocoder()

  this.gMap = new google.maps.Map(document.getElementById("map"), this.options);
  this.markers = []
  this.marker = new google.maps.Marker({
    position: this.gMap.getCenter(),
    map: this.gMap,
    title: "Click for statistics"
  })
  this.geocoder = new google.maps.Geocoder();
  google.maps.event.addListener(this.marker, "click", function() {
    console.log("a")
  })
  this.marker = new google.maps.Marker({
    position: Map.COUNTRY_MAP.Algeria,
    map: this.gMap,
    title: "AL"
  })

  //this.createCountryMarkers(countries)
  this.barGraph = null
  this.locations = locations
  this.placeMarkers()
}

Map.COUNTRY_MAP = {
  "Algeria": new google.maps.LatLng(28, 1.65),
  "Angola": new google.maps.LatLng(-11.2, 17.87),
  "Benin": new google.maps.LatLng(9.3, 2.315),
  "Botswana": new google.maps.LatLng(-22.3, 24.68),
  "Burkina Faso": new google.maps.LatLng(12.2, -1.56),
  "Burundi": new google.maps.LatLng(-3.37, 29.91),
  "Cameroon": new google.maps.LatLng(7.36, 12.35)
}

Map.method("placeMarkers", function() {
  var marker;
  for (var key in this.locations) {
    marker = new google.maps.Marker({
      position: this.locations[key],
      map: this.gMap,
      title: key
    })
    this.markers.push(marker)
    google.maps.event.addListener(marker, "click", (function(marker, key) {
      return function() {
        alert(marker.title)
      }
    })(marker, key))
  }
})


