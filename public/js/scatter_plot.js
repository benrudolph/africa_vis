var ScatterPlot = function(selector, data, height, width) {
  this.data = data.filter(function(d) {
    if (d.Age_group === "AgeGroupMale(Total)") {
      d.isMale = true
      return d
    }
    else if (d.Age_group === "AgeGroupFemale(Total)") {
      d.isMale = false
      return d
    }
  })
  // Highly sensitive to how data is laid out, should restructure data in SQL
  this.data.forEach(function(current, index, array) {
    if (index === 0)
      return
    var previous = array[index - 1]
    if (current.isMale && current.Location === previous.Location &&
        current.Country === previous.Country) {
      current["TotalFemale"] = previous["Value"]
      current["TotalMale"] = current["Value"]
      current["isMale"] = undefined
    }
  })
  this.data = this.data.filter(function(d) {
    if (d["isMale"] === undefined && +d.Coverage > 0)
      return d
  })

  this.margin = 10
  this.height = height
  this.width = width

  this.svg = d3
      .select(selector)
      .append("svg")
      .attr("class", "scatterPlot")
      .attr("height", height)
      .attr("width", width)
      .append("svg:g")

  this.y = d3
      .scale
      .linear()
      .domain(d3.extent(this.data, function(d) {
        return +d.TotalFemale
      }.bind(this)))
      .range([this.margin / 2, this.height - this.margin])

  this.x = d3
      .scale
      .linear()
      .domain(d3.extent(this.data, function(d) {
        return +d.TotalMale
      }.bind(this)))
      .range([this.margin / 2, this.width - this.margin])

  this.radius = 5

}

ScatterPlot.method("render", function(d) {
  this.svg
      .selectAll(".circle")
      .data(this.data)
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("cy", function(d) {
        return this.height - this.y(d.TotalFemale)
      }.bind(this))
      .attr("cx", function(d) {
        return this.x(d.TotalMale)
      }.bind(this))
      .attr("r", this.radius)
      .attr("fill", "black")
})
