export default function StackedAreaChart(container){

    const margin = ({ top: 40, right: 20, bottom: 40, left: 90 });
    const width = 650 - margin.left - margin.right;
    const height = 150 - margin.top - margin.bottom;

    let svg = d3
        .select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    let xScale = d3
        .scaleTime()
        .range([0,width])

    let yScale = d3
        .scaleLinear()
        .range([height,0])

    //=== Create & Initialize Axes ===
    var xAxis = d3.axisBottom()
        .scale(xScale);

    var yAxis = d3.axisLeft()
        .scale(yScale);

    svg.append("g")
        .attr('class', 'axis x-axis');

    svg.append('g')
        .attr('class', 'axis y-axis');

    const tooltip = svg
        .append("text")
        .attr('x', 0)
        .attr('y', -10)
        .attr('font-size', 14);
    

    let selected = null, xDomain, data;


    //====Update function====
    function update(_data){ 

        data = _data;

        let fieldkeys = data.columns.slice(1)
        const keys = selected? [selected] : fieldkeys; 

        console.log(fieldkeys)
    
        var stack = d3.stack()
            .keys(fieldkeys)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);
    
        let series = stack(data);
    
        xScale
            .domain(xDomain? xDomain: d3.extent(data, d=>d.date));
        yScale
            .domain([0, d3.max(data, d=>d.total)]);

        d3.select(".area2")
            .datum(data)
            .attr("d",area2)

        var colorScale = d3.scaleOrdinal(d3.schemeTableau10)
            .domain(fieldkeys);

        var area2 = d3.area()
            .x(d=>xScale(d.data.date))
            .y0(d=>yScale(d[0]))
            .y1(d=>yScale(d[1]))

        svg.selectAll("path")
            .data(series)
            .join("path")
            .attr("fill", d=>colorScale(d.key))
            .attr("d", area2)  
            .on("mouseover", (event, d, i) => tooltip.text(d.key))
            .on("mouseout", (event, d, i) => tooltip.text(""))
            .on("click", (event, d) => {
                // toggle selected based on d.key
                if (selected === d.key) {
                    selected = null;
                } else {
                    selected = d.key;
                }
                    update(data); // simply update the chart again
            })
        svg.exit().remove()
        drawAxes();    
    }

    function filterByDate(range){
        xDomain = range; 
        update(data);
    }

	return {
        update, 
        filterByDate
    }
    
    function drawAxes(){
        svg.select('.x-axis')
            .call(xAxis)
            .attr("transform", `translate(0, ${height})`);
        svg.select('.y-axis')
            .call(yAxis)
    }

};


