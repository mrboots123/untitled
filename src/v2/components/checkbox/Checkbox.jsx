import React, { Fragment } from 'react';

const CheckBox = ({ checked, onChange, label }) => (
    <Fragment>
        <div className="d-flex">
            <div className="d-flex align-items-center">
                <input type="checkbox" onChange={onChange} checked={checked}/>
            </div>
            <span className='pl-2 text-black-50 ' onClick={onChange}>{label} <small></small></span>
        </div>
    </Fragment>
);

export default CheckBox;
