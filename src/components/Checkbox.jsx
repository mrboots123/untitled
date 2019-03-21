import React, { Fragment } from 'react';

const CheckBox = ({ checked, onChange, label }) => (
    <Fragment>
        <input type="checkbox" onChange={onChange} checked={checked}/>
        <span className='pl-2 text-black-50 ' onClick={onChange}>{label} <small></small></span>
    </Fragment>
);

export default CheckBox;
