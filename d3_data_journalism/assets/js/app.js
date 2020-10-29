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

  //load data
  d3.csv("assets/data/data.csv").then(function(povertyData) {
    console.log(povertyData);

  // parse data
  povertyData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    // data.age = +data.age;
  });

  // xLinearScale function above csv import
  let x = d3.scaleLinear()
    .domain([0, d3.max(povertyData, d=> d.poverty)])
    .range([0, width]);
  svg.append('g')
    .attr("transform", "translate(0, " + height + ")")
    .call(d3.axisBottom(x));
  // Append an SVG group

  // Create y scale function
  let y = d3.scaleLinear()
    .domain([0, d3.max(povertyData, d => d.poverty)])
    .range([height, 0]);
  svg.append('g')
    .call(d3.axisLeft(y));
    chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  let circlesGroup = chartGroup.selectAll("circle")
    .data(povertyData)
    .enter()
    .append("circle")
    .classed('circles', true)
    .attr("cx", d => xLinearScale(d[povertyX]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .attr("fill", "teal")
    .attr("opacity", ".65")
    .attr("stroke", "black");

  let circleText = chartGroup.selectAll(null)
    .data(povertyData)
    .enter()
    .append("text")
    .classed('circles-text', true)

  let textLabels = circleText 
    .attr("x", d => xLinearScale(d[povertyX]))
    .attr("y", d => yLinearScale(d.healthcare))
    .text(function(d) {return d.abbr})
    .attr("font-size", "12px")
    .attr("font-family", "sans-serif")
    .attr("fill", "black")
    .attr("font-weight", "bold")
    .attr('text-anchor', 'middle');
  
  // Create group for two x-axis labels
  // let xlabelsGroup = chartGroup.append("g")
  //   .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
  // one label on x axis
  let povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty Level (%)");
  
  // //another label on x axis
  // let ageLabel = xlabelsGroup.append("text")
  //   .attr("x", 0)
  //   .attr("y", 40)
  //   .attr("value", "age") // value to grab for event listener
  //   .classed("inactive", true)
  //   .text("Median Age");

  // label on y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacking Healthcare (%)");
  svg.append('g')
    .selectAll('circles')
    .data(data)
    .enter()
    .append('circle')
      .attr
  // let chartGroup = svg.append("g")
  //   .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
  // newX
  // let povertyX = "poverty";

  // // update x_scale when clicking the axis label
  // function xScale = d3.scaleLinear()
  //       .domain([0, d => d.poverty * .9])
  //       .range([0, width]);    
  //   };


    // // update newX on click
    // function renderAxes(newXScale, newX) {
    //   let bottomAxis = d3.axisBottom(newXScale);
     
    //   newX.transition()
    //     .duration(1000)
    //     .call(bottomAxis);

    //   return newX;
    // }
  //    // function used for updating circles labels positions
  //   function renderTextX(textLabels, newXScale, povertyX) {
  //     textLabels.transition()
  //       .duration(1000)
  //       .attr('x', d => newXScale(d[povertyX]));
  //     return textLabels;
  // }
    // // function used for updating circles group with a transition to new circles
    // //create a new x scale and new y scale add to below (add a default parameter) chosenY = None next to chosen x 
    // function renderCircles(circlesGroup, newXScale, povertyX) {
    //   circlesGroup.transition()
    //     .duration(1000)
    //     .attr("cx", d => newXScale(d[povertyX]));
    
    //   return circlesGroup;
    // }
    
    // // function used for updating circles group with new tooltip
    // function updateToolTip(povertyX, circlesGroup) {

    //   let label;
    
    //   if (povertyX === "poverty") {
    //     label = "Poverty Percent:";
    //   }
    //   else {
    //     label = "Median Age:";
    //   }
    
      let toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([20, -60])
        .html(function(d) {
          return (`<h5><strong>${d.state}<strong><h5><hr><h6>${d[povertyX]}<h6>`);
        });
        // <hr>${label} ${d[povertyX]}
    
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
    });

      // Retrieve data from the CSV file and execute everything below


    
    
    
    

    
      // // Create initial axis functions
      // let bottomAxis = d3.axisBottom(xLinearScale);
      // let leftAxis = d3.axisLeft(yLinearScale);
    
      // // append x axis
      // let x = chartGroup.append("g")
      //   .classed("x-axis", true)
      //   .attr("transform", `translate(0, ${height})`)
      //   .call(bottomAxis);
    
      // append y axis

    
    //   // updateToolTip function above csv import
    //   circlesGroup = updateToolTip(povertyX, circlesGroup, circleText, textLabels);
    
    //   // x axis labels event listener
    //   xlabelsGroup.selectAll("text")
    //     .on("click", function() {
    //       // get value of selection
    //       //we are grabbing value out of the above items based on whatever was clicked on
    //       let value = d3.select(this).attr("value");
    //       if (value !== povertyX) {
    
    //         // replaces somenewX with value
    //         povertyX = value;
    
    //         console.log(povertyX)
    
    //         // functions here found above csv import
    //         // updates x scale for new data
    //         xLinearScale = xScale(povertyData, povertyX);
    
    //         // updates x axis with transition
    //         newX = renderAxes(xLinearScale, newX);
    
    //         // updates circles with new x values
    //         circlesGroup = renderCircles(circlesGroup, xLinearScale, povertyX);
    
    //         // updates tooltips with new info
    //         circlesGroup = updateToolTip(povertyX, circlesGroup, textLabels);

    //         textLabels = renderTextX(textLabels, xLinearScale, povertyX);
    
    //         // changes classes to change bold text
    //         if (povertyX === "poverty") {
    //           ageLabel
    //             .classed("active", true)
    //             .classed("inactive", false);
    //           povertyLabel
    //             .classed("active", false)
    //             .classed("inactive", true);
    //         }
    //         else {
    //           ageLabel
    //             .classed("active", false)
    //             .classed("inactive", true);
    //           povertyLabel
    //             .classed("active", true)
    //             .classed("inactive", false);
    //         }
    //       }
    //     });
    // }).catch(function(error) {
    //   console.log(error);
    // });

}

makeResponsive();

d3.select(window).on('resize', makeResponsive);
