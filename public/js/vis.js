Function.prototype.method = function(name, func) {
  this.prototype[name] = func
  return this
}

d3.csv("/data/data.csv", function(data) {
  var africa = new Africa("#content", data)
  africa.barGraph.render()
})