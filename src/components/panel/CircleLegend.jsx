import React from 'react'
import styled from "styled-components";
import {Polygon} from "react-leaflet";

const Circle = styled.span`
  height: ${props => props.size ? `${props.size}px`: '10px'};
  width: ${props => props.size ? `${props.size}px`: '10px'};
  background-color: ${props => props.color ? props.color: '#bbb'};
  border-radius: 50%;
  display: inline-block;
`

const CircleLegend = ({size, color}) => (
    <div className="d-flex border-bottom pb-1 pt-1">
        <div className="d-flex align-items-center">
            <Circle size={size} color={color} />
        </div>
        <div className="pl-2"> White</div>

    </div>
)

export default CircleLegend;
