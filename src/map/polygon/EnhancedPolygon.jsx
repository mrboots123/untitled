import React, { Component, Fragment } from 'react'
import styled from "styled-components";
import {Marker, Polygon, Popup} from 'react-leaflet'
import {locationPin} from "../pins/LocationPin";
import * as turf from "@turf/turf";

const Poly = styled(Polygon)`
    stroke-width: 1px;
    stroke: gray
    &:hover {
        fill-opacity: 0.7
    }
`

class EnhancedPolygon extends Component{

    constructor(props){
        super(props)
    }


    //TODO:PRIORITY

    //TODO: FIX THIS METHOD, CURRENTLY SOME TILES ARE NOT RELOADING WHEN SEARCH BUTTON IS PRESSED

    shouldComponentUpdate(nextProps, nextState){
        return ( nextProps.layer !== this.props.layer  || (nextProps.fillOpacity !== this.props.fillOpacity ) || (nextProps.color !== this.props.color ) || (nextProps.size !== this.props.size))
    }


    render(){

        return(
            <Fragment>

                <Poly
                    {...this.props}
                />
            </Fragment>
        )
    }
}

export default EnhancedPolygon;
