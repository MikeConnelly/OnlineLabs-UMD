import React, { Component } from 'react';
import Chart from 'chart.js';
const chartOptions = {
  scales: {
    yAxes: [{
      id: 'distance',
      type: 'linear',
      scaleLabel: {
        labelString: 'Distance (mm)',
        display: true
      },
      position: 'right',
      ticks: {
        beginAtZero: true,
        stepsize: 1
      }
    }]
  },
  tooltips: { enabled: false },
  hover: { mode: null }
};

class SensorGraph extends Component {

  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    this.myChart = new Chart(this.chartRef.current, {
      type: 'line',
      options: chartOptions,
      data: {
        labels: this.props.labels,
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
            data: this.props.xData
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
            data: this.props.yData
          }
        ]
      }
    });
  }

  componentDidUpdate() {
    this.myChart.data.datasets[0].data = this.props.xData;
    this.myChart.data.datasets[1].data = this.props.yData;
    this.myChart.update();
  }

  render() {
    return (
      <div
        className="chart-container"
        style={{ position: 'relative', height: '30%', width: '50%' }}
      >
        <canvas ref={this.chartRef} />
      </div>
    );
  }
}

export default SensorGraph;
