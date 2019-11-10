import L from 'leaflet';

const pinUnfilled = new L.Icon({
    iconUrl: require('./markerUnfilled.svg'),
    iconRetinaUrl: require('./markerUnfilled.svg'),
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(30, 30),
    className: 'leaflet-div-icon'
});

export { pinUnfilled };
