import React, { Fragment } from 'react'
import { Marker } from "react-leaflet";
import { locationPin } from "./LocationPin";

const UserLocationPin = ({location, setViewport}) => (

    <Fragment>
        {
            location && location.center  ?
            <Marker
                position={location.center}
                icon={locationPin}
                onClick={() => setViewport(location) }
            /> : <Fragment/>
        }

    </Fragment>

)

export default UserLocationPin;
