var BarGraph = function(selector, data, height, width) {
  this.category = "Age_group"
  this.value = "Value"
  this.maleData = data.filter(function(d) {
    if (d[this.category].match(/Male/))
      return d
  }.bind(this))
  this.femaleData = data.filter(function(d) {
    if (d[this.category].match(/Female/))
      return d
  }.bind(this))

  this.height = height
  this.width = width
  this.barWidth = 20
  this.middlePadding = 40

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
        return +d[this.value]
      }.bind(this)))
      .range([0, (width / 2) - (this.middlePadding / 2)]),

  this.domain = []
  data.forEach(function(d) {
    var trimmedCategory = d[this.category].match(/\(.*\)/)[0]
    if (this.domain.indexOf(trimmedCategory) === -1)
      this.domain.push(trimmedCategory)
  }.bind(this))

  this.y.domain(this.domain)
}

BarGraph.method("update", function(data) {
  this.maleData = data.filter(function(d) {
    if (d[this.category].match(/Male/))
      return d
  }.bind(this))
  this.femaleData = data.filter(function(d) {
    if (d[this.category].match(/Female/))
      return d
  }.bind(this))

  this.x = d3
      .scale
      .linear()
      .domain(d3.extent(data, function(d) {
        return +d[this.value]
      }.bind(this)))
      .range([0, (this.width / 2) - (this.middlePadding / 2)])


  var males = this.svg
      .selectAll(".male")
      .data(this.maleData)

  males
      .transition()
      .duration(500)
      .attr("width", function(d) {
        return this.x(+d[this.value])
      }.bind(this))
      .attr("x", function(d) {
        return (this.width / 2) + (this.middlePadding / 2)
      }.bind(this))
      .attr("y", function(d) {
        return this.y(d[this.category]) - (this.barWidth / 2)
      }.bind(this))

  var females = this.svg
      .selectAll(".female")
      .data(this.femaleData)

  females
      .transition()
      .duration(500)
      .attr("width", function(d) {
        return this.x(+d[this.value])
      }.bind(this))
      .attr("x", function(d) {
        return ((this.width / 2) - (this.middlePadding / 2)) - this.x(+d[this.value])
      }.bind(this))
      .attr("y", function(d) {
        return this.y(d[this.category]) - (this.barWidth / 2)
      }.bind(this))

  var maleValues = this.svg
      .selectAll(".maleValue")
      .data(this.maleData)


  maleValues
      .transition()
      .duration(500)
      .attr("y", function(d) {
        return this.y(d[this.category])
      }.bind(this))
      .attr("x", function(d) {
        var x = ((this.width / 2) + (this.middlePadding / 2)) + this.x(+d[this.value]) - 10
        if (x < ((this.width / 2) + (this.middlePadding / 2)) + 10) {
          x = ((this.width / 2) + (this.middlePadding / 2)) + 7
        }
        return x
      }.bind(this))
      .attr("text-anchor", "middle")
      .attr("dy", ".35em") // vertical-align: middle
      .style("fill", "black")
      .style("font-size", 10)
      .text(function(d) { return d[this.value] }.bind(this))

  var femaleValues = this.svg
      .selectAll(".femaleValue")
      .data(this.femaleData)

  femaleValues
      .transition()
      .duration(500)
      .attr("y", function(d) {
        return this.y(d[this.category])
      }.bind(this))
      .attr("x", function(d) {
        var x = ((this.width / 2) - (this.middlePadding / 2)) - this.x(+d[this.value]) + 10
        if (x > ((this.width / 2) - (this.middlePadding / 2)) - 10) {
          x = ((this.width / 2) - (this.middlePadding / 2)) - 7
        }
        return x
      }.bind(this))
      .attr("text-anchor", "middle")
      .attr("dy", ".35em") // vertical-align: middle
      .style("fill", "black")
      .style("font-size", 10)
      .text(function(d) { return d[this.value] }.bind(this))


})

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
        return (this.width / 2) + (this.middlePadding / 2)
      }.bind(this))
      .attr("y", function(d) {
        return this.y(d[this.category]) - (this.barWidth / 2)
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
        return ((this.width / 2) - (this.middlePadding / 2)) - this.x(+d[this.value])
      }.bind(this))
      .attr("y", function(d) {
        return this.y(d[this.category]) - (this.barWidth / 2)
      }.bind(this))

  this.svg
      .selectAll(".maleValue")
      .data(this.maleData)
      .enter()
      .append("text")
      .attr("class", "maleValue")
      .attr("y", function(d) {
        return this.y(d[this.category])
      }.bind(this))
      .attr("x", function(d) {
        var x = ((this.width / 2) + (this.middlePadding / 2)) + this.x(+d[this.value]) - 10
        if (x < ((this.width / 2) + (this.middlePadding / 2)) + 10) {
          x = ((this.width / 2) + (this.middlePadding / 2)) + 7
        }
        return x
      }.bind(this))
      .attr("text-anchor", "middle")
      .attr("dy", ".35em") // vertical-align: middle
      .style("fill", "black")
      .style("font-size", 10)
      .text(function(d) { return d[this.value] }.bind(this))

  this.svg
      .selectAll(".femaleValue")
      .data(this.femaleData)
      .enter()
      .append("text")
      .attr("class", "femaleValue")
      .attr("y", function(d) {
        return this.y(d[this.category])
      }.bind(this))
      .attr("x", function(d) {
        var x = ((this.width / 2) - (this.middlePadding / 2)) - this.x(+d[this.value]) + 10
        if (x > ((this.width / 2) - (this.middlePadding / 2)) - 10) {
          x = ((this.width / 2) - (this.middlePadding / 2)) - 7
        }
        return x
      }.bind(this))
      .attr("text-anchor", "middle")
      .attr("dy", ".35em") // vertical-align: middle
      .style("fill", "black")
      .style("font-size", 10)
      .text(function(d) { return d[this.value] }.bind(this))

  this.svg
      .selectAll(".label")
      .data(this.domain)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("y", function(d) {
        return this.y(d)
      }.bind(this))
      .attr("x", (this.width / 2))
      .attr("text-anchor", "middle")
      .attr("dy", ".35em") // vertical-align: middle
      .style("font-size", 10)
      .text(String)
})
