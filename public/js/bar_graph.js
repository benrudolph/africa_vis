var BarGraph = function(selector, data, height, width) {
  this.dimensionMap = {
    "AgeGroupFemale(0-4)": "0-4",
    "AgeGroupFemale(5-11)": "5-11",
    "AgeGroupFemale(12-17)": "12-17",
    "AgeGroupFemale(18-59)": "18-59",
    "AgeGroupFemale(60+)": "60+",
    "AgeGroupFemale(Unknown)": "Unknown",
    "AgeGroupFemale(Total)": "Total",
    "AgeGroupMale(0-4)": "0-4",
    "AgeGroupMale(5-11)": "5-11",
    "AgeGroupMale(12-17)": "12-17",
    "AgeGroupMale(18-59)": "18-59",
    "AgeGroupMale(60+)": "60+",
    "AgeGroupMale(Unknown)": "Unknown",
    "AgeGroupMale(Total)": "Total"
  }

  this.transformData(data)
  this.height = height
  this.width = width
  this.barWidth = 20
  this.middlePadding = 50
  this.margin = 80
  this.textMargin = 20

  this.svg = d3
      .select(selector)
      .append("svg")
      .attr("class", "barGraph")
      .attr("height", height)
      .attr("width", width)
      .append("svg:g")

  this.y = d3
      .scale
      .ordinal()
      .rangePoints([this.margin / 2, height - (this.margin / 2)], 1),

  this.x = d3
      .scale
      .linear()
      .domain(d3.extent(this.maleData.concat(this.femaleData), function(d) {
        return +d.Count
      }.bind(this)))
      .range([this.margin / 2, (width / 2) - (this.middlePadding / 2) - this.margin / 2]),

  this.domain = []
  this.maleData.concat(this.femaleData).forEach(function(d) {
    if (this.domain.indexOf(d.AgeGroup) === -1)
      this.domain.push(d.AgeGroup)
  }.bind(this))

  this.y.domain(this.domain)
}

BarGraph.method("transformData", function(data) {
  var hash = d3.map(data)
  var address = data.Address
  var id = data.ID

  this.maleData = []
  this.femaleData = []
  hash.forEach(function(key, value) {
    if (key.match(/Female/) && this.dimensionMap[key]) {
      var datum = {}
      datum["Address"] = address
      datum["ID"] = id
      datum["AgeGroup"] = this.dimensionMap[key]
      datum["Count"] = value
      this.femaleData.push(datum)
    } else if (key.match(/Male/) && this.dimensionMap[key]) {
      var datum = {}
      datum["Address"] = address
      datum["ID"] = id
      datum["AgeGroup"] = this.dimensionMap[key]
      datum["Count"] = value
      this.maleData.push(datum)
    }

  }.bind(this))


})

