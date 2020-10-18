import React, {Component, Fragment, useState} from 'react';
import {Map, TileLayer} from "react-leaflet";
import client from '../apollo/index';
import { gql } from '@apollo/client';
import * as turf from "@turf/turf";
import SearchArea from "./overlay/button/search/SearchArea";
import BaseMapToggle from "./overlay/toggle/BaseMapToggle";
import LocationButton from "./overlay/button/location/LocationButton";
import UserLocationPin from "./overlay/pin/location/UserLocationPin";
import {geolocated} from "react-geolocated";
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import chunk from 'lodash/chunk';
import Polygon from './overlay/polygon/Polygon';
import Legend from "./overlay/legend/Legend";
import MarkerIcon from "./overlay/pin/marker/Marker";
import { store } from '../context/store';

class InjusticeMap extends Component {
    static contextType = store;

    constructor(props) {
        super(props);
        this.state = {
            bounds: [],
            data: {},
            viewport: {
                center: [33.36182, -112.126263],
                zoom: 14
            },
            radius: -1,
            isRedoSearch: false,
            isBaseMap: false,
            userLocation: {},
        }
        this.leaflet = React.createRef();
    }

    componentDidMount() {
        // todo: optimize the query -  currently its taking too long for areas that are zoomed in
        // todo: you must make multiple calls -> seperate the queries take milliseconds
        //todo: rehydrate the state from the url
        //todo: polygons are being rerendered too much, we need to only rerender them when new props appear, move it out like in v1
    }

    colors = (value) => {
        // 6 color palette
        const palette = ['#4575b4','#91bfdb','#e0f3f8','#fee090','#fc8d59','#d73027'].reverse()
        const val = Math.floor(value / .1666667);
        return palette[ val ]
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
                // todo: when query params are in url we cant be loading the bounds from here, we must rehydrate
                this.updateGeographicalUnit();
            });
        }
    }

    fitBounds = (bounds) => this.leaflet.current.leafletElement.fitBounds(bounds);

    getCurrentBounds = () => {
        const { current: { leafletElement }} = this.leaflet;
        const bounds = leafletElement.getBounds();

        const { lat: currentNWLat, lng: currentNWLng } = bounds.getNorthWest();
        const { lat: currentSELat, lng: currentSELng } = bounds.getSouthEast();
        const currentBounds = [[currentNWLat,currentNWLng],[currentSELat,currentSELng]]

        return currentBounds;
    }

    moveListener = () => {
        const currentBounds = this.getCurrentBounds();
        const { bounds } = this.state;
        // Info: compares currentBounds to state Bounds if they are not the same then set bounds and search
        if(!isEqual(currentBounds, bounds)){
            if(!isEmpty(bounds)){
                this.setState({ isRedoSearch: true });
            }
            let latLngBounds = this.leaflet.current.leafletElement.getBounds();

            let radius = turf.distance([latLngBounds._northEast.lat,latLngBounds._northEast.lng],this.state.viewport.center);

            this.setState({ bounds: currentBounds, radius });
        }
    }

    updateGeographicalUnit = async () => {
        const { current: { leafletElement }} = this.leaflet;
        const { _zoom } = leafletElement;
        const { _northEast, _southWest, } = leafletElement.getBounds();
        const geography = await client
            .query({
                query: gql`
                query {
                  test(
                    zoom: ${_zoom},
                    filters: ["B19013","B02001"],,
                    northWest: [${_northEast.lat},${_northEast.lng}],
                      southEast: [${_southWest.lat},${_southWest.lng}]
                  )
                }

                `
            })
        this.context.dispatch({
            type: 'SET_GEOGRAPHICAL_DATA',
            geographicalData: Object.values(geography.data)[0],
        })

    }

    setBaseMap = () =>{
        this.setState({ isBaseMap: !this.state.isBaseMap }, () => {})
    }

    setRedoSearch = () => {
        this.setState({ isRedoSearch: !this.state.isRedoSearch },  this.updateGeographicalUnit);
    }

    centerPolygon = (path, index) => {
        // INFO: centers the screen to your tile
        this.fitBounds(chunk(turf.bbox(path),2));
        this.context.dispatch({
            type: 'SET_SELECTED_GEOGRAPHY',
            index,
        })

    }

    setViewport = (viewport) => {
        this.setState({ viewport })
    }

    fetchCrimes = async () => {
         const {radius, viewport: {center}} = this.state;
         const crimes = await client
             .query({
                 query: gql`
                query {
                    crimes(radius: ${radius}, center: [${center[0]},${center[1]}])
                }
                `
             })

         this.context.dispatch({
             type: 'SET_CRIME_DATA',
             crimeData: Object.values(crimes.data)[0],
         })
     }

    render() {
        const { state: {  crimes, geographies, selectedGeography } } = this.context;
        const { isBaseMap, isRedoSearch, userLocation, viewport } = this.state;
        return <Fragment>
            {
                this.props.isGeolocationAvailable ?
                    <Map
                        viewport={ viewport }
                        onViewportChanged={ this.setViewport }
                        style={{'height' : '100vh', 'width': '100%'}}
                        ref={this.leaflet}
                        onMoveend={ this.moveListener }
                    >
                        <BaseMapToggle
                            label='Base Map'
                            checked={isBaseMap}
                            onChange={this.setBaseMap}
                        />

                        <LocationButton
                            location={userLocation}
                            setLocation={this.fetchCrimes}
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

                        <Legend/>
                        {
                            !this.state.isBaseMap &&
                            geographies && geographies.length > 0 &&
                            geographies.map((geographicalUnit,index) => {
                                const { geom: { coordinates }, result } = geographicalUnit;
                                return <div key={index}>
                                    {
                                        coordinates.map((geography,geoIndex) => {
                                            const geo = turf.flip(turf.polygon(coordinates[geoIndex]));
                                            const key = `${index}-${geoIndex}`
                                            const isSelected = selectedGeography === key;
                                            return <Polygon
                                                key={key}
                                                onClick={() => this.centerPolygon(geo,key)}
                                                positions={geo.geometry.coordinates}
                                                color={this.colors(result) }
                                                fillOpacity={ isSelected ? 1.0 : 0.8 }
                                                isSelected={ isSelected }
                                            />
                                        })
                                    }
                                </div>

                            })
                        }
                        {
                            crimes &&
                                crimes.map(crime => <MarkerIcon key={crime.cdid} crime={crime} setViewport={this.setViewport}/>)
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
