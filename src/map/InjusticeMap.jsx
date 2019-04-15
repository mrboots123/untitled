import React from 'react'
import {Map, TileLayer} from 'react-leaflet'
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


const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};
//TODO: null check the tiles
class InjusticeMap extends React.Component {
    constructor() {
        super();
        this.state = {
            //TODO: Migrate most of the state into redux
            isBaseMap: false,
            redoSearch: false,
            userLocation: {},
            viewport: {
                center: [40.7128, -74.0060],
                zoom: 3
            },
            bounds: {}
        }
        this.setBaseMap = this.setBaseMap.bind(this);
        this.setRedoSearch = this.setRedoSearch.bind(this);
        this.setViewport = this.setViewport.bind(this);
        this.setBounds = this.setBounds.bind(this);
        this.leaflet = React.createRef();
        this.testFitBounds = this.testFitBounds.bind(this)
    }

    componentDidMount(){
        this.setState({ oldSelected: this.props.selected })
    }



    testFitBounds (bounds) {

        this.leaflet.current.leafletElement.fitBounds(bounds);
        this.props.setBounds(bounds);
    }


    moveListener(){

        this.props.setQueryParams()
        if(this.leaflet){
                const latLngBounds = this.leaflet.current.leafletElement.getBounds();


                const testBound = [
                    [latLngBounds.getNorthWest().lat,latLngBounds.getNorthWest().lng],
                    [latLngBounds.getSouthEast().lat,latLngBounds.getSouthEast().lng]
                ]

                let  [[nwLat,nwLng],[seLat,seLng]]  = this.props.bounds
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


            if((prevProps.bounds[0].length <= 0)){
                this.props.fetchTiles(this.leaflet.current.leafletElement.getBounds())
            }
        }

        if(this.props.coords && prevProps.coords !== this.props.coords){
            const { latitude: lat, longitude: lng } = this.props.coords
            const location = {
                center: [lat, lng],
                zoom: 14
            }
            this.setState({
                userLocation: location
            }, () => {
                this.props.setViewport(location);
            })
        }

    }

    setBaseMap(){
        this.setState({ isBaseMap: !this.state.isBaseMap })
    }

    setRedoSearch(){
        this.setState({redoSearch: !this.state.redoSearch}, () => {
            // const bbox = turf.polygon([createPolygonFromBounds(this.leaflet.current.leafletElement.getBounds())]);

            this.props.fetchTiles(this.leaflet.current.leafletElement.getBounds())

            // console.log(bbox)
            //
            //         let list = []
            //         turf.flip(blocks).features.map(feature => {
            //             if(feature.geometry.type === 'Polygon'){
            //                 if(!turf.booleanDisjoint(feature, bbox)){
            //                     list.push(feature.properties.AFFGEOID)
            //                 }
            //             }
            //             //TODO: THIS IS FOR MULTI POLYGONS
            //             // else{
            //             //     feature.geometry.coordinates.map(ele => {
            //             //         const poly = turf.polygon(ele)
            //             //        // console.log(turf.booleanWithin(poly, bboxPoly))
            //             //         if(turf.booleanWithin(poly, bbox)){
            //             //             list.push(poly.properties.AFFGEOID)
            //             //         }
            //             //     })
            //             // }
            //
            //
            //         })

            this.props.fetchTiles(this.leaflet.current.leafletElement.getBounds())
           // this.props.setTest(list)
        })
    }

    setViewport(viewport){

        this.setState({viewport})
    }

    setBounds(bounds){
        this.setState({bounds: bounds})
    }


    render() {


        return (
            this.props.isGeolocationAvailable && this.props.viewport &&
            <Map
                 viewport={ this.props.viewport }
                 onViewportChanged={this.props.setViewport}
                 style={{'height' : '100vh', 'width': '100%'}}
                 ref={this.leaflet}
                 onMoveend={ ()=> this.moveListener() }

            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                />

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
                    this.props.layer &&
                    this.props.layer.features &&
                    <PolygonList
                        isEnabled={this.state.isBaseMap}
                        paths={this.props.layer.features }
                        layer={this.props.layer.layer_type}
                        setBounds={this.props.setBounds}
                        fetchLayers={this.props.fetchLayers}
                        setSelected={this.props.setSelected}
                        fitBounds={this.testFitBounds}
                        selected={this.props.selected}
                        test={this.props.test}
                    />

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
