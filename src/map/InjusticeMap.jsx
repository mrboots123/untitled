import React from 'react'
import {Map, Polygon, TileLayer, Marker, Popup} from 'react-leaflet'
import MarkerIcon from '../map/pins/Marker'
import * as turf from '@turf/turf'
import {geolocated} from "react-geolocated";
import UserLocationPin from "./pins/UserLocationPin";
import PolygonList from "./polygon/PolygonList";
import BaseMapToggle from "./components/BaseMapToggle";
import SearchArea from "./components/SearchArea";
import LocationButton from "./components/LocationButton";
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import {COUNTY_LAYER, NATION_LAYER, STATE_LAYER} from "../store/ActionTypes";
import {createPolygonFromBounds, isNestedPolygon} from '../utility/Utilities'
import flatten from 'lodash/flatten'
import blocks from '../Blocks'
import Loading from "../components/loading/Loading";
import test from '../test'
import {BLOCK, CITY, COUNTY, setColor, STATE} from "../utility/Constants";
import Polygons from "./polygon/Polygons";
import Legend from "./components/Legend";
import { FaMask } from 'react-icons/fa'

//TODO: null check the tiles
class InjusticeMap extends React.Component {
    constructor() {
        super();
        this.state = {
            isBaseMap: false,
            redoSearch: false,
            userLocation: {},
            viewport: {
                center: [40.7128, -74.0060],
                zoom: 3
            },
            bounds: {},
            loadedInitialTiles: false
        }
        this.setBaseMap = this.setBaseMap.bind(this);
        this.setRedoSearch = this.setRedoSearch.bind(this);
        this.setViewport = this.setViewport.bind(this);
        this.setBounds = this.setBounds.bind(this);
        this.leaflet = React.createRef();
        this.testFitBounds = this.testFitBounds.bind(this);
        this.loadTiles = this.loadTiles.bind(this);
    }

    componentDidMount(){
        this.setState({ oldSelected: this.props.selected })
    }



    testFitBounds (bounds) {

        this.leaflet.current.leafletElement.fitBounds(bounds);
       // this.props.setBounds(bounds);
    }


    moveListener(){

        this.props.setQueryParams()
        if(this.leaflet){
                let latLngBounds = this.leaflet.current.leafletElement.getBounds();


                //console.log(this.leaflet.current.leafletElement.getBounds())

                const testBound = [
                    [latLngBounds.getNorthWest().lat,latLngBounds.getNorthWest().lng],
                    [latLngBounds.getSouthEast().lat,latLngBounds.getSouthEast().lng]
                ]

                // TODO: here we will save the radius of the current bbox, calculated as Math.sqrt((l*w)/pi)

                let  [[nwLat,nwLng],[seLat,seLng]]  = this.props.bounds;


                let radius = turf.distance([latLngBounds._northEast.lat,latLngBounds._northEast.lng],this.props.viewport.center);
                this.setState({bboxRadius: radius})
              //  console.log([latLngBounds._northEast.lat,latLngBounds._northEast.lng])
              // console.log(this.state.userLocation.center)
              // console.log(turf.distance([latLngBounds._northEast.lat,latLngBounds._northEast.lng],this.state.userLocation.center,{units: 'miles'}))
                // var mapBoundNorthEast = map.getBounds().getNorthEast();
                // var mapDistance = mapBoundNorthEast.distanceTo(map.getCenter());
                // return mapDistance/1000;



                if(!((nwLat === testBound[0][0] && nwLng === testBound[0][1]) && (seLat === testBound[1][0] && seLng === testBound[1][1]))){
                    //TODO: CLICKING A TILE AND RECENTERS IT SHOULD NOT CAUSE IT TO SET SEARCH TO TRUE
                    //TODO: WE NEED TO PREVENT THIS METHOD FROM EXECUTING
                    if(this.state.oldSelected !== this.props.selected ){ //-1 == 8 how to check if initial new position
                        this.setState({redoSearch: false, oldSelected: this.props.selected})
                    } else if(!(this.props.bounds[0].length <= 0)){
                        this.setState({redoSearch: true})
                    }

                    this.props.setBounds(testBound)
                }


        }
    }

