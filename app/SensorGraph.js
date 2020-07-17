import React, { Component } from 'react';
import Chart from 'chart.js';
// import classes from './LineGraph.module.css';
import io from 'socket.io-client';
const socket = io();
const chartOptions = {
  scales: {
    yAxes: [{
      id: 'distance',
      type: 'linear',
      scaleLabel: {
        labelString: 'Distance (Inches)',
        display: true
      },
      position: 'right',
      ticks: {
        beginAtZero: true,
        stepsize: 1
      }
    }]
  }
};

class SensorGraph extends Component {
  constructor(props) {
    super(props);
    this.addData = this.addData.bind(this);

    this.chartRef = React.createRef();
    this.maxLen = 50;
    this.timeData = new Array(this.maxLen);
    this.xAxisData = new Array(this.maxLen);
    this.yAxisData = new Array(this.maxLen);
    this.chartData = {
      datasets: [
        {
          fill: false,
          label: 'X Axis Ultrasonic Distance',
          yAxisID: 'distance',
          borderColor: 'rgba(255, 204, 0, 1)',
          pointBoarderColor: 'rgba(255, 204, 0, 1)',
          backgroundColor: 'rgba(255, 204, 0, 0.4)',
          pointHoverBackgroundColor: 'rgba(255, 204, 0, 1)',
          pointHoverBorderColor: 'rgba(255, 204, 0, 1)',
          spanGaps: true,
        },
        {
          fill: false,
          label: 'Y Axis Ultrasonic Distance',
          yAxisID: 'distance',
          borderColor: 'rgba(24, 120, 240, 1)',
          pointBoarderColor: 'rgba(24, 120, 240, 1)',
          backgroundColor: 'rgba(24, 120, 240, 0.4)',
          pointHoverBackgroundColor: 'rgba(24, 120, 240, 1)',
          pointHoverBorderColor: 'rgba(24, 120, 240, 1)',
          spanGaps: true,
        }
      ]
    }
    this.chartData.labels = this.timeData;
    this.chartData.datasets[0].data = this.xAxisData;
    this.chartData.datasets[1].data = this.yAxisData;
  }

  componentDidMount() {
    const myChartRef = this.chartRef.current.getContext('2d');
    var chart = new Chart(myChartRef, {
      type: 'line',
      data: this.chartData,
      options: chartOptions
    });

    socket.on('chart-data', data => {
      console.log(JSON.stringify(data));
      if (!data.MessageDate || (!data.IotData.x_distance && !data.y_distance)) { return; }
      this.addData(data.MessageDate, data.IotData.x_distance, data.IotData.y_distance);
      chart.update();
    });
  }

  addData(time, xAxis, yAxis) {
    this.timeData.push(time);
    this.xAxisData.push(xAxis);
    this.yAxisData.push(yAxis);

    if (this.timeData.length > this.maxLen) {
      this.timeData.shift();
      this.xAxisData.shift();
      this.yAxisData.shift();
    }
  }

  render() {
    return (
      <div className="graph">
        <canvas
          id="myChart"
          ref={this.chartRef}
        />
      </div>
    );
  }
}

export default SensorGraph;
