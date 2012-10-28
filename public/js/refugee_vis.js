var Africa = function(selector, data) {
  this.data = data

  this.barGraph = new BarGraph("body", this.data.filter(function(d) {
    if (d.Country === "Algeria" && d.Year === "2011" && d.Type_of_location === "U" &&
        d.Type_of_accom === "Undefined")
      return d
  }), "age_group", "value", 400, 480)
}

var BarGraph = function(selector, data, category, value, height, width) {
  this.maleData = data.filter(function(d) {
    if (d[category].match(/Male/))
      return d
  })
  this.femaleData = data.filter(function(d) {
    if (d[category].match(/Female/))
      return d
  })

  this.category = category
  this.value = value
  this.height = height
  this.width = width
  this.padding = 150
  this.barWidth = 20

  this.svg = d3
      .select(selector)
      .append("svg")
      .attr("class", "barChart")
      .attr("height", height)
      .attr("width", width)
      .append("svg:g")

  this.y = d3
      .scale
      .ordinal()
      .rangePoints([0, height], 1),

  this.x = d3
      .scale
      .linear()
      .domain(d3.extent(data, function(d) {
        return +d[value]
      }))
      .range([0, width / 2]),

  domain = []
  data.forEach(function(d) {
    if (domain.indexOf(d[category]) === -1)
      domain.push(d[category])
  })

  this.y.domain(domain)
  this.y.domain(domain)
}

BarGraph.method("render", function() {

  this.svg
      .selectAll(".male")
      .data(this.maleData)
      .enter()
      .append("rect")
      .attr("class", "male")
      .attr("height", this.barWidth)
      .attr("fill", "steelblue")
      .attr("width", function(d) {
        return this.x(+d[this.value])
      }.bind(this))
      .attr("x", function(d) {
        return this.width / 2
      }.bind(this))
      .attr("y", function(d) {
        return this.y(d[this.category]) - (this.height / 2)
      }.bind(this))

  this.svg
      .selectAll(".female")
      .data(this.femaleData)
      .enter()
      .append("rect")
      .attr("class", "female")
      .attr("height", this.barWidth)
      .attr("fill", "pink")
      .attr("width", function(d) {
        return this.x(+d[this.value])
      }.bind(this))
      .attr("x", function(d) {
        return (this.width / 2) - this.x(+d[this.value])
      }.bind(this))
      .attr("y", function(d) {
        return this.y(d[this.category])
      }.bind(this))

  this.svg
      .selectAll(".maleValue")
      .data(this.maleData)
      .enter()
      .append("text")
      .attr("class", "maleValue")
      .attr("y", function(d) {
        return this.y(d[this.category]) - (this.height / 2) + (this.barWidth / 2)
      }.bind(this))
      .attr("x", function(d) {
        var x = (this.width / 2) + this.x(+d[this.value]) - 10
        if (x < (this.width / 2) + 10) {
          x = this.width / 2 + 7
        }
        return x
      }.bind(this))
      .attr("text-anchor", "middle")
      .attr("dy", ".35em") // vertical-align: middle
      .style("fill", "black")
      .style("font-size", 10)
      .text(function(d) { return d[this.value] }.bind(this))

  /*
  this.svg
      .selectAll(".label")
      .data(this.data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("y", this.height - this.padding)
      .attr("x", function(d) {
        return this.x(d[this.category])
      }.bind(this))
      .attr("dy", ".35em") // vertical-align: middle
      .attr("text-anchor", "start")
      .style("writing-mode", "tb")
      .text(function(d) {
        return d[this.category].match(/\(.*\)/)[0]
      }.bind(this))*/
})
