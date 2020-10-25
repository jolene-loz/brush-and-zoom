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
    
    //====Update function====
    function update(data){ 

        let fieldkeys = data.columns.slice(1)
        console.log(fieldkeys)
    
    
        var stack = d3.stack()
            .keys(fieldkeys)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);
    
        var series = stack(data);
    

        xScale
            .domain(d3.extent(data, d=>d.date));
        yScale
            .domain([0, d3.max(data, d=>d.total)]);

        var area = d3.area()
            .x(d=>xScale(d.data.date)) //when this is changed it doesn't show anymore
            .y0(d=>yScale(d[0]))
            .y1(d=>yScale(d[1]))
        
        d3.select(".area")
            .datum(data)
            .attr("d",area)

        
        xScale.domain(d3.extent(data, d=>d.date))
        yScale.domain([0, d3.max(series, d => d3.max(d, d => d[1]))])

        var colorScale = d3.scaleOrdinal(d3.schemeTableau10)
            .domain(fieldkeys);

        var area = d3.area()
            .x(d=>xScale(d.data.date))
            .y0(d=>yScale(d[0]))
            .y1(d=>yScale(d[1]))

        svg.selectAll("path")
            .data(series)
            .join("path")
            .attr("fill", d=>colorScale(d.key))
            .attr("d", area)  

        drawAxes();
    }

	return {
		update
    }
    
    function drawAxes(){
        svg.select('.x-axis')
            .call(xAxis)
            .attr("transform", `translate(0, ${height})`);
        svg.select('.y-axis')
            .call(yAxis)

    }
};


