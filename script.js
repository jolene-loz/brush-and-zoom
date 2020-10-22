const margin = {top: 40, right: 20, bottom: 20, left: 60}
const width = 1000 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// === Scales without domains === 
const xScale = d3.scaleBand()
                .rangeRound([0, width])
                .paddingInner(0.1);
const yScale = d3.scaleLinear()
                .range([height, 0]);

// ==== Initialize Axes & title containers === 
const xAxis = d3
    .axisBottom()
    .scale(xScale)

const yAxis = d3
    .axisLeft()
    .scale(yScale)


d3.csv('unemployment.csv', d3.autoType).then(data => {
    console.log(data)
    const total = d3.sum(data, d => d.MiningandExtraction);
    console.log(total)


})

function AreaChart(container){// selector for a chart container e.g., ".chart"

// initialization

function update(data){ 

    // update scales, encodings, axes (use the total count)
    
}

return {
    update // ES6 shorthand for "update": update
};
}