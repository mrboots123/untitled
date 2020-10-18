import React, {Component, Fragment, useState} from 'react';
import styled from "styled-components";
import {IoIosArrowDown, IoIosArrowUp} from "react-icons/io";

const LegendIcon = styled.div`
  margin-left: 10px
  margin-right: 10px
  height: 20px;
  width: 20px;
  background-color: ${props => props.color ? props.color :'#bbb' }
  border-radius: 80%;
  display: inline-block;
`
const Legend = () => {
    const [expanded, setExpanded] = useState(true);
    const icons = [
        {
            label: 'Best',
            color: '#4575b4'
        },
        {
            label: 'Very Good',
            color: '#91bfdb'
        },
        {
            label: 'Good',
            color: '#e0f3f8'
        },
        {
            label: 'Average',
            color: '#fee090'
        },
        {
            label: 'Fair',
            color: '#fc8d59'
        },
        {
            label: 'Poor',
            color: '#d73027'
        },

    ]
    return (
        <Fragment>
            <div className='map-legend map-z-index rounded position-absolute bg-white'>
                <div className="d-flex pt-1 pb-1 border-bottom text-primary" onClick={() => setExpanded(!expanded)}>
                    <div className="w-100">
                        <div className="text-center lead">Legend</div>
                    </div>
                    <div className="pr-2 flex-grow-1 align-items-center d-flex">
                        {
                            expanded ?
                                <IoIosArrowUp size={20} color="blue" /> :
                                <IoIosArrowDown size={20} color="blue"/>

                        }
                    </div>
                </div>
                <Fragment>
                    {
                        expanded &&
                        <div className=" pt-2">

                            {
                                icons.map( item => <div key={item.color} className="d-flex align-items-center pb-2">
                                    <LegendIcon color={item.color}/>
                                    <div className="lead">{item.label}</div>
                                </div>)
                            }
                        </div>
                    }
                </Fragment>
            </div>
        </Fragment>
    );
}

export default Legend;
