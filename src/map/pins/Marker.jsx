import React, { Fragment, Component } from 'react'
import {Marker, Popup} from "react-leaflet";
import { locationPin } from "./LocationPin";

import { pinFilled} from "./PinFilled";
import {pinUnfilled} from "./PinUnfilled";
class MarkerIcon extends Component {
    constructor(props){
        super(props)
        this.state = {
            fill: false,
            selected: false
        }
    }

    setPin(){
        this.setState({ fill: !this.state.fill})
    }


    render(){
        /*
                                    icon={ this.state.fill ? pinUnfilled: pinFilled}
                            onClick={() => console.log('hello world') }
                            onMouseOver={() => this.setPin()}
                            onMouseOut={() => this.setPin()}


                            address:
"47XX W THOMAS RD"
cdid:
126063086
date:
"06/13/19 09:30 PM"
lat:
33.4805241
lon:
-112.1598513
type:
"Theft"
         */
        /*
          todo: onclick opens up popup, onmouseout, onmouseover, center map onto pin when clicked
          //todo: popup is pushing the map up! what you must first do is center the pin that was hovered?
         */
        return(

            <Fragment>
                {
                    this.props.crime ?
                        <Marker
                            position={[this.props.crime.lat, this.props.crime.lon]}
                            onClick={(e) => {
                                console.log(e)
                                e.target.openPopup()
                                this.setState({selected: !this.state.selected});
                             //   this.props.fit([this.props.crime.lat, this.props.crime.lon]);
                            }
                            }
                            onMouseOver={(e) => {

                                if(!this.state.selected){
                                    console.log('opening the popup because hovered')
                                    e.target.openPopup();
                                }

                            }}
                            onMouseOut={(e) => {
                                if(!this.state.selected){
                                    console.log('closing the popup because left')
                                    e.target.closePopup();
                                }

                            }}
                        >
                            <Popup>
                                <div>{this.props.crime.type}</div>

                                <div>{this.props.crime.address}</div>
                            </Popup>
                        </Marker> : <Fragment/>
                }

            </Fragment>
        )
    }
}
export default MarkerIcon;
