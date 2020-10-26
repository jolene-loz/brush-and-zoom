export default function StackedAreaChart(container){

    const margin = ({ top: 40, right: 20, bottom: 40, left: 90 });
    const width = 650 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    let selected = null, xDomain, data;

    let svg = d3
        .select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    let clipPath = svg.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);
    
    
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
    
        function updateMain(selected, data, svg){
            var colorScale = d3.scaleOrdinal(d3.schemeTableau10)
                .domain(data.columns.slice(1));
                console.log(data, "MAIN")
                svg.exit().remove()
    
                        // initialization
                let margin = { top: 40, right: 20, bottom: 40, left: 90 },
                width =
                710 -
                margin.left -
                margin.right,
                height = 400 - margin.top - margin.bottom; 
    
                var type = ""
                let selection;

            let xScale = d3
                .scaleTime()
                .range([0,width])
    
            let yScale = d3
                .scaleLinear()
                .range([height,0])
    
            svg.append("path")
            .attr("fill", d=>colorScale(selected))
            .attr("class", "area3")
            .attr("clip-path", "url(#clip)")
            .on("click", (event, d) => {
                update(data)
            })
    
            //=== Create & Initialize Axes ===
            var xAxis = d3.axisBottom()
                .scale(xScale);
    
            var yAxis = d3.axisLeft()
                .scale(yScale);
    
            let xAxisGroup = svg.append("g")
                .attr('class', 'axis x-axis');
    
            let yAxisGroup = svg.append('g')
                .attr('class', 'axis y-axis');
                
            xScale
                .domain(xDomain? xDomain: d3.extent(data, d=>d.date));
            yScale
                .domain([0, d3.max(data, d=>d[selected])]);
    
            var area3 = d3.area()
                .x(function(d) { return xScale(d.date); })
                .y0(function() { return yScale(0); })
                .y1(function(d) { return yScale(d[selected]); });
            
            d3.select(".area3")
                .datum(data)
                .attr("d",area3)
            area3.exit().remove()
            
                xAxisGroup
                .call(xAxis)
                .attr("transform", `translate(0, ${height})`);
            
            yAxisGroup
                .call(yAxis)


            

            }    
    
            //====Update function====
            function update(_data){ 
                svg.selectAll('.area3').remove()
                selected = null
                console.log("UUPDATE", data)
                data = _data;
        
                // let fieldkeys = 
                // console.log(fieldkeys)
        
                const keys = selected? [selected] : data.columns.slice(1)
        
                console.log(keys)
            
                var stack = d3.stack()
                    .keys(data.columns.slice(1))
                    .order(d3.stackOrderNone)
                    .offset(d3.stackOffsetNone);
            
                var series = stack(data);
        
                xScale
                    .domain(xDomain? xDomain: d3.extent(data, d=>d.date));
                yScale
                    .domain([0, d3.max(data, d=>d.total)]);
        
       
    
                    
            var colorScale = d3.scaleOrdinal(d3.schemeTableau10)
                .domain(data.columns.slice(1));
        
            var area2 = d3.area()
                .x(d=>xScale(d.data.date))
                .y0(d=>yScale(d[0]))
                .y1(d=>yScale(d[1]))

            
            svg.selectAll("path")
            .data(series)
            .join("path")
            .attr("fill", d=>colorScale(d.key))
            .attr("d", area2)  
            .attr("clip-path", "url(#clip)")
            .on("mouseover", (event, d, i) => tooltip.text(d.key))
            .on("mouseout", (event, d, i) => tooltip.text(""))
            .on("click", (event, d) => {
                    console.log("ELSE")
                    selected = d.key;
                    svg.selectAll('path').remove()
                    updateMain(selected, data, svg)
            })

        svg.select('.x-axis')
            .call(xAxis)
            .attr("transform", `translate(0, ${height})`);
        svg.select('.y-axis')
            .call(yAxis)


    }
        
    function filterByDate(range){
        xDomain = range;  // -- (3)
        if (selected != null){
            console.log("HERE")
            updateMain(selected, data, svg)
        }
        if (selected == null) {
            update(data); // -- (4)
        }
    }

	return {
        updateMain,
        update, 
        filterByDate
    }
    

};


