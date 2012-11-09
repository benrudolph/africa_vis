var ScatterPlot = function(selector, data, height, width, africa, cyFn, name, yLabel) {
  this.data = data.filter(function(d) {
    if (+d["AgeGroupFemale(Total)"] > 0 && +d["AgeGroupMale(Total)"] > 0) {
      return d
    }
  })
  this.margin = 80
  this.height = height
  this.width = width
  this.africa = africa
  this.circleHash = {}
  this.cyFn = cyFn
  this.name = name
  this.yLabel = yLabel
  this.tooltipWidth = 100
  this.tooltipHeight = 40

  this.isArrowVisible = true
  this.arrowSelection = "#scatterArrow"

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
      .domain([1, 0])
      .range([this.margin / 2, this.height - this.margin])

  this.x = d3
      .scale
      .log()
      .domain(d3.extent(this.data, function(d) {
        return (+d["AgeGroupMale(Total)"] + +d["AgeGroupFemale(Total)"]) + 1
      }.bind(this)))
      .range([this.margin / 2, this.width - (this.margin / 2)])

  this.xAxis = d3.svg.axis()
      .scale(this.x)
      .tickValues([100, 1000, 10000, 100000, 500000])
      .tickFormat(d3.format(",.0f"))
      .orient("bottom")

  this.yAxis = d3.svg.axis()
      .scale(this.y)
      .tickFormat(d3.format(".0%"))
      .orient("left")

  this.radius = 5
  this.selectedCircle = null
  this.brush = d3.svg.brush()
      .on("brushstart", this.brushstart.bind(this))
      .on("brush", this.brush.bind(this))
      .on("brushend", this.brushend.bind(this));

}

ScatterPlot.method("render", function(d) {
  this.svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + (this.height - (this.margin)) + ")")
      .call(this.xAxis)

  this.svg
      .append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + (this.margin / 2) + ", 0)")
      .call(this.yAxis)

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
      .call(this.brush.x(this.x).y(this.y))

  this.brush.data = this.data

  var that = this

  this.svg
      .selectAll(".circle")
      .data(this.data)
      .enter()
      .append("circle")
      .attr("cx", function(d, i) {
        return this.x(+d["AgeGroupFemale(Total)"] + +d["AgeGroupMale(Total)"])
      }.bind(this))
      .attr("cy", function(d) {
        return this.height - (this.y(this.cyFn(d))) - (this.margin / 2)
      }.bind(this))
      .attr("r", this.radius)
      .attr("class", function(d) {
        return d.Type_of_accom + " " + this.name + " show"
      }.bind(this))
      .attr("dID", function(d) {
        return d.ID
      })
      .attr("address", function(d) {
        return d.Address
      })
      .on("mouseover", function(d) {
        that.showTooltip(this, d, that)
      })
      .on("mouseout", function(d) {
        that.hideTooltip(this, d)
      })
      .on("click", function(d) {
        that.africa.setSelected(d.ID)
      })


  d3.selectAll("." + this.name)[0]
      .forEach(function(d) {
        this.circleHash[d3.select(d).attr("dID")] = d
      }.bind(this))

  this.svg
      .append("text")
      .attr("class", "x scatter_label")
      .attr("text-anchor", "middle")
      .attr("x", (this.width / 2))
      .attr("y", this.height - (this.margin / 2))
      .style("font-size", "8px")
      .text("Total Population (log scale)")

  this.svg
      .append("text")
      .attr("class", "y scatter_label")
      .attr("text-anchor", "middle")
      .attr("x", -this.height / 2)
      .attr("y", 0)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .style("font-size", "8px")
      .text(this.yLabel)

})

ScatterPlot.method("hideTooltip", function(circle, d) {
  d3.select("#tooltip" + d.ID).remove()
})

ScatterPlot.method("showTooltip", function(circle, d, that) {
  var circleSelection = d3.select(circle)

  this.svg
      .append("text")
      .attr("x", circleSelection.attr("cx") - (that.tooltipWidth / 2) + (that.margin / 2) + 5)
      .attr("y", circleSelection.attr("cy") - (that.tooltipHeight / 2))
      .attr("width", that.tooltipWidth)
      .attr("height", that.tooltipHeight)
      .attr("id", "tooltip" + d.ID)
      .attr("text-anchor", "middle")
      .attr("class", "svgTooltip")
      .text(d.Address)
})


ScatterPlot.method("clearArrow", function() {
  d3.select(this.arrowSelection)
      .style("display", "none")
})

ScatterPlot.method("brushstart", function(d) {
  if (this.isArrowVisible) {
    this.clearArrow()
    this.isArrowVisible = false
  }
  this.africa.setActiveBrush(this.name)
})

ScatterPlot.method("clearBrushes", function() {
  this.svg.call(this.brush.clear())
})

ScatterPlot.method("brush", function(p) {
  var e = this.brush.extent()
  var ids = []
  this.svg.selectAll("." + this.name).each(function(d) {
    var population = +d["AgeGroupFemale(Total)"] + +d["AgeGroupMale(Total)"]
    var percent = 1 - this.cyFn(d)
    if (e[0][0] <= population && population <= e[1][0]
      && e[0][1] <= percent && percent <= e[1][1]) {
      ids.push(d.ID)
    }
  }.bind(this))

  this.africa.highlight(ids)
})

ScatterPlot.method("highlight", function(ids) {
  for (var key in this.circleHash) {
    if (ids.indexOf(key) !== -1) {
      d3.select(this.circleHash[key]).classed(this.name + " show", true)
      d3.select(this.circleHash[key]).classed("dim", false)
    }
    else {
      d3.select(this.circleHash[key]).classed("show", false)
      d3.select(this.circleHash[key]).classed("dim", true)
    }
  }
})

ScatterPlot.method("brushend", function(d) {
  var ids = []
  if (this.brush.empty()) {
    this.svg.selectAll("." + this.name).each(function(d) {
      ids.push(d.ID)
    })
    this.africa.highlight(ids)
  }

})

ScatterPlot.method("setSelectedCircle", function(id) {
  if (this.selectedCircle !== null)
    this.selectedCircle.classed("selected", false)
  this.selectedCircle = d3.select(this.circleHash[id])
  this.selectedCircle.classed("selected", true)
})
