
import React, {Fragment, useContext, useRef, useState} from 'react'
import { Marker as LeafletMarker, Popup } from "react-leaflet";
import markerPin from "./MarkerPin";
import {store} from "../../../../context/store";

const Marker = ({ crime, setViewport, id }) => {
    const { address, lat, lon, type } = crime;
    const {state, dispatch} = useContext(store);
    const isSelected = state.selectedCrime === id;
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
                            dispatch({
                                type: 'SET_SELECTED_CRIME',
                                index: id,
                            })
                        }
                        }
                        onMouseOver={(e) => {

                            if(!isSelected){
                                console.log('opening the popup because hovered')
                                e.target.openPopup();
                            }

                        }}
                        onMouseOut={(e) => {
                            if(!isSelected){
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

