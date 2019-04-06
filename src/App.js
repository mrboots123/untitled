import React, {Component, Fragment} from 'react';
import InjusticeMap from './map/InjusticeMap'
import {connect} from "react-redux";
import {fetchDataLayer, fetchLocations, setBounds, setFilters, setSelected, setViewPort} from "./store/actions";
import {IoMdArrowDropright, IoMdArrowDropleft, IoIosClose} from 'react-icons/io'
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
// const ReactHighcharts = require('react-highcharts');
import marital from './Marital_Status'
import BlockInformation from "./map/components/BlockInformation";

class App extends Component {
    constructor(props){
        super(props)

        this.state = {
            expanded: true,
            series: [{
            name: 'Gases',
            data: [
                {
                    name: 'Argon',
                    y: 0.9,
                    color: '#3498db'
                },
                {
                    name: 'Nitrogen',
                    y: 78.1,
                    color: '#9b59b6'
                },
                {
                    name: 'Oxygen',
                    y: 20.9,
                    color: '#2ecc71'
                },
                {
                    name: 'Trace Gases',
                    y: 0.1,
                    color: '#f1c40f'
                }
            ]
        }]
        }
    }



  render() {
        console.log(( this.props.selected > 0  ))
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

                        <div className="pt-2   d-flex  flex-column flex-fill overflow-auto">


                                <CheckBoxList filters={this.props.filters} setFilters={this.props.setFilters} items={marital} header='Marital Status' />

                                <CheckBoxList filters={this.props.filters} setFilters={this.props.setFilters} items={list} header='Income' />
                                <CheckBoxList filters={this.props.filters} setFilters={this.props.setFilters} items={races} header='Race'/>
                                <CheckBoxList filters={this.props.filters} setFilters={this.props.setFilters} items={ages} header='Age'/>

                        </div>

                        <div className='d-flex   content applied-height p-3 border-top align-items-center pt-4'>
                            <div className="col-lg-12 row no-gutters p-0">
                                <div className="col-lg-6 pr-1">
                                    <button type="button" className="btn btn-outline-primary btn-block  " onClick={() => this.props.setFilters([])}>Clear</button>

                                </div>
                                <div className="pl-1 col-lg-6">
                                    <button type="button" className="btn btn-primary btn-block " onClick={() => console.log('send http and append ot header')}>Apply</button>

                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                {
                    this.props.selected !== -1 &&
                    <BlockInformation
                        setSelected={this.props.setSelected}
                        layer={this.props.layer.positions.features[this.props.selected]}
                    />
                }




                <div className={`${this.props.selected !== -1 && this.state.expanded ? 'col-sm-6' : (this.props.selected > 0 && !this.state.expanded) || (this.props.selected === -1 && this.state.expanded) ? 'col-sm-9' : 'col-sm-12'}`}>
                    <InjusticeMap
                        viewport={this.props.viewport}
                        bounds={this.props.bounds}
                        setViewport={this.props.setViewport}
                        layer={this.props.layer}
                        fetchLayers={this.props.fetchLayers}
                        setBounds={this.props.setBounds}
                        setSelected={this.props.setSelected}
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
        filters: state.setReducer.filters,
        selected: state.setReducer.selected
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchLayers: (layer) => dispatch(fetchDataLayer(layer)),
        fetchPlaces: (query) => dispatch(fetchLocations(query)),
        setViewport: (viewport) => dispatch(setViewPort(viewport)),
        setBounds: (bounds) => dispatch(setBounds(bounds)),
        setFilters: (filters) => dispatch(setFilters(filters)),
        setSelected: (selected) => dispatch(setSelected(selected))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
