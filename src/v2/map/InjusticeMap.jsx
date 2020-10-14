import React, { Component, Fragment } from 'react';
import {Map, Polygon as LeafletPolygon, TileLayer} from "react-leaflet";
import client from '../apollo/index';
import { useQuery, gql } from '@apollo/client';
import * as turf from "@turf/turf";
import styled from "styled-components";
import SearchArea from "../../map/components/SearchArea";
import BaseMapToggle from "../../map/components/BaseMapToggle";
import LocationButton from "../../map/components/LocationButton";
import UserLocationPin from "../../map/pins/UserLocationPin";
import {geolocated} from "react-geolocated";

const Polygon = styled(LeafletPolygon)`
    stroke-width: 1px;
    stroke: gray
    &:hover {
        fill-opacity: 0.7
    }
`

class InjusticeMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            viewport: {
                center: [33.36182, -112.126263],
                zoom: 15
            },
            isRedoSearch: true,
            isBaseMap: false,
            userLocation: {},
        }
        this.leaflet = React.createRef();
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // INFO: sets user location if the map has just loaded
        if(this.props.coords && prevProps.coords !== this.props.coords){
            const { latitude: lat, longitude: lng } = this.props.coords
            const location = {
                center: [lat, lng],
                zoom: 14
            }
            this.setState({ userLocation: location, viewport: location }, () => {
                this.updateGeographicalUnit();
            });
        }


    }

    moveListener = () => {
        let latLngBounds = this.leaflet.current.leafletElement.getBounds();
        const testBound = [
            [latLngBounds.getNorthWest().lat,latLngBounds.getNorthWest().lng],
            [latLngBounds.getSouthEast().lat,latLngBounds.getSouthEast().lng]
        ]
    }

    updateGeographicalUnit = () => {
        const { current: { leafletElement }} = this.leaflet;
        const { _zoom } = leafletElement;
        const { _northEast, _southWest, } = leafletElement.getBounds();
        const tables = {
            STATES: 'states',
            COUNTIES: 'cities',
            CITIES: 'cities',
            BLOCKS: 'blocks'
        }
        let table = ( _zoom <= 7 ? tables.STATES : (_zoom > 7 && _zoom <= 8 ? tables.COUNTIES :( _zoom >= 8 && _zoom <= 10 ? tables.CITIES: tables.BLOCKS)));
        client
            .query({
                query: gql`
                query {
                  ${table}(northWest: [${_northEast.lat},${_northEast.lng}], southEast: [${_southWest.lat},${_southWest.lng}]){
                    geom {
                         coordinates
                    }
                  }
                }
                `
            })
            .then(result => this.setState({data: Object.values(result.data)[0]}));
    }

    setBaseMap = () =>{
        this.setState({ isBaseMap: !this.state.isBaseMap }, () => {})
    }

    setRedoSearch = () => {
        this.setState({ isRedoSearch: !this.state.isRedoSearch },  this.updateGeographicalUnit);
    }
    setViewport = (viewport) => {
        this.setState({viewport})
    }

    render() {
        const { isBaseMap, isRedoSearch, userLocation, viewport } = this.state;

        return <Fragment>
            {
                this.props.isGeolocationAvailable ?
                    <Map
                        viewport={ viewport }
                        onViewportChanged={this.setViewport}
                        style={{'height' : '100vh', 'width': '100%'}}
                        ref={this.leaflet}
                        onMoveend={ (obj)=> console.log(obj.target._zoom) }
                    >
                        <BaseMapToggle
                            label='Base Map'
                            checked={isBaseMap}
                            onChange={this.setBaseMap}
                        />

                        <LocationButton
                            location={userLocation}
                            setLocation={this.setViewport}
                        />

                        <SearchArea
                            isRedoSearch={isRedoSearch}
                            setRedoSearch={this.setRedoSearch}
                        />

                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                        />

                        <UserLocationPin
                            location={userLocation}
                            setViewport={this.setViewport}
                        />

                        {
                            !this.state.isBaseMap &&
                            this.state.data.length > 0 &&
                            this.state.data.map((geographicalUnit,index) => {
                                const { geom: { coordinates } } = geographicalUnit;
                                return <Fragment>
                                    {
                                        coordinates.map((geography,geoIndex) => <Polygon
                                            key={`${index}|${geoIndex}x`}
                                            positions={turf.flip(turf.polygon(coordinates[geoIndex])).geometry.coordinates}
                                        />)
                                    }
                                </Fragment>

                            })
                        }
                    </Map> : <Fragment>
                        <div>Your browser does not support Geolocation</div>
                    </Fragment>
            }
        </Fragment>
    }
};

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(InjusticeMap);
