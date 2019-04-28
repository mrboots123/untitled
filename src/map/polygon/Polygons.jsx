import React, {Component, Fragment} from 'react'
import  isEmpty from 'lodash/isEmpty';
import {Polygon} from "react-leaflet";
import * as turf from "@turf/turf";
import chunk from "lodash/chunk";
import styled from "styled-components";
import {setColor} from "../../utility/Constants";

const InjusticePolygon = styled(Polygon)`
    stroke-width: 1px;
    stroke: gray
    &:hover {
        fill-opacity: 0.7
    }
`

class Polygons extends Component {
    constructor(props){
        super(props);

    }

    shouldComponentUpdate(nextProps){
        const tilesChange = nextProps.geometries !== this.props.geometries
        const selectedChange = nextProps.selected !== this.props.selected
        return ( tilesChange  || selectedChange )
    }

    setSelected(path,index) {
        if(this.props.selected === index){
            this.props.setSelected(-1)
        } else {
            const bounds = turf.bbox(path);
            this.props.fitBounds(chunk(bounds,2))
            this.props.setSelected(index)
        }
    }

    render() {
        return (
            <Fragment>
                {
                    !isEmpty(this.props.geometries) &&
                    this.props.geometries.map((element, index)=> {
                        const { geometry: {coordinates: { coordinates } } } = element;

                        return <InjusticePolygon
                            key={index}
                            color={setColor(element.geometry.average_salary)}
                            positions={coordinates}
                            onClick={() => this.setSelected(element.geometry.coordinates, index)}
                            fillOpacity={ this.props.selected === index ? 1.0 : 0.8 }
                        />
                    })
                }
            </Fragment>
        );
    }

}

export default Polygons;
