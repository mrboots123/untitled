import {
    BLOCK_LAYER,
    COUNTY_LAYER,
    FETCH_DATA_LAYERS, FETCH_DATA_LAYERS_TEST,
    FETCH_FILTERS_FAILURE,
    FETCH_FILTERS_LOADING,
    FETCH_FILTERS_SUCCESS,
    FETCH_LOCATION_SEARCH_FAILURE,
    FETCH_LOCATION_SEARCH_LOADING,
    FETCH_LOCATION_SEARCH_SUCCESS, FETCH_TILES_FAILURE, FETCH_TILES_LOADING, FETCH_TILES_SUCCESS,
    NATION_LAYER,
    SET_BOUNDS,
    SET_FILTERS,
    SET_SELECTED,
    SET_VIEWPORT,
    STATE_LAYER
} from "../ActionTypes";
import nations from '../../Blocks'
import * as turf from "@turf/turf";
import {moveMeToServer} from "../../utility/Utilities";

export const fetchDefaultLayer = () => (dispatch) => {
        dispatch({
            type: FETCH_DATA_LAYERS,
            data: {
                layer_type: BLOCK_LAYER,
                positions: turf.flip(nations)
            }
        })
}

export const fetchTilesLayer = (bounds, filters) => (dispatch) => {
    // console.log('DA BOUNDS')
    // console.log([bounds.getSouthWest().lat, bounds.getSouthWest().lng])
    // console.log('north')
    // console.log([bounds.getNorthEast().lat,bounds.getNorthEast().lng])

    dispatch({
        type: FETCH_TILES_LOADING
    });

    fetch("http://localhost:8080/graphql",
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                "query": "query t($southWest:[Float], $northEast: [Float]){tiles(southWest: $southWest, northEast: $northEast){geometry}}",
                "variables": {"southWest": [bounds.getSouthWest().lat, bounds.getSouthWest().lng],"northEast": [bounds.getNorthEast().lat,bounds.getNorthEast().lng]}
            })
        })
        .then(response => response.json())
        .then(json => dispatch({
            type: FETCH_TILES_SUCCESS,
            tiles: json.data.tiles
        }))
        .catch(() => dispatch({
            type: FETCH_TILES_FAILURE,
            tiles: moveMeToServer(bounds)
        }));

}

export const fetchDataLayer = (layer) => (dispatch) => {
        dispatch({
            type: FETCH_DATA_LAYERS_TEST,

                test: layer

        })
    // if(layer === NATION_LAYER){
    //     dispatch({
    //         type: FETCH_DATA_LAYERS,
    //         data: {
    //             layer_type: STATE_LAYER,
    //             positions: turf.flip(states)
    //         }
    //     })
    // }
    // else if(layer === STATE_LAYER){
    //     dispatch({
    //         type: FETCH_DATA_LAYERS,
    //         data: {
    //             layer_type: COUNTY_LAYER,
    //             positions: turf.flip(counties)
    //         }
    //     })
    // }
    // else if(layer === COUNTY_LAYER){
    //     dispatch({
    //         type: FETCH_DATA_LAYERS,
    //         data: {
    //             layer_type: BLOCK_LAYER,
    //             positions: turf.flip(blocks)
    //         }
    //     })
    // }
    // else if(layer === BLOCK_LAYER){
    //
    // }
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

export const fetchFilters = () => (dispatch) => {
    dispatch({
        type: FETCH_FILTERS_LOADING
    });
    return fetch(`https://myserver.com/filters`)
        .then(response => response.json())
        .then(json => dispatch({
            type: FETCH_FILTERS_SUCCESS,
            filters: json
        }))
        .catch(() => dispatch({
            type: FETCH_FILTERS_FAILURE
        }));
}

export const setViewPort = (viewport) => (dispatch) => {
    dispatch({
        type: SET_VIEWPORT,
        viewport
    });
}

export const setBounds = (bounds) => (dispatch) => {
    dispatch({
       type: SET_BOUNDS,
       bounds
    });
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
