function makeResponsive() {

  let svgArea = d3.select("#scatter").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }

  let svgWidth = 950;
  let svgHeight = 700;

  // Setting the margins that will be used to get a chart area
  let margin = {
    top: 80,
    right: 80,
    bottom: 80,
    left: 80
  };

  //chart area

  let width = svgWidth - margin.left - margin.right;
  let height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  let svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Append an SVG group
  let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
  // newX
  let someX = "poverty";

  // update x_scale when clicking the axis label
  function xScale(povertyData, someX) {
      // create linear scales
      let xLinearScale = d3.scaleLinear()
        .domain([d3.min(povertyData, d => d[someX]) * .9, d3.max(povertyData, d => d[someX]) * 1.1
        ])
        .range([0, width]);
    
      return xLinearScale;
    
    }
    // update newX on click
    function renderAxes(newXScale, newX) {
      let newBottom = d3.axisBottom(newXScale);
     
      newX.transition()
        .duration(1000)
        .call(newBottom);

      return newX;
    }
    
    // function used for updating circles group with a transition to
    // new circles
    //create a new x scale and new y scale add to below (add a default parameter) chosenY = None next to chosen x 
    function renderCircles(circlesGroup, newXScale, someX) {
      circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[someX]));
    
      return circlesGroup;
    }
    
    // function used for updating circles group with new tooltip
    function updateToolTip(someX, circlesGroup) {
      let label;
    
      if (someX === "poverty") {
        label = "Poverty Percent:";
      }
      else {
        label = "Median Age:";
      }
    
      let toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([50, -30])
        .html(function(d) {
          return (`<strong>${d.abbr}<strong>`);
        });
        // <hr>${label} ${d[someX]}
    
      circlesGroup.call(toolTip);
        // do i need 'this'
      circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data) {
          toolTip.hide(data, this);
        });
    
      return circlesGroup;
    }

      // Retrieve data from the CSV file and execute everything below
    //load data
    d3.csv("assets/data/data.csv").then(function(povertyData) {
      console.log(povertyData);

      // parse data
      povertyData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
      });
    
      // xLinearScale function above csv import
      let xLinearScale = xScale(povertyData, someX);
    
      // Create y scale function
      let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(povertyData, d => d.healthcare)])
        .range([height, 0]);
    
      // Create initial axis functions
      let newBottom = d3.axisBottom(xLinearScale);
      let leftAxis = d3.axisLeft(yLinearScale);
    
      // append x axis
      let newX = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(newBottom);
    
      // append y axis
      chartGroup.append("g")
        .call(leftAxis);
    
      // append initial circles
      let circlesGroup = chartGroup.selectAll("circle")
        .data(povertyData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[someX]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 20)
        .attr("fill", "teal")
        .attr("opacity", ".75");

      let circleText = chartGroup.selectAll("text")
        .data(povertyData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[someX]))
        .attr("y", d => yLinearScale(d.healthcare))
        .text(function(d) {return d.abbr})
        .attr("font-size", "10px");
      
      // Create group for two x-axis labels
      let labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
      
      // one label on x axis
      let povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("Poverty Level (%)");
      
      //another label on x axis
      let ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Median Age");
    
      // label on y axis
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Lacking Healthcare (%)");
    
      // updateToolTip function above csv import
      circlesGroup = updateToolTip(someX, circlesGroup, circleText);
    
      // x axis labels event listener
      labelsGroup.selectAll("text")
        .on("click", function() {
          // get value of selection
          //we are grabbing value out of the above items based on whatever was clicked on
          let value = d3.select(this).attr("value");
          if (value !== someX) {
    
            // replaces somenewX with value
            someX = value;
    
            console.log(someX)
    
            // functions here found above csv import
            // updates x scale for new data
            xLinearScale = xScale(povertyData, someX);
    
            // updates x axis with transition
            newX = renderAxes(xLinearScale, newX);
    
            // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, someX);
    
            // updates tooltips with new info
            circlesGroup = updateToolTip(someX, circlesGroup);
    
            // changes classes to change bold text
            if (someX === "poverty") {
              ageLabel
                .classed("active", true)
                .classed("inactive", false);
              povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else {
              ageLabel
                .classed("active", false)
                .classed("inactive", true);
              povertyLabel
                .classed("active", true)
                .classed("inactive", false);
            }
          }
        });
    }).catch(function(error) {
      console.log(error);
    });

}

makeResponsive();

d3.select(window).on('resize', makeResponsive);
