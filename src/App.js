import React, {Component} from 'react';
import InjusticeMap from './map/InjusticeMap'
import {connect} from "react-redux";
import {
    fetchCrimeData,
    fetchLocations,
    fetchTilesLayer,
    setBounds,
    setFilters,
    setSelected,
    setViewPort
} from "./store/actions";
import LocationSearchInput from './map/components/Search'
import ExpandPanel from './components/panel/ExpandPanelButton'

import  'animate.css/animate.css'

import CheckBoxList from "./components/panel/CheckBoxList";


import  queryString  from 'query-string'
import BlockInformation from "./map/components/BlockInformation";
import {withRouter} from "react-router-dom";
import { push } from 'connected-react-router'

class App extends Component {
    constructor(props){
        super(props)

        this.state = {
            expanded: true,
        }

        this.setQueryParams = this.setQueryParams.bind(this)
    }

    componentDidMount(){
        //TODO:  this is for when we actually grab from url and hydrate
        //TODO: give aliases to filters, adding the filter name to the url is causing too much encoding


            const { filters  } = queryString.parse(this.props.path.search)
            if(filters){
                this.props.setFilters(filters.split(','))
            }


            //TODO: make a call to the server for the new tiles based on the new hydrated props

    }

    componentDidUpdate(prevProps, prevState){

    }

    setQueryParams() {

        //TODO: the clear button should remove the filter query from the url

        let query = {}


        if(this.props.filters.length > 0){
            query.filters =  this.props.filters.join(',')
        }
        if(this.props.bounds){
            if(this.props.bounds[0].length === 2){
                query.nw = this.props.bounds[0].join(',')
            }
            if(this.props.bounds[1].length === 2){
                query.se = this.props.bounds[1].join(',')
            }

        }

        this.props.push(`?${queryString.stringify(query)}`)
    }

    removeFilterQueryParams() {
        let params = queryString.parse(this.props.path.search)
        delete params.filters
        this.props.push(`?${queryString.stringify(params)}`)
    }


  render() {

    return (
        <div className="container-fluid p-0 vh-100 ">
            <div className="row no-gutters p-0 h-100 ">

                {
                    /*
                                    <ExpandPanel expanded={this.state.expanded} onExpandClick={() => {this.setState({expanded: !this.state.expanded})}}/>

                <div className={`${this.state.expanded ? 'col-sm-3': 'd-none'} h-100 border-right  `}>

                    <div className="d-flex flex-column h-100">
                        <div className="pt-3 pb-3  bg-primary">
                            <LocationSearchInput fetchPlaces={this.props.fetchPlaces} places={this.props.places} setViewport={this.props.setViewport} />
                        </div>
                        <div className="pt-2 pb-2 bg-light pl-3 border-bottom"> Filters </div>

                        <div className="pt-2   d-flex  flex-column flex-fill overflow-auto">

                            {
                                this.props.filtersList &&
                                    this.props.filtersList.map(filter =>
                                        <CheckBoxList key={filter.filter_name} filters={this.props.filters} setFilters={this.props.setFilters} items={filter.list} header={filter.filter_name}/>
                                    )
                            }

                        </div>

                        <div className='d-flex   content applied-height p-3 border-top align-items-center pt-4'>
                            <div className="col-lg-12 row no-gutters p-0">
                                <div className="col-lg-6 pr-1">
                                    <button type="button" className="btn btn-outline-primary btn-block  " onClick={() => {
                                        this.props.setFilters([])
                                        this.removeFilterQueryParams()
                                    }}>Clear</button>

                                </div>
                                <div className="pl-1 col-lg-6">
                                    <button type="button" className="btn btn-primary btn-block " onClick={() => this.setQueryParams()}>Apply</button>

                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                {
                    this.props.selected !== -1 &&
                    <BlockInformation
                        setSelected={this.props.setSelected}
                        tile={this.props.tiles[this.props.selected]}
                    />
                }
                     */
                }





{
    /*
    className={`${this.props.selected !== -1 && this.state.expanded ? 'col-sm-6' : (this.props.selected > 0 && !this.state.expanded) || (this.props.selected === -1 && this.state.expanded) ? 'col-sm-9' : 'col-sm-12'}`}
     */
}
                <div className="col-sm-12">
                    <InjusticeMap
                        viewport={this.props.viewport}
                        bounds={this.props.bounds}
                        setViewport={this.props.setViewport}
                        layer={this.props.tiles}
                        fetchLayers={this.props.fetchLayers}
                        setBounds={this.props.setBounds}
                        setQueryParams={this.setQueryParams}
                        setSelected={this.props.setSelected}
                        selected={this.props.selected}
                        setTest={this.props.fetchLayers}
                        test={this.props.test}
                        fetchTiles={this.props.fetchTiles}
                        isLoadingTiles={this.props.isFetchingTiles}
                        filter={this.props.filters}
                        fetchCrimeData={this.props.fetchCrimeData}
                        crimes={this.props.crimes}

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
        selected: state.setReducer.selected,
        path: state.router.location,
        filtersList: state.filtersReducer.filtersList,
        test: state.dataLayerReducer.test,
        tiles: state.dataLayerReducer.tiles,
        isFetchingTiles: state.dataLayerReducer.tile_loading,
        crimes: state.crimesReducer.crimes
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchPlaces: (query) => dispatch(fetchLocations(query)),
        fetchTiles: (bounds, filters, layer) => dispatch(fetchTilesLayer(bounds,filters,layer)),
        setViewport: (viewport) => dispatch(setViewPort(viewport)),
        setBounds: (bounds) => dispatch(setBounds(bounds)),
        setFilters: (filters) => dispatch(setFilters(filters)),
        setSelected: (selected) => dispatch(setSelected(selected)),
        fetchCrimeData: (center, radius) => dispatch(fetchCrimeData(center,radius))
    }
}





export default connect(mapStateToProps, mapDispatchToProps)(connect(null, { push })(withRouter(props => <App {...props}/>)))
