import * as React from "react";
import AppContext from "../state/context";

// module: ES2025, target: node16
// error: TS1479 with 
//
import * as Report from "chart.js";
// 
// Recommendation: use dynamic import
//const Chart = require("chart.js");

/**
 * get list of report categories
 * 
 * @param options any
 */
async function getCategories(options: any = {}) {
    try {
        const fetchObj = fetch(`/api/report/animals/categories`, {
            method: `GET`,
            //body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json'
            }
        });
        
        let response = await fetchObj;
        if(!response.ok)
            return {ok: response.ok, data: response.statusText};

        return await response.json();
    } catch(error) {
        console.log(`[ERROR] getCategories: ${error}`);
        return {ok: false, data: error}; 
    }
} // end getCategories

export class ChartJS extends React.Component<any> {
    static contextType = AppContext;
    state = {};
    reportType = '';

    constructor(props) {
        super(props);
        this.reportType = this.props.reportType;
    }

    async componentDidMount() { 
        // Stub 
        var model = {
            datasets: [{
                label: 'Stub label',
                data: [10, 20, 30, 18, 9, 13],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(75, 192, 192)',
                    'rgb(255, 205, 86)',
                    'rgb(201, 203, 207)',
                    'rgb(54, 162, 235)',
                    'rgb(72, 191, 63)']
            }],
        
            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'Red',
                'Green',
                'Yellow',
                'Grey',
                'Blue',
                'Green'
            ]
        };

        let response = await getCategories();
        console.log(response);
        model.labels = [];
        model.datasets[0].data = [];
        
        response.data.forEach((item) => {
            model.labels.push(item['_id'])
            model.datasets[0].data.push(item['count']);
        });            
        
        new Report.Chart('chartCanvas', {
            data: model,
            type: 'polarArea',
            //options: options
        });
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (nextProps !== this.props) || 
            (nextState !== this.state) || 
            (nextContext !== this.context);
    }

    render()  {
        return (<canvas id="chartCanvas" className="chartjs" width="553" height="276"></canvas>);
    }
} // end ChartJS