function makeResponsive() {

  let svgArea = d3.select("#scatter").select("svg");

  //remove elements that are in svgArea
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  //setting svgArea
  let svgWidth = 950;
  let svgHeight = 700;

  // Setting the margins that will be used to get a chart area
  let margin = {
    top: 50,
    right: 20,
    bottom: 80,
    left: 70
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
  let someX = "poverty";
  let someY = "smokes";

  // update x scale when clicking the  X axis label
  function xScale(povertyData, someX) {
      // console.log(someX)
      let xLinearScale = d3.scaleLinear()
        .domain([d3.min(povertyData, d => d[someX]) * .9, d3.max(povertyData, d => d[someX]) * 1.1])
        .range([0, width]);
      return xLinearScale;      
  }

  // update y scale when clicking the y axis label
  function yScale(povertyData, someY) {
      let yLinearScale = d3.scaleLinear()
          .domain([d3.min(povertyData, d => d[someY]) * .9, d3.max(povertyData, d=> d[someY]) * 1.1])
          .range([height, margin.top]);
      return yLinearScale;
  }
    // update xAxis on click
  function renderAxesX(xAxisScale, xAxis) {
      // console.log(xAxis)
      let bottomAxis = d3.axisBottom(xAxisScale);
      xAxis.transition()
        .duration(1000)
        .call(bottomAxis);  
      return xAxis;
  }

  // update yAxis on click
  function renderAxesY(yAxisScale, yAxis) {
      let leftAxis = d3.axisLeft(yAxisScale);
      yAxis.transition()
          .duration(1000)
          .call(leftAxis);
      return yAxis;
  }

       // function used for updating circles labels positions for x axis
  function renderTextX(textLabels, xAxisScale, someX) {
      textLabels.transition()
        .duration(1000)
        .attr('x', d => xAxisScale(d[someX]));
      return textLabels;
  }

  // update circle label positions for y axis change
  function renderTextY(textLabels, yAxisScale, someY) {
      textLabels.transition()
        .duration(1000) 
        .attr('y', d => yAxisScale(d[someY]));
      return textLabels;
  }

  // function used for updating circles group with a transition to new circles
  function renderCirclesX(circlesGroup, xAxisScale, someX) {
      // console.log("render circles");
      circlesGroup.transition()
          .duration(1000)
          .attr("cx", d => xAxisScale(d[someX]));    
  return circlesGroup;
  }
    
  //update circles group with a transition to new circles
  function renderCirclesY(circlesGroup, yAxisScale, someY) {
      circlesGroup.transition()
          .duration(1000)
          .attr("cy", d => yAxisScale(d[someY]));
      return circlesGroup;
  }

  // function used for updating x circles group with new tooltip
  function updateToolTip(someX, someY, circlesGroup) {

    // let label;
    
      if (someX === "poverty") {
          labelX = "Poverty (%): ";
      }
      else {
          labelX = "Median Age: ";
      }
      if (someY === 'healthcare') {
          labelY = "Lacking Healthcare (%): "
      }
      else {
          labelY = "Smokes (%): "
      }

    let toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([20, -60])
        .html(function(d) {
        return (`<h5><strong>${d.state}<strong><h5><hr><h6>${labelX}${d[someX]}<h6>${labelY} ${d[someY]}<h6>`);
        });
        // <hr>${label} ${d[someX]}
      
    circlesGroup.call(toolTip);
      // do i need 'this'
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data)
        .style("display", "block")
        .style("left", d3.event.pageX + 'px')
        .style("top", d3.event.pageY + "px");
    })
    // onmouseout event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });
  
    return circlesGroup;
  };
  
        // Retrieve data from the CSV file and execute everything below
      //load data
  d3.csv("assets/data/data.csv").then(function(povertyData) {
  console.log(povertyData);
  
    // parse data
    povertyData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.age = +data.age;
      data.smokes = +data.smokes;
    });
  
    // xLinearScale function above csv import
    let xLinearScale = xScale(povertyData, someX);
    let yLinearScale = yScale(povertyData, someY);
      
    // Create initial axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);
      
    // append x axis
    let xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    let yAxis = chartGroup.append("g")
      .classed("Y-axis", true)
    //   .attr("transform", `t`)
      .call(leftAxis);
      
    // append initial circles
    let circlesGroup = chartGroup.selectAll("circle")
      .data(povertyData)
      .enter()
      .append("circle")
      .classed('circles', true)
      .attr("cx", d => xLinearScale(d[someX]))
      .attr("cy", d => yLinearScale(d[someY]))
      .attr("r", 20)
      .attr("fill", "teal")
      .attr("opacity", ".65")
      .attr("stroke", "black")
  
    let circleText = chartGroup.selectAll(null)
      .data(povertyData)
      .enter()
      .append("text")
      .classed('circles-text', true)
  
    let textLabels = circleText 
      .attr("x", d => xLinearScale(d[someX]))
      .attr("y", d => yLinearScale(d[someY]))
      .text(function(d) {return d.abbr})
      .attr("font-size", "12px")
      .attr("font-family", "sans-serif")
      .attr("fill", "black")
      .attr("font-weight", "bold")
      .attr('text-anchor', 'middle');
        
    // Create group for two x-axis labels
    let xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
        
    // one label on x axis
    let povertyLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("Poverty Level (%)");
        
    //another label on x axis
    let ageLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Median Age");
      
    let ylabelsGroup = chartGroup.append('g')
                
    let healthcareLabel = ylabelsGroup.append('text')
        .attr("transform", "rotate(-90)")
        .attr('y', 0 - margin.left + 5)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .attr("value", "healthcare")
        // .classed("active", true)
        .attr('class', 'active')
        .text("Lacks Healthcare (%)");

    let smokesLabel = ylabelsGroup.append('text')
        .attr("transform", "rotate(-90)")  
        .attr('y', 0 - margin.left + 20)
        .attr('x', 0 - (height / 2))
        .attr("dy", "1em")
        .attr('value', "smokes")
        .attr('class', 'inactive')
        // .classed("inactive", true)
        .text("Smokers (%)");
        
    // updateToolTip function above csv import
    circlesGroup = updateToolTip(someX, someY, circlesGroup, textLabels);
  
    // x axis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function() {
            // get value of selection
            //we are grabbing value out of the above items based on whatever was clicked on
        let value = d3.select(this).attr("value");
        if (value !== someX) {
          // replaces somexAxis with value
          someX = value;      
          console.log(someX)
  
          // updates x scale for new data
          xLinearScale = xScale(povertyData, someX);
          // console.log(xLinearScale);
          // updates x axis with transition
          xAxis = renderAxesX(xLinearScale, xAxis);
          // console.log(xAxis);
  
          // updates circles with new x values
          circlesGroup = renderCirclesX(circlesGroup, xLinearScale, someX);
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(someX, someY, circlesGroup, textLabels);

          textLabels = renderTextX(textLabels, xLinearScale, someX);
        
          // changes classes to change bold text
          if (someX === "poverty") {
              ageLabel
              .classed("active", false)
              .classed("inactive", true);
              povertyLabel
              .classed("active", true)
              .classed("inactive", false);
          }
          else {
              ageLabel
              .classed("active", true)
              .classed("inactive", false);
              povertyLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        }   
      });
    // y axis labels event listener
    ylabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        //we are grabbing value out of the above items based on whatever was clicked on
        let value = d3.select(this).attr("value");
        if (value !== someY) {
            // replaces someY with value
          someY = value;      
          console.log(someY)
  
          // updates y scale for new data
          yLinearScale = yScale(povertyData, someY);
  
          // updates y axis with transition
          yAxis = renderAxesY(yLinearScale, yAxis);
  
          // updates circles with new y values
          circlesGroup = renderCirclesY(circlesGroup, yLinearScale, someY);

          textLabels = renderTextY(textLabels, yLinearScale, someY);

          // updates tooltips with new info
          circlesGroup = updateToolTip(someX, someY, circlesGroup, textLabels);        
    
          // changes classes to change bold text
          if (someY === "healthcare") {
              healthcareLabel
                .classed("active", true)
                .classed("inactive", false);
              smokesLabel
                .classed("active", false)
                .classed("inactive", true);
          }
          else {
              healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
              smokesLabel
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
  