    componentDidUpdate(prevProps, prevState){

        if(prevProps.selected !== this.props.selected){

            this.setState({ oldSelected: prevProps.selected })
        }

        if(this.leaflet) {


            //FETCH THE INTIAL Tiles, todo, make it only load once, currently if it fails the call itll retry infintely
            if((prevProps.bounds[0].length <= 0)){
               this.props.fetchTiles(this.leaflet.current.leafletElement.getBounds(), this.props.filters)
            }
        }

        //TODO: RUN ONCE for the user location
        if(this.props.coords && prevProps.coords !== this.props.coords && !this.state.loadedInitialTiles){
            const { latitude: lat, longitude: lng } = this.props.coords
            const location = {
                center: [lat, lng],
                zoom: 14
            }
            this.setState({
                userLocation: location,
                loadedInitialTiles: true
            }, () => {
                this.props.setViewport(location);
            })
        }

    }

    loadTiles(){
        if(!isEmpty(this.props.viewport)){
            const { zoom } = this.props.viewport;
            const bounds = this.leaflet.current.leafletElement.getBounds();
            const filters = this.props.filter;
            if(zoom <= 6){
                console.log('loading state');
                this.props.fetchTiles(bounds,filters,STATE)

            } else if( zoom > 6 && zoom <= 7){
                console.log('loading counties');
                this.props.fetchTiles(bounds,filters,COUNTY)

            } else if( zoom >= 8 && zoom <= 10){
                console.log('loading cities');
                this.props.fetchTiles(bounds,filters,CITY)

            } else {
                console.log('the blocks');
                this.props.fetchTiles(bounds,filters,BLOCK)

            }
        }
    }

    setBaseMap(){
        this.setState({ isBaseMap: !this.state.isBaseMap }, () => this.props.setSelected(-1))
    }

    setRedoSearch(){
        this.setState({redoSearch: !this.state.redoSearch}, () => {
           // this.loadTiles();
            // todo: here we should send the radius
            this.props.fetchCrimeData(this.props.viewport.center, this.state.bboxRadius)
        })
    }

    setViewport(viewport){

        this.setState({viewport})
    }

    setBounds(bounds){
        this.setState({bounds: bounds})
    }


    render() {


        console.log('we are refreshing like crazy')
        return (
            this.props.isGeolocationAvailable && this.props.viewport &&
            <Map
                 viewport={ this.props.viewport }
                 onViewportChanged={this.props.setViewport}
                 style={{'height' : '100vh', 'width': '100%'}}
                 ref={this.leaflet}
                 onMoveend={ ()=> this.moveListener() }
                 onZoomend={(zoom) => console.log(zoom.target._zoom)}

            >


                <Loading isLoading={this.props.isLoadingTiles}/>


                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                />


                {
                   !isEmpty(this.props.layer) &&
                   !this.state.isBaseMap &&
                   <Legend/>
                }



                <UserLocationPin
                    location={this.state.userLocation}
                    setViewport={this.props.setViewport}
                />

                <BaseMapToggle
                    label='Base Map'
                    checked={this.state.isBaseMap}
                    onChange={this.setBaseMap}
                />

                <SearchArea
                    isRedoSearch={this.state.redoSearch}
                    setRedoSearch={this.setRedoSearch}
                />

                <LocationButton
                    location={this.state.userLocation}
                    setLocation={this.props.setViewport}
                />

                {
                    !this.state.isBaseMap &&
                    <Polygons
                        geometries={this.props.layer}
                        fitBounds={this.testFitBounds}
                        selected={this.props.selected}
                        setSelected={this.props.setSelected}
                        filters={this.props.filter}
                    />
                }



                {
                    this.props.crimes &&
                        this.props.crimes.map(crime =>
                          <MarkerIcon key={crime.cdid} crime={crime} fit={this.testFitBounds}>

                          </MarkerIcon>
                        )
                }


            </Map>
        );
    }
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(InjusticeMap);