BarGraph.method("update", function(data) {
  this.transformData(data)

  this.x = d3
      .scale
      .linear()
      .domain(d3.extent(this.maleData.concat(this.femaleData), function(d) {
        return +d.Count
      }.bind(this)))
      .range([0, (this.width / 2) - (this.middlePadding / 2)])


  var males = this.svg
      .selectAll(".male")
      .data(this.maleData)

  males
      .transition()
      .duration(500)
      .attr("width", function(d) {
        return this.x(+d.Count)
      }.bind(this))
      .attr("x", function(d) {
        return (this.width / 2) + (this.middlePadding / 2)
      }.bind(this))
      .attr("y", function(d) {
        return this.y(d.AgeGroup) - (this.barWidth / 2)
      }.bind(this))

  var females = this.svg
      .selectAll(".female")
      .data(this.femaleData)

  females
      .transition()
      .duration(500)
      .attr("width", function(d) {
        return this.x(+d.Count)
      }.bind(this))
      .attr("x", function(d) {
        return ((this.width / 2) - (this.middlePadding / 2)) - this.x(+d.Count)
      }.bind(this))
      .attr("y", function(d) {
        return this.y(d.AgeGroup) - (this.barWidth / 2)
      }.bind(this))

  var maleValues = this.svg
      .selectAll(".maleValue")
      .data(this.maleData)


  maleValues
      .transition()
      .duration(500)
      .attr("y", function(d) {
        return this.y(d.AgeGroup)
      }.bind(this))
      .attr("x", function(d) {
        var x = ((this.width / 2) + (this.middlePadding / 2)) + this.x(+d.Count) - this.textMargin
        if (x < ((this.width / 2) + (this.middlePadding / 2)) + this.textMargin) {
          x = ((this.width / 2) + (this.middlePadding / 2)) + 7
        }
        return x
      }.bind(this))
      .attr("text-anchor", "middle")
      .attr("dy", ".35em") // vertical-align: middle
      .style("fill", "black")
      .style("font-size", 10)
      .text(function(d) { return d.Count }.bind(this))

  var femaleValues = this.svg
      .selectAll(".femaleValue")
      .data(this.femaleData)

  femaleValues
      .transition()
      .duration(500)
      .attr("y", function(d) {
        return this.y(d.AgeGroup)
      }.bind(this))
      .attr("x", function(d) {
        var x = ((this.width / 2) - (this.middlePadding / 2)) - this.x(+d.Count) + this.textMargin
        if (x > ((this.width / 2) - (this.middlePadding / 2)) - this.textMargin) {
          x = ((this.width / 2) - (this.middlePadding / 2)) - 7
        }
        return x
      }.bind(this))
      .attr("text-anchor", "middle")
      .attr("dy", ".35em") // vertical-align: middle
      .style("fill", "black")
      .style("font-size", 10)
      .text(function(d) { return d.Count }.bind(this))


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
        return this.x(+d.Count)
      }.bind(this))
      .attr("x", function(d) {
        return (this.width / 2) + (this.middlePadding / 2)
      }.bind(this))
      .attr("y", function(d) {
        return this.y(d.AgeGroup) - (this.barWidth / 2)
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
        return this.x(+d.Count)
      }.bind(this))
      .attr("x", function(d) {
        return ((this.width / 2) - (this.middlePadding / 2)) - this.x(+d.Count)
      }.bind(this))
      .attr("y", function(d) {
        return this.y(d.AgeGroup) - (this.barWidth / 2)
      }.bind(this))

  this.svg
      .selectAll(".maleValue")
      .data(this.maleData)
      .enter()
      .append("text")
      .attr("class", "maleValue")
      .attr("y", function(d) {
        return this.y(d.AgeGroup)
      }.bind(this))
      .attr("x", function(d) {
        var x = ((this.width / 2) + (this.middlePadding / 2)) + this.x(+d.Count) - this.textMargin
        if (x < ((this.width / 2) + (this.middlePadding / 2)) + this.textMargin) {
          x = ((this.width / 2) + (this.middlePadding / 2)) + 7
        }
        return x
      }.bind(this))
      .attr("text-anchor", "middle")
      .attr("dy", ".35em") // vertical-align: middle
      .style("fill", "black")
      .style("font-size", 10)
      .text(function(d) { return d.Count }.bind(this))

  this.svg
      .selectAll(".femaleValue")
      .data(this.femaleData)
      .enter()
      .append("text")
      .attr("class", "femaleValue")
      .attr("y", function(d) {
        return this.y(d.AgeGroup)
      }.bind(this))
      .attr("x", function(d) {
        var x = ((this.width / 2) - (this.middlePadding / 2)) - this.x(+d.Count) + this.textMargin
        if (x > ((this.width / 2) - (this.middlePadding / 2)) - this.textMargin) {
          x = ((this.width / 2) - (this.middlePadding / 2)) - 7
        }
        return x
      }.bind(this))
      .attr("text-anchor", "middle")
      .attr("dy", ".35em") // vertical-align: middle
      .style("fill", "black")
      .style("font-size", 10)
      .text(function(d) { return d.Count }.bind(this))

  this.svg
      .selectAll(".dimension")
      .data(this.domain)
      .enter()
      .append("text")
      .attr("class", "dimension")
      .attr("y", function(d) {
        return this.y(d)
      }.bind(this))
      .attr("x", (this.width / 2))
      .attr("text-anchor", "middle")
      .attr("dy", ".35em") // vertical-align: middle
      .style("font-size", 10)
      .text(String)
})
