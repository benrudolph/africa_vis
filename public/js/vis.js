Function.prototype.method = function(name, func) {
  this.prototype[name] = func
  return this
}

$(document).ready(function() {
  d3.csv("/data/data.csv", function(data) {
    var africa = new Africa(data)
  })
})
