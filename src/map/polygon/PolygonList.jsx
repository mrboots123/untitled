import React, {Component} from 'react'
import EnhancedPolygon from "./EnhancedPolygon";
import * as turf from "@turf/turf";
import chunk from 'lodash/chunk'
import sample from 'lodash/sample'
import {DEFAULT_COLOR , LAYER_COLORS} from "../../utility/Constants";

class PolygonList extends Component {
    constructor(props) {
        super(props);
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
        //TODO: on click sends a request to reverse geocode which will grab suburb as the header, city, state -> in popup marker
        // should the tiles come preloaded with all this information?
        return (
            <div>
                {
                    this.props.paths && !this.props.isEnabled &&
                    this.props.paths.map((path, index) => {


                            return <EnhancedPolygon
                                size={this.props.paths.length}
                                key={index}
                                layer={this.props.layer}
                                positions={path.geometry.coordinates}
                                color={ sample(LAYER_COLORS)}
                                fillOpacity={0}
                                center={turf.centroid(path).geometry.coordinates}
                                onClick={() => this.setSelected(path,index)}
                                selected={this.props.selected === index}
                                fillOpacity={ this.props.selected === index ? 0.7 : 0.5 }
                            />
                        }
                    )
                }
            </div>
        );
    }

}

export default PolygonList;
