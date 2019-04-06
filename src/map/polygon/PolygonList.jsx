import React, {Component} from 'react'
import EnhancedPolygon from "./EnhancedPolygon";
import * as turf from "@turf/turf";
import chunk from 'lodash/chunk'
import sample from 'lodash/sample'
import {DEFAULT_COLOR} from "../../utility/Constants";

class PolygonList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: -1
        }
        this.setSelected = this.setSelected.bind(this);
    }

    setSelected(index) {
        this.setState({ selected: this.state.selected === index ? -1 : index })
    }


    render() {
        return (


            <div>
                {
                    this.props.paths && !this.props.isEnabled &&
                    this.props.paths.map((path, index) => {

                            /*
                            AFFGEOID: "1500000US040131125102"
                            ALAND: 7765351
                            AWATER: 0
                            BLKGRPCE: "2"
                            COUNTYFP: "013"
                            GEOID: "040131125102"
                            LSAD: "BG"
                            NAME: "2"
                            STATEFP: "04"
                            TRACTCE: "112510"
                             */

                            return <EnhancedPolygon
                                key={index}
                                layer={this.props.layer}
                                positions={path.geometry.coordinates}
                                color={this.state.selected === index ? '#2874A6' :sample(DEFAULT_COLOR)}
                                fillOpacity={0}
                                center={turf.centroid(path).geometry.coordinates}
                                onClick={() => {
                                    this.props.setSelected(index)
                                    const bounds = turf.bbox(path);
                                    this.setSelected(index);
                                    this.props.fitBounds(chunk(bounds,2))
                                    // this.props.setBounds(chunk(bounds,2));
                                    //todo: revisit this method, messing up since it tries ot center to a non existent polygon
                                   // this.props.fetchLayers(this.props.layer)

                                    //AVERAGE SALARY: B19013_001E
                                    //AVERAGE AGE: B01002_001E

                                    //these codes are for single total: ie this will be the default filter when they load the map
                                    // gets race and displays amount: we sum all races and create a percent out of 100
                                    //AMERICAN INDIAN: B01002C_001E
                                    //AFRICAN AMERICAN: B01002B_001E
                                    //asian: B01002D_001E
                                    //hawaii: B01002E_001E
                                    //white: B01002A_001E
                                    //B01003 - total population in tract
                                    //B19037_001E - ageAGE OF HOUSEHOLDER BY HOUSEHOLD INCOME
                                    //B19013	MEDIAN HOUSEHOLD INCOME IN THE PAST
                                    //B23013	MEDIAN AGE BY SEX FOR WORKERS 16 TO 64 YEARS
                                    // B23013_001E average age of workers in household
                                    // B99123	ALLOCATION OF MARRIED IN THE PAST 12 MONTHS FOR THE POPULATION 15 YEARS AND OVER
                                    //B11010	NONFAMILY HOUSEHOLDS BY SEX OF HOUSEHOLDER BY LIVING ALONE BY AGE OF HOUSEHOLDER
                                    //B06008_001E married total
                                    //B06008_002E single
                                    //TODO: THE ALGORITHM
                                    // make api call for individual filters. for example user selects age as 20-40. i call all polygons to get their data and whatever is closest to the value has priority

                                    //TODO: when new filters get applied ull have to look for combinations in the table. for example: salary range - 50-75k under 40 and is white only
                                    // fetch(`https://api.census.gov/data/2017/acs/acs5?get=B19037_001E,NAME&for=block%20group:${path.properties.BLKGRPCE}&in=state:${path.properties.STATEFP}%20county:${path.properties.COUNTYFP}%20tract:${path.properties.TRACTCE}`)
                                    //     .then(response => response.json())
                                    //     .then(json => console.log(json));

                                    // console.log(path)
                                }}
                                selected={this.state.selected === index}
                                fillOpacity={ this.state.selected === index ? 0.7 : 0.5 }
                            />
                        }
                    )
                }
            </div>
        );
    }

}

export default PolygonList;
