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


        let source = []

        if(!isEmpty(this.props.filters) && !isEmpty(this.props.geometries)){
            let array = []
            const filters = this.props.filters

            this.props.geometries.map((element, index) => {

                let sum = 1.0;
                const { geometry } = element;
                if(filters.includes('S1')){
                    if(geometry.male_total !== 0 && geometry.male_total !== 0 &&  geometry.female_total !== 0)
                     sum *= (geometry.male_total / (geometry.male_total + geometry.female_total))
                }
                if(filters.includes('S2')){
                    if(geometry.female_total !== 0 && geometry.male_total !== 0 &&  geometry.female_total !== 0)
                        sum *= (geometry.female_total / (geometry.male_total + geometry.female_total))
                }



                array.push({
                    index,
                    score: sum === 1 ? 0 : sum
                })
                return element ;
            });


            array.sort((a, b) => (a.score > b.score) ? 1 : -1)

            let i,j,temparray,chunk = array.length / 6;
            for (i=0,j=array.length; i<j; i+=chunk) {
                temparray = array.slice(i,i+chunk);
                source.push(temparray.map(tmp => {
                    if( i ===  5)
                        tmp.color = '#4575b4';
                    if( i ===  4)
                        tmp.color = '#91bfdb';
                    if( i ===  3)
                        tmp.color = '#e0f3f8';
                    if( i ===  2)
                        tmp.color = '#fee090';
                    if( i ===  1)
                        tmp.color = '#fc8d59';
                    if( i ===  0)
                        tmp.color = '#d73027';
                    return tmp;
                } ))
            }
            //TODO: LISTEN WE MIGHT HAVE TO MIGRATE TO THE DATABASE
            // TODO: SINCE WE CANT QUERY ALL THE AREAS. FOR EXAMPLE, IF WE CENTER INTO CALABASAS,
            // TODO: THEY ARE ALL RICH SO THE POOREST RICH PERSON WILL HAVE A BAD SCORE

            //ALGORITHM FOR DATABASE, IS THE SAME AS THIS ONE BUT WILL INVOLVE THE ENTIRE DATABASE
        }
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
