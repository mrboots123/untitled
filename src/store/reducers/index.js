import { combineReducers } from 'redux';
import {
    FETCH_DATA_LAYERS,
    FETCH_LOCATION_SEARCH_FAILURE,
    FETCH_LOCATION_SEARCH_LOADING,
    FETCH_LOCATION_SEARCH_SUCCESS, SET_BOUNDS, SET_FILTERS, SET_SELECTED, SET_VIEWPORT
} from "../ActionTypes";

const initialState = {
    viewport: {
        center: [40.7128, -74.0060],
        zoom: 11
    },
    userLocation: {},
    bounds: {},
    filters: [],
    selected: -1
};

const setReducer = (state= initialState, action) => {
  switch (action.type) {
      case SET_VIEWPORT:
          return { ...state, viewport: action.viewport }
      case SET_FILTERS:
          return { ...state, filters: action.filters }
      case SET_BOUNDS:
          return { ...state, bounds: action.bounds }
      case SET_SELECTED:
          return { ...state, selected: action.selected }
      default:
          return state;
  }
};

const dataLayerReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_DATA_LAYERS:
            return { ...state, layer: action.data }
        default:
            return state;
    }
};

const placesReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_LOCATION_SEARCH_SUCCESS:
            return {
                ...state,
                places: action.places,
                places_loading: false
            }
        case FETCH_LOCATION_SEARCH_LOADING:
            return {
                ...state,
                places_loading: true
            }
        case FETCH_LOCATION_SEARCH_FAILURE:
            return {
                ...state,
                places_loading: false
            }
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    setReducer,
    dataLayerReducer,
    placesReducer
});

export default rootReducer
