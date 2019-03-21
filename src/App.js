import React, {Component, Fragment} from 'react';
import InjusticeMap from './map/InjusticeMap'
import {connect} from "react-redux";
import {fetchDataLayer, fetchLocations, setBounds, setFilters, setViewPort} from "./store/actions";
import {IoMdArrowDropright, IoMdArrowDropleft} from 'react-icons/io'
import ReactTooltip from "react-tooltip";
import LocationSearchInput from './map/components/Search'
import ExpandPanel from './components/panel/ExpandPanelButton'

import  'animate.css/animate.css'
import styled, { keyframes } from 'styled-components';
import { slideInLeft } from 'react-animations';
import SidePanelContainer from "./components/panel/SidePanelContainer";
import CheckBoxList from "./components/panel/CheckBoxList";

import list from './Income_Layers'
import races from './Race_Layers'
import ages from './Age_Layers'

class App extends Component {
    constructor(props){
        super(props)

        this.state = {
            expanded: true
        }
    }



  render() {
    return (
        <div className="container-fluid p-0 vh-100 ">
            <div className="row no-gutters p-0 h-100 ">


                <ExpandPanel expanded={this.state.expanded} onExpandClick={() => {this.setState({expanded: !this.state.expanded})}}/>

                <div className={`${this.state.expanded ? 'col-sm-3': 'd-none'} h-100 border-right  `}>

                    <div className="d-flex flex-column h-100">
                        <div className="pt-3 pb-3  bg-primary">
                            <LocationSearchInput fetchPlaces={this.props.fetchPlaces} places={this.props.places} setViewport={this.props.setViewport} />
                        </div>
                        <div className="pt-2 pb-2 bg-light pl-3 border-bottom"> Filters </div>

                        <div className="pt-2 flex-grow-1  d-flex  flex-column  ">
                            <div className="overflow-auto">
                                <CheckBoxList filters={this.props.filters} setFilters={this.props.setFilters} items={list} header='Income' />
                                <CheckBoxList filters={this.props.filters} setFilters={this.props.setFilters} items={races} header='Race'/>
                                <CheckBoxList filters={this.props.filters} setFilters={this.props.setFilters} items={ages} header='Age'/>
                            </div>
                        </div>

                        <div className='d-flex  applied-height p-3 border-top align-items-center'>
                            <button type="button" className="btn btn-outline-primary btn-sm filter-button mr-3" onClick={() => this.props.setFilters([])}>Clear</button>
                            <button type="button" className="btn btn-primary filter-button" onClick={() => console.log('send http and append ot header')}>Apply</button>


                        </div>

                    </div>

                </div>

                <div className={`${this.state.expanded ? 'col-sm-9' : 'col-sm-12'}`}>
                    <InjusticeMap
                        viewport={this.props.viewport}
                        bounds={this.props.bounds}
                        setViewport={this.props.setViewport}
                        layer={this.props.layer}
                        fetchLayers={this.props.fetchLayers}
                        setBounds={this.props.setBounds}
                    />
                </div>

            </div>

        </div>
    );
  }
}

function mapStateToProps(state, props){
    return {
        layer: state.dataLayerReducer.layer,
        places: state.placesReducer.places,
        viewport: state.setReducer.viewport,
        bounds: state.setReducer.bounds,
        filters: state.setReducer.filters
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchLayers: (layer) => dispatch(fetchDataLayer(layer)),
        fetchPlaces: (query) => dispatch(fetchLocations(query)),
        setViewport: (viewport) => dispatch(setViewPort(viewport)),
        setBounds: (bounds) => dispatch(setBounds(bounds)),
        setFilters: (filters) => dispatch(setFilters(filters))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
