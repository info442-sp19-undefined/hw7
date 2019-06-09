import React, { Component } from "react";
// import firebase from "firebase/app";


export default class Chart extends Component {
    render() {
        new Chart(document.getElementById("bar-chart"), {
            type: 'bar',
            data: {
              labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
              datasets: [
                {
                  label: "Population (millions)",
                  backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
                  data: [2478,5267,734,784,433]
                }
              ]
            },
            options: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Predicted world population (millions) in 2050'
              }
            }
        });
        return(
            <div>
                <canvas id="bar-chart" width="800" height="450"></canvas>
            </div>
        );
    }
}