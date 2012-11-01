var ScatterPlot = function(selector, data, height, width, africa) {
  this.data = data.filter(function(d) {
    if (+d["AgeGroupFemale(Total)"] > 0 && +d["AgeGroupMale(Total)"] > 0) {
      return d
    }
  })
  this.margin = 40
  this.height = height
  this.width = width
  this.africa = africa
  this.circleHash = {}

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
      .range([this.margin / 2, this.width - this.margin])

  this.xAxis = d3.svg.axis()
      .scale(this.x)
      .tickValues([0, 1000, 10000, 100000, 500000])
      .tickFormat(d3.format(",.0f"))
      .orient("bottom")

  this.yAxis = d3.svg.axis()
      .scale(this.y)
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
      .attr("transform", "translate(" + (this.margin / 2) + ", " + (this.height - (this.margin)) + ")")
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
        return this.height - (this.y(+d["AgeGroupFemale(Total)"] /
            (+d["AgeGroupFemale(Total)"] + +d["AgeGroupMale(Total)"]))) - (this.margin / 2)
      }.bind(this))
      .attr("r", this.radius)
      .attr("class", "circle show")
      .attr("dID", function(d) {
        return d.ID
      })
      .attr("address", function(d) {
        return d.Address
      })
      .attr("fill", function(d) {
        return "black"
      }.bind(this))
      .on("click", function(d) {
        that.africa.setSelected(d.ID)
      })


  // Hack to apply bootstrap event to d3 selection
  d3.selectAll(".circle")[0]
      .forEach(function(d) {
        var id = d3.select(d).attr("dID")
        var options = {
          title: d3.select(d).attr("address")
        }
        $(d).tooltip(options)
        this.circleHash[id] = d

      }.bind(this))

})

ScatterPlot.method("brushstart", function(d) {
})

ScatterPlot.method("brush", function(p) {
  var e = this.brush.extent()
  var ids = []
  this.svg.selectAll("circle").attr("class", function(d) {
    var population = +d["AgeGroupFemale(Total)"] + +d["AgeGroupMale(Total)"]
    var percent = 1 - (+d["AgeGroupFemale(Total)"] /
            (+d["AgeGroupFemale(Total)"] + +d["AgeGroupMale(Total)"]))
    if (e[0][0] <= population && population <= e[1][0]
      && e[0][1] <= percent && percent <= e[1][1]) {
      ids.push(d.ID)
      return "show"
    }
    return "dim"
  })

  this.africa.brush(ids)
})

ScatterPlot.method("brushend", function(d) {
  var ids = []
  if (this.brush.empty()) {
    this.svg.selectAll("circle").attr("class", function(d) {
      ids.push(d.ID)
      return "show"
    })
    this.africa.brush(ids)
  }

})

ScatterPlot.method("setSelectedCircle", function(id) {
  if (this.selectedCircle !== null)
    this.selectedCircle.attr("fill", "black")
  this.selectedCircle = d3.select(this.circleHash[id])
  this.selectedCircle.attr("fill", "red")
})
