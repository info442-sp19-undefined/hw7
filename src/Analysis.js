import { BarChart } from 'react-chartkick'
import 'chart.js'
import React, { Component } from "react";

// attempted ChartJS
// chartkick
// CanvasJS

export default class Chart extends Component {
    render(){
        return(
            <div>
                <h1>Bar Chart</h1>
                <div id={"bar"}></div>
                <script>
                <BarChart data={[["X-Small", 5], ["Small", 27]]} />
                </script>
            </div>
        );
    }
}