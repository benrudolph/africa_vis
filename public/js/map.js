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
  this.placeMarkers()
  this.barGraph = null
  this.index = 0
  this.loadAddresses(addresses)
  this.locations = []
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
  for (var country in Map.COUNTRY_MAP) {
    marker = new google.maps.Marker({
      position: Map.COUNTRY_MAP[country],
      map: this.gMap,
      title: country
    })
    this.markers.push(marker)
    google.maps.event.addListener(marker, "click", function() {
      alert(marker.title)
    })
  }
})

Map.method("loadAddress", function(a) {
  if (this.index >= a.length) {
    $("body").html("")
    for (var idx in this.locations) {
      $("body").append(this.locations[idx])
    }
    clearInterval(this.iId)
    return
  }
  this.geocoder.geocode({ "address": a[this.index] }, function (results, status) {
        var loc;
        console.log(a[this.index])
        if (status == google.maps.GeocoderStatus.OK) {
            loc = results[0].geometry.location
            console.log("lat: " + loc.lat())
            console.log("lng: " + loc.lng())
            this.locations.push('"' + a[this.index] + '": new google.maps.LatLng(' + loc.lat() + ', ' + loc.lng() + '),<br />')
        } else {
          console.log(status)
        }
        if (status !== "OVER_QUERY_LIMIT")
          this.index += 1

      }.bind(this))

})

Map.method("loadAddresses", function(a) {
  this.iId = setInterval(this.loadAddress.bind(this), 800, a)
})

Map.method("createCountryMarkers", function(countries) {
  countries.forEach(function(country) {
    if (country in Map.COUNTRY_MAP)
      return
    this.geocoder.geocode({ "address": country }, function (results, status) {
        var loc;
        if (status == google.maps.GeocoderStatus.OK) {
            loc = results[0].geometry.location
            console.log(country)
            console.log("lat: " + loc.lat())
            console.log("lng: " + loc.lng())
        } else {
          console.log(status)
          return
        }

        this.markers.push(new google.maps.Marker({
          position: loc,
          map: this.gMap,
          title: country
        }))

      }.bind(this))
    }.bind(this))
})


