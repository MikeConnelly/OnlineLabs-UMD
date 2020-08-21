import React, { Component } from 'react';

class Welcome extends Component {

    render() {
        return (
            <div className="container">
                <div className="box">
                    <div className="boxContent">
                        <h1 className="title">ENEE 101- Gizmo 1</h1>
                        <p className="desc">Description </p>
                    </div>
                    <a className="box-anchor" href="#"></a>
                </div>
                <div className="box">
                    <div className="boxContent">

                        <h1 className="title">ENEE 101- Gizmo 2</h1>
                        <p className="desc">Description</p>
                    </div>
                    <a className="box-anchor" hrefName="#"></a>
                </div>
                <div className="box">
                    <div className="boxContent">
                        <h1 className="title">ENEE 205- </h1>
                        <p className="desc">Description</p>
                    </div>
                    <a className="box-anchor" href="#"></a>
                </div>
            </div>
        );
    }
}

export default Welcome;