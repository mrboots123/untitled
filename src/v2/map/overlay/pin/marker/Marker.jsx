
import React, { Fragment, useState } from 'react'
import { Marker as LeafletMarker, Popup } from "react-leaflet";
import markerPin from "./MarkerPin";

const Marker = ({ crime, setViewport }) => {
    const { address, lat, lon, type } = crime;
    const [selected, setSelected] = useState(false);
    return (
        <Fragment>
            {
                crime ?
                    <LeafletMarker
                        icon={markerPin}
                        position={[lat, lon]}
                        onClick={(e) => {
                            const location = {
                                center: [lat,lon],
                                zoom: 14
                            }
                            setViewport(location)
                        }
                        }
                        onMouseOver={(e) => {

                            if(!selected){
                                console.log('opening the popup because hovered')
                                e.target.openPopup();
                            }

                        }}
                        onMouseOut={(e) => {
                            if(!selected){
                                console.log('closing the popup because left')
                                e.target.closePopup();
                            }

                        }}

                    >
                        <Popup>
                            <div>{type}</div>
                            <div>{address}</div>
                        </Popup>
                    </LeafletMarker> : <Fragment/>
            }

        </Fragment>
    );
};

export default React.memo(Marker);

