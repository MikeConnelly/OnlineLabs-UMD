import React, { Component } from 'react';
import Youtube from '../public/img/youtube.png';
import Insta from '../public/img/instagram.png';
import Twitter from '../public/img/twitter.png';



class Footer extends Component {
    render (){
        return (
            <div className = "footer">
                <div className = "inner-footer">
                    <div className="underline"></div>
                    <p>ENEE 101</p>
                    <p>Department of Electrical and Computer Engineering</p>
                    {/* <div className = "row-footer">
                        <img id="header-img" src={Youtube} alt="logo" width="40" height="40" />
                        <img id="header-img" src={Insta} alt="logo" width="40" height="40" />
                        <img id="header-img" src={Twitter} alt="logo" width="40" height="40" />
                    </div> */}
                </div>
                
            </div>
        );
    }
}

export default Footer;