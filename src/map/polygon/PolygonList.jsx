import React, { Component, Fragment } from 'react'
import EnhancedPolygon from "./EnhancedPolygon";
import * as turf from "@turf/turf";
import chunk from 'lodash/chunk'
import {BLOCK_LAYER} from "../../store/ActionTypes";
import sample from 'lodash/sample'
import { LAYER_COLORS} from "../../utility/Constants";

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

                            return <EnhancedPolygon
                                key={index}
                                layer={this.props.layer}
                                positions={path.geometry.coordinates}
                                color={sample(LAYER_COLORS)}
                                center={turf.centroid(path).geometry.coordinates}
                                onClick={() => {
                                    const bounds = turf.bbox(path);
                                    this.setSelected(index);
                                    this.props.setBounds(chunk(bounds,2));
                                    //todo: revisit this method, messing up since it tries ot center to a non existent polygon
                                   // this.props.fetchLayers(this.props.layer)
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
