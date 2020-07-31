import React, { Component } from 'react';
import axios from 'axios';

class Activity1 extends Component{
    render(){
        return (
        <div className = "activity-wrapper">
            <div className = "activity">   
                <div className="instructions-Act1">
                    <h3 id="instruction-header">Instructions:</h3>
                    <ul>
                        <li>Input 10 values and calculate the distance from the Ultrasonic waves</li>
                        <li>Do a least Squares Fit  to find the calibration avearage (in/step) and Standard Deviation for 
                        both X and Y</li>
                        <li>Enter your Results in the 3rd section and Submit </li>
                        <li>Click <a href="https://www.youtube.com/watch?v=cH9fpUHSJaE&feature=youtu.be">here</a> to view the Live Stream</li>
                    </ul>
                </div>
                <div className="instructions">
                    <h3 id="instruction-header">Results:</h3>
                    <div className="bottomRowOfControls">
                        <form>
                            <label>Calibration Avg. (in/step) for X: </label>
                            <input type="number" id="CalibrationX" name="CalibrationX"></input>
                        </form>
                        <form>
                            <label>Calibration Avg. (in/step) for Y: </label>
                            <input type="number" id="CalibrationY" name="CalibrationY"></input>
                        </form>
                    </div>
                    <div className="bottomRowOfControls">
                        <form>
                            <label>Enter your calculated Standard Deviation for X: </label>
                            <input type="number" id="StndX" name="StndX"></input>
                        </form>
                        <form>
                            <label>Enter your calculated Standard Deviation for Y: </label>
                            <input type="number" id="StndY" name="StndY"></input>
                        </form>
                    </div>
                    
                    {/* <div className="bottomRowOfControls">
                        <p>Calibration Avg. (in/step) for X</p>
                        
                    </div> */}
                </div>  
            </div>
        </div>
        );
    }
} 

export default Activity1;