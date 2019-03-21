import React, {Fragment} from 'react';
import {IoMdLocate} from "react-icons/io";
import isEmpty from 'lodash/isEmpty'
import ReactTooltip from 'react-tooltip'


const LocationButton = ({ location, setLocation }) => (
    <Fragment>
        <ReactTooltip
            place="left" type="dark"
            effect="solid"
            delayShow={1000}
        />
        <button
            data-tip="My Location"
            type="button"
            className='map-location map-z-index rounded shadow position-absolute  pl-2 pr-2 btn btn-primary '
            onClick={ () => !isEmpty(location) && setLocation(location) }
        >
            <IoMdLocate size={20} color="white"/>
        </button>
    </Fragment>
);

export default LocationButton;
