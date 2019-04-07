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
import {COUNTY_LAYER, NATION_LAYER, STATE_LAYER} from "../store/ActionTypes";
import {createPolygonFromBounds, isNestedPolygon} from '../utility/Utilities'

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
//TODO: THINK OF THE LOADING STRATEGY OF THE LAYERS, WE HAVE DEVELOPED THE HARD PART. NOW JUST NEED THE BUSINESS LOGICS -ZOOM IN OUT
//todo: at around zoom level 10-11 we should load the counties layer? then after that it should take over the dynamic layer change
//todo: lowest layer reached by dynamic county is 9?
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
            bounds: {},

        };
        this.setBaseMap = this.setBaseMap.bind(this);
        this.setRedoSearch = this.setRedoSearch.bind(this);
        this.setViewport = this.setViewport.bind(this);
        this.setBounds = this.setBounds.bind(this);
        this.leaflet = React.createRef();
        this.testFitBounds = this.testFitBounds.bind(this)
    }

    componentDidMount(){

    }



    testFitBounds (bounds) {
        this.leaflet.current.leafletElement.fitBounds(bounds);
    }

    moveListener(){
        if(this.leaflet){
            const latLngBounds = this.leaflet.current.leafletElement.getBounds();

            // if(this.props.bounds !== [
            //     [latLngBounds.getNorthWest().lat,latLngBounds.getNorthWest().lng],
            //     [latLngBounds.getSouthEast().lat,latLngBounds.getSouthEast().lng]
            // ]){
            //     this.props.setBounds([
            //         [latLngBounds.getNorthWest().lat,latLngBounds.getNorthWest().lng],
            //         [latLngBounds.getSouthEast().lat,latLngBounds.getSouthEast().lng]
            //     ])
            // }

            // this.setState({
            //         boundingBox: {
            //             northWest: [latLngBounds.getNorthWest().lat,latLngBounds.getNorthWest().lng],
            //             southWest: [latLngBounds.getSouthWest().lat,latLngBounds.getSouthWest().lng],
            //             northEast: [latLngBounds.getNorthEast().lat,latLngBounds.getNorthEast().lng],
            //             southEast: [latLngBounds.getSouthEast().lat,latLngBounds.getSouthEast().lng]
            //         }
            //     }, () =>
            //
            //     {
            //
            //         const bboxPoly = turf.polygon([createPolygonFromBounds(this.leaflet.current.leafletElement.getBounds())]);
            //
            //
            //         //isNestedPolygon(turf.flip(states).features,bboxPoly)
            //
            //
            //         //TODO: support multi polygon
            //         turf.flip(states).features.map(feature => {
            //             if(feature.geometry.type === 'Polygon'){
            //
            //               // console.log(turf.booleanWithin(feature, bboxPoly))
            //             }
            //             else{
            //                 feature.geometry.coordinates.map(ele => {
            //                     const poly = turf.polygon(ele)
            //                    // console.log(turf.booleanWithin(poly, bboxPoly))
            //                 })
            //             }
            //
            //
            //         })
            //
            //
            //     }
            // )
        }
    }

    componentDidUpdate(prevProps, prevState){



        if(prevProps.viewport !== this.props.viewport && !this.state.redoSearch && this.props.viewport.zoom && this.props.viewport.zoom >= 12 && this.props.viewport !== this.state.userLocation ){
            this.setState({ redoSearch: true })
        }

        /*
            TODO: initially we load the nation layer, but if user location is available
         */

        if(this.props.coords && prevProps.coords !== this.props.coords){
            const { latitude: lat, longitude: lng } = this.props.coords
            const location = {
                center: [lat, lng],
                zoom: 14
            }
            this.setState({
                userLocation: location
            }, () => {
                // this.props.fetchLayers(COUNTY_LAYER);
                this.props.setViewport(location);
            })
        }




        //TODO: what level should we put the modal in?
        //TODO: implement map level toast
        //TODO: we need to find a way to know if polygon is in bounding box. if it is not then load the next layer. EG. change payloads to loadAscendingLayer and loadDescendingLayer
        //TODO: clean up the props for polygon list
        //TODO: we cant use zoom to identify the layer since it varies tooo much,MAYBE WE HAVE TO USE ONCLICK?

        //TODO: make search area disappear if map enters state, or nation level
        //TODO: set up mock dispatch calls in advance for redux
        //TODO: BRING in css loaders for when new layer is being fetched, and gray out map? if call fails then ungray map and show toast
        //TODO: ADD toast to map level: if click location, if not results ?
        //TODO: when a user is on the  layer  and they click on it, it should take them one layer down
        //TODO: if user location is not available fall back to ip search
        //TODO: ADD site level toasts
        //TODO: Add tooltips, modals
        // if(prevState.viewport.zoom !== this.props.viewport.zoom){
        //     const { zoom } = this.props.viewport
        //     console.log(zoom)
        //     if(zoom > 9){
        //         console.log('all gucci we should be in the block layer')
        //         /*
        //          if zoom > 9 && !layer.block then load block
        //          else continue using dynamic layer
        //          */
        //     }
        //     else{
        //         console.log('start the dynamic layer loading process')
        //     }
        // }



    }

    setBaseMap(){
        this.setState({ isBaseMap: !this.state.isBaseMap })
    }

    setRedoSearch(){
        this.setState({redoSearch: !this.state.redoSearch})
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
                 bounds={ !isEmpty(this.props.bounds) ? this.props.bounds : null }
                 style={{'height' : '100vh', 'width': '100%'}}
                 ref={this.leaflet}
                 onMoveend={()=> this.moveListener()}

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
                    <PolygonList
                        isEnabled={this.state.isBaseMap}
                        paths={this.props.layer.positions.features }
                        layer={this.props.layer.layer_type}
                        setBounds={this.props.setBounds}
                        fetchLayers={this.props.fetchLayers}
                        setSelected={this.props.setSelected}
                        fitBounds={this.testFitBounds}
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
