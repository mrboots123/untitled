import L from 'leaflet';

const pinFilled = new L.Icon({
    iconUrl: require('../../assets/markerFilled.svg'),
    iconRetinaUrl: require('../../assets/markerFilled.svg'),
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(50, 50),
});

export { pinFilled };
