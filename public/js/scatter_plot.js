var ScatterPlot = function(selector, data, height, width) {
  this.data = data.filter(function(d) {
    if (+d["AgeGroupFemale(Total)"] > 0 && +d["AgeGroupMale(Total)"] > 0) {
      return d
    }
  })
  this.margin = 20
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
      .domain([0, 1])
      .range([this.margin / 2, this.height - this.margin])

  this.x = d3
      .scale
      .log()
      .domain(d3.extent(this.data, function(d) {
        return (+d["AgeGroupMale(Total)"] + +d["AgeGroupFemale(Total)"])
      }.bind(this)))
      .range([this.margin / 2, this.width - this.margin])

  this.radius = 5

}

ScatterPlot.method("render", function(d) {
  /*this.svg
      .selectAll(".xticks")
      .data(this.x.ticks(1))
      .enter().append("line")
      .attr("class", "xticks")
      .attr("x1", this.x)
      .attr("x2", this.x)
      .attr("y1", this.margin / 2)
      .attr("y2", this.height - (this.margin / 2))
      .style("stroke", "#ccc");*/

  /*this.svg
      .selectAll(".xrule")
      .data(this.x.ticks(10))
      .enter()
      .append("text")
      .attr("class", "rule")
      .attr("x", this.x)
      .attr("y", this.height - (this.margin / 2))
      .attr("dy", -3)
      .attr("text-anchor", "middle")
      .text(String)*/

  this.svg
      .selectAll(".yticks")
      .data(this.y.ticks(2))
      .enter().append("line")
      .attr("y1", this.y)
      .attr("y2", this.y)
      .attr("x1", this.margin / 2)
      .attr("x2", this.width - (this.margin / 2))
      .style("stroke", function(d, i) {
        if (i === 1) return "red"
        else return "#ccc"
      });

  this.svg
      .append("line")
      .attr("class", "refline")

  this.svg
      .selectAll(".circle")
      .data(this.data)
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("cx", function(d) {
        return this.x(+d["AgeGroupFemale(Total)"] + +d["AgeGroupMale(Total)"])
      }.bind(this))
      .attr("cy", function(d) {
        return this.height - this.y(+d["AgeGroupMale(Total)"] /
            (+d["AgeGroupFemale(Total)"] + +d["AgeGroupMale(Total)"]))
      }.bind(this))
      .attr("r", this.radius)
      .attr("info", function(d) {
        return d.Location + ", " + d.Country
      })
      .attr("fill", "black")
      .style("opacity", ".7")

  // Hack to apply bootstrap event to d3 selection
  d3.selectAll(".circle")[0]
      .forEach(function(d) {
        var options = {
          title: $(d).attr("info")
        }
        $(d).tooltip(options)
      })

})
