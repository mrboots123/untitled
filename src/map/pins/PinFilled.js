import L from 'leaflet';

const pinFilled = new L.Icon({
    iconUrl: require('./markerFilled.svg'),
    iconRetinaUrl: require('./markerFilled.svg'),
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(30, 30),
    className: 'leaflet-div-icon'
});

export { pinFilled };
