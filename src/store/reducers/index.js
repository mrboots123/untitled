import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import mockFilters from '../_mock_data/FiltersList'
import { fromJS } from "immutable";
import {
    FETCH_DATA_LAYERS,
    FETCH_DATA_LAYERS_TEST,
    FETCH_FILTERS_FAILURE,
    FETCH_FILTERS_LOADING,
    FETCH_FILTERS_SUCCESS,
    FETCH_LOCATION_SEARCH_FAILURE,
    FETCH_LOCATION_SEARCH_LOADING,
    FETCH_LOCATION_SEARCH_SUCCESS, FETCH_TILES_FAILURE,
    FETCH_TILES_LOADING,
    FETCH_TILES_SUCCESS,
    SET_BOUNDS,
    SET_FILTERS,
    SET_SELECTED,
    SET_VIEWPORT
} from "../ActionTypes";
import {moveMeToServer} from "../../utility/Utilities";

const initialState = {
    viewport: {
        center: [40.7128, -74.0060],
        zoom: 11
    },
    userLocation: {},
    bounds: [[],[]],
    filters: [],
    selected: -1,
    search: '',
    filtersList: [],
    test: []
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
        case FETCH_DATA_LAYERS_TEST:
            return { ...state, test: action.test }
        case FETCH_TILES_LOADING:
            return { ...state, tile_loading: true}
        case FETCH_TILES_SUCCESS:
            return { ...state, tile_loading: false, tiles: action.tiles }
        case FETCH_TILES_FAILURE:
            return { ...state, tile_loading: false, tiles: action.tiles}
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

const filtersReducer = (state= initialState, action) => {
    switch (action.type) {
        case FETCH_FILTERS_SUCCESS:
            return {
                ...state,
                filtersList: action.filters,
                filtersListLoading: false
            }
        case FETCH_FILTERS_LOADING:
            return {
                ...state,
                filtersListLoading: true
            }
        case FETCH_FILTERS_FAILURE:
            return {
                ...state,
                filtersList: mockFilters,
                filtersListLoading: true
            }
        default:
            return state;
    }
};


const rootReducer = (history) => combineReducers({
    setReducer,
    dataLayerReducer,
    placesReducer,
    filtersReducer,
    router: connectRouter(history)
});

export default rootReducer
