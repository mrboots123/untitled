import {
    BLOCK_LAYER,
    COUNTY_LAYER,
    FETCH_DATA_LAYERS, FETCH_LOCATION_SEARCH_FAILURE,
    FETCH_LOCATION_SEARCH_LOADING, FETCH_LOCATION_SEARCH_SUCCESS,
    NATION_LAYER, SET_BOUNDS, SET_FILTERS, SET_SELECTED, SET_VIEWPORT,
    STATE_LAYER
} from "../ActionTypes";
import nations from '../../nation'
import states from '../../states'
import counties from '../../counties'
import * as turf from "@turf/turf";
import blocks from '../../Blocks'

export const fetchDefaultLayer = () => (dispatch) => {
    dispatch({
        type: FETCH_DATA_LAYERS,
        data: {
            layer_type: NATION_LAYER,
            positions: turf.flip(nations).features
        }
    })
}


export const fetchDataLayer = (layer) => (dispatch) => {
    if(layer === NATION_LAYER){
        dispatch({
            type: FETCH_DATA_LAYERS,
            data: {
                layer_type: STATE_LAYER,
                positions: turf.flip(states)
            }
        })
    }
    else if(layer === STATE_LAYER){
        dispatch({
            type: FETCH_DATA_LAYERS,
            data: {
                layer_type: COUNTY_LAYER,
                positions: turf.flip(counties)
            }
        })
    }
    else if(layer === COUNTY_LAYER){
        dispatch({
            type: FETCH_DATA_LAYERS,
            data: {
                layer_type: BLOCK_LAYER,
                positions: turf.flip(blocks)
            }
        })
    }
    else if(layer === BLOCK_LAYER){

    }
}

export const fetchLocations = (query) => (dispatch) => {
    dispatch({
        type: FETCH_LOCATION_SEARCH_LOADING
    });
    return fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&country=US&countrycodes=US`)
        .then(response => response.json())
        .then(json => dispatch({
            type: FETCH_LOCATION_SEARCH_SUCCESS,
            places: json
        }))
        .catch(() => dispatch({
            type: FETCH_LOCATION_SEARCH_FAILURE
        }));
}

export const setViewPort = (viewport) => (dispatch) => {
    dispatch({
        type: SET_VIEWPORT,
        viewport
    });
}

export const setBounds = (bounds) => (dispatch) => {
    // dispatch({
    //    type: SET_BOUNDS,
    //    bounds
    // });
}

export const setFilters = (filters) => (dispatch) => {
    dispatch({
        type: SET_FILTERS,
        filters
    });
}

export const setSelected = (selected) => (dispatch) => {
    dispatch({
        type: SET_SELECTED,
        selected
    });
}
