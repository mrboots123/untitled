import React from 'react';
import CheckBox from "../../../components/checkbox/Checkbox";

const BaseMapToggle = ({ label,checked, onChange}) => (
    <div className='shadow bg-white position-absolute map-checkbox rounded p-2 map-z-index'>
        <CheckBox label={ label } onChange={ onChange } checked={ checked }/>
    </div>
);

export default BaseMapToggle
