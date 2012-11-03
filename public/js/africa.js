var Africa = function(data) {
  var mapOptions = {
    center: new google.maps.LatLng(0, 17),
    zoom: 3,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    minZoom: 3,
    maxZoom: 5
  }

  this.map = new Map(data, mapOptions, this)
  var cyFnMalePercent = function(d) {
    return +d["AgeGroupFemale(Total)"] /
            (+d["AgeGroupFemale(Total)"] + +d["AgeGroupMale(Total)"])
  }
  var cyFnUNHCRPercent = function(d) {
    return 1 - ((+d["AgeGroupFemale(Total)"] + +d["AgeGroupMale(Total)"]) /
            +d["Population_of_concern_to_UNHCR"])
  }
  var cyFnYouthPercent = function(d) {
    return 1 - ((+d["AgeGroupFemale(0-4)"] + +d["AgeGroupFemale(5-17)"] +
            +d["AgeGroupMale(0-4)"] + +d["AgeGroupMale(5-17)"]) /
            (+d["AgeGroupFemale(Total)"] + +d["AgeGroupMale(Total)"]))
  }
  this.scatter1 = new ScatterPlot("#scatter1", data, 300, 400, this, cyFnMalePercent, "MalePercent", "Percentage of population that is male")
  this.scatter2 = new ScatterPlot("#scatter2", data, 300, 400, this, cyFnYouthPercent, "YouthPercent", "Percentage of population that is 17 or under")
  this.scatter1.render()
  this.scatter2.render()
  this.map.init()
  this.activeBrush = null

}

Africa.method("setSelected", function(id) {
  this.map.setSelectedMarker(id)
  this.scatter1.setSelectedCircle(id)
  this.scatter2.setSelectedCircle(id)

})

Africa.method("setActiveBrush", function(name) {
  if (name !== this.activeBrush) {
    this.scatter1.clearBrushes()
    this.scatter2.clearBrushes()
    this.activeBrush = name
  }
})

Africa.method("highlight", function(ids) {
  this.map.brush(ids)
  this.scatter1.highlight(ids)
  this.scatter2.highlight(ids)
})
