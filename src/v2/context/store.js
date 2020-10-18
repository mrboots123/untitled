import React, {createContext, useReducer} from 'react';

const initialState = {
    geographies: [],
    crimes: [],
    selectedGeography: '',
    selectedCrime: -1,
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ( { children } ) => {
    const [state, dispatch] = useReducer((state, action) => {
        switch(action.type) {
            case 'SET_GEOGRAPHICAL_DATA':
                return {... state, geographies: action.geographicalData};
            case 'SET_CRIME_DATA':
                return {... state, crimes: action.crimeData};
            case 'SET_SELECTED_GEOGRAPHY':
                return {... state, selectedGeography: action.index};
            case 'SET_SELECTED_CRIME':
                return {... state, selectedCrime: action.index};
            default:
                throw new Error();
        };
    }, initialState);

    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider }
