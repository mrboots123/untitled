import L from 'leaflet';

const markerPin = new L.Icon({
    iconUrl: require('../../../../../assets/markerFilled.svg'),
    iconRetinaUrl: require('../../../../../assets/markerFilled.svg'),
    popupAnchor:  [0, -10],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(30, 30),

});

export default markerPin;

