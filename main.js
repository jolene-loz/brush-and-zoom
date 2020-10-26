import AreaChart from './AreaChart.js';
import StackedAreaChart from './StackedAreaChart.js';

let fields;
d3.csv('unemployment.csv', d3.autoType).then(data => {
    fields = data;
    console.log(fields);

    fields.forEach(
        d=>{
            d.total = d.Agriculture + d.Business_services + d.Construction + d.Education_and_Health + d.Finance + d.Government + d.Information + d.Leisure_and_hospitality + d.Manufacturing + d.Mining_and_Extraction + d.Other + d.Selfemployed + d.Transportation_and_Utilities + d.Wholesale_and_Retail_Trade;
        console.log(d.total); 
        return d;}
    );



    let stackedAreaChart = StackedAreaChart(".stacked-area-chart");
    stackedAreaChart.update(fields);

    let areaChart = AreaChart(".area-chart");
    areaChart.update(fields);
    
    areaChart.on("brushed", (range)=>{
        stackedAreaChart.filterByDate(range); // coordinating with stackedAreaChart
    })

});

