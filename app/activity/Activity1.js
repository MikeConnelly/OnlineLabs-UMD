import React, { Component } from 'react';


class Activity1 extends Component {
    render() {
        return (
            <div className="activity-wrapper">
                <div className="activity">
                    <div className="head">
                        <h3>ACTIVITY #1</h3>
                        <div>
                            <div className="activity1">
                                <div className="column-left">
                                    <h3 id="instruction-header">INSTRUCTIONS</h3>
                                    <div className="instructions-Act2">
                                        <ul>
                                            <li>Input a pair of XY steps, and record the measurments from the X and Y Ultrasonic Sensors from the plot above</li>
                                            <li>Repeat for 10 combinations and do a least Squares Fit  to find the calibration avearage
                                                (in/step) and Standard Deviation for both X and Y</li>
                                            <li>Enter your Results in the 3rd section and Submit </li>
                                            <li>What is the maximum number of steps you can implement in X and
                                           Y before they run into the limit switches?</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="column-right">
                                    <h3 id="instruction-header">RESULTS</h3>
                                    <div className="results">
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
                                        <input id="submit-form" type="submit" value="Submit"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            // <div className="activity-wrapper">
            //     <div className="activity">
            //         <div className="head">
            //             <h3>ACTIVITY #1</h3>
            //         </div>
            //         <div className="bottomRowOfControls">
            //             <div className="instructions-Act1">
            //                 <h3 id="instruction-header">INSTRUCTIONS</h3>
            //             </div>
            //             <div className="results">
            //                 <h3 id="instruction-header">RESULTS</h3>
            //             </div>

            //         </div>
            //         <div className="bottomRowOfControls">

            //             <div className="instructions-Act1">
            //                 <ul>
            //                     <li>Input a pair of XY steps, and record the measurments from the X and Y Ultrasonic Sensors from the plot above</li>
            //                     <li>Repeat for 10 combinations and do a least Squares Fit  to find the calibration avearage 
            //                         (in/step) and Standard Deviation for both X and Y</li>
            //                     <li>Enter your Results in the 3rd section and Submit </li>
            //                     <li>What is the maximum number of steps you can implement in X and 
            //                         Y before they run into the limit switches?</li>
            //                 </ul>
            //             </div>

            //             <div className="results">
            //                 <div className="bottomRowOfControls">
            //                     <form>
            //                         <label>Calibration Avg. (in/step) for X: </label>
            //                         <input type="number" id="CalibrationX" name="CalibrationX"></input>
            //                     </form>
            //                     <form>
            //                         <label>Calibration Avg. (in/step) for Y: </label>
            //                         <input type="number" id="CalibrationY" name="CalibrationY"></input>
            //                     </form>
            //                 </div>
            //                 <div className="bottomRowOfControls">
            //                     <form>
            //                         <label>Enter your calculated Standard Deviation for X: </label>
            //                         <input type="number" id="StndX" name="StndX"></input>
            //                     </form>
            //                     <form>
            //                         <label>Enter your calculated Standard Deviation for Y: </label>
            //                         <input type="number" id="StndY" name="StndY"></input>
            //                     </form>
            //                 </div>
            //             </div>
            //         </div>

            //     </div>
            // </div>
        );
    }
}

export default Activity1;