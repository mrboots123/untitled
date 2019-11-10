import {
    FETCH_CRIMES_FAILURE,
    FETCH_CRIMES_LOADING, FETCH_CRIMES_SUCCESS,
    FETCH_FILTERS_FAILURE,
    FETCH_FILTERS_LOADING,
    FETCH_FILTERS_SUCCESS,
    FETCH_LOCATION_SEARCH_FAILURE,
    FETCH_LOCATION_SEARCH_LOADING,
    FETCH_LOCATION_SEARCH_SUCCESS, FETCH_TILES_FAILURE, FETCH_TILES_LOADING, FETCH_TILES_SUCCESS,
    SET_BOUNDS,
    SET_FILTERS,
    SET_SELECTED,
    SET_VIEWPORT,
} from "../ActionTypes";

import {moveMeToServer} from "../../utility/Utilities";
import fetch from '../../utility/Fetch';


export const fetchTilesLayer = (bounds, filters, layer) => (dispatch) => {

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
            tiles: {}
        }));

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


export const fetchCrimeData = (center, radius) => (dispatch) => {
    dispatch({
        type: FETCH_CRIMES_LOADING
    });
    fetch("http://localhost:8080/graphql",
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                "query": "query t( $center: [Float], $radius: Float){\n" +
                    "\n" +
                    "  crimes(center: $center, radius: $radius){\n" +
                    "    cdid,\n" +
                    "    date,address,lat,lon, type\n" +
                    "  }\n" +
                    "  \n" +
                    "}",
                "variables": {"center": center, "radius": radius/100 }
            })
        })
        .then(response => response.json())
        .then(json => dispatch({
            type: FETCH_CRIMES_SUCCESS,
            crimes: json.data.crimes
        }))
        .catch(() => dispatch({
            type: FETCH_CRIMES_FAILURE,
            tiles: {}
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
