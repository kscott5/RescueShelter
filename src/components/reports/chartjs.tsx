import * as React from "react";
import * as i18nextReact  from 'react-i18next';

// module: ES2025, target: node16
// error: TS1479 with 
//
import * as Report from "chart.js";

// 
// Recommendation: use dynamic import
//const Chart = require("chart.js");

export function ChartJS()  {
    const localizer = i18nextReact.getI18n();
    const [model, setModel] = React.useState({
        message: localizer.t('component.report.loading'), ok: false});

        React.useEffect(() => {
            const httpGet = async() => {
                let response = await fetch(`/api/report/animals/categories`);
                
                if(!response.ok) {
                    setModel({...model, ok: response.ok, message: response.statusText});
                } else {
                    let results = await response.json();
                
                    let dataset = {
                        label: localizer.t('component.report.animals.label'),
                        data: [],
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(75, 192, 192)',
                            'rgb(255, 205, 86)',
                            'rgb(201, 203, 207)',
                            'rgb(54, 162, 235)',
                            'rgb(72, 191, 63)']
                    };
                    
                    let labels = [];
                    results.data.map(item => {
                        labels.push(item._id);
                        dataset.data.push(item.count)
                    });
                    
                    Report.Chart.register(...Report.registerables);                         
                    new Report.Chart('chartCanvas', {
                        data: { datasets: [dataset], 
                            labels: labels
                        },                        
                        type: 'polarArea',
                        //options: options
                    });
                        
                    setModel({...model, ok:true, message:''});
                } // end if-else
            };

            httpGet();
        }, [/* params */ ]);
    
        return (<canvas id="chartCanvas" className="chartjs" width="553" height="276"></canvas>);
} // end ChartJS