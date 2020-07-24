import React, { Component } from 'react'
import SensorGraph from './SensorGraph';

export class GraphWrapper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      labels: [],
      xData: [],
      yData: []
    };
    this.addData = this.addData.bind(this);
    this.maxLen = 50;
  }
  
  componentDidMount() {
    this.props.socket.on('sensorData', data => {
      if (!data.index || !data.IotData.x_distance || !data.IotData.y_distance) { return; }
      this.addData(data.index, data.IotData.x_distance, data.IotData.y_distance); // time: string, x: number, y: number
    });
  }
  
  addData(index, xAxis, yAxis) {
    const newLabels = this.state.labels;
    const newX = this.state.xData;
    const newY = this.state.yData;
    newLabels.push(index);
    newX.push(xAxis);
    newY.push(yAxis);
  
    if (newLabels.length > this.maxLen) {
      newLabels.shift();
      newX.shift();
      newY.shift();
    }
  
    this.setState({ labels: newLabels, xData: newX, yData: newY });
  }

  render() {
    return (
      <div className="graph-wrapper">
        <SensorGraph xData={this.state.xData} yData={this.state.yData} labels={this.state.labels} />
      </div>
    )
  }
}

export default GraphWrapper
