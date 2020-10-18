import React, { Component } from 'react';
import styled from "styled-components";
import { Polygon as LeafletPolygon } from 'react-leaflet';
import isEqual from 'lodash/isEqual';

const StyledPolygon = styled(LeafletPolygon)`
    stroke-width: 1px;
    stroke: gray;
    &:hover {
        fill-opacity: 1.0
    }
`

class Polygon extends Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
       return !isEqual(nextProps.positions, this.props.positions) || nextProps.isSelected !== this.props.isSelected;
    }

    render() {
        return (
            <StyledPolygon {...this.props} />
        );
    }
}

export default Polygon;
