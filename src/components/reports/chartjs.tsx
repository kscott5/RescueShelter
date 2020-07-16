import * as React from "react";
import AppContext from "../state/context";

import Chart from "chart.js";



export class ChartJS extends React.Component<any> {
    static contextType = AppContext;
    state = {};
    reportType = '';

    constructor(props) {
        super(props);
        this.reportType = this.props.reportType;
    }

    componentDidMount() { 
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

        fetch('http://localhost:3303/api/report/categories', {
            method: `GET`,
            //body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => response.json())
        .then((response) => {
            console.log(response);
            model.labels = [];
            model.datasets[0].data = [];
            
            response.data.forEach((item) => {
                model.labels.push(item['_id'])
                model.datasets[0].data.push(item['count']);
            });            
            
        })
        .catch((reason) => {
            console.log(reason);
        });
        
        new Chart('chartCanvas', {
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
} // end ChartJs5