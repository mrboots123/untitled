import L from 'leaflet';

const locationPin = new L.Icon({
    iconUrl: require('../../../../../assets/location_pin.svg'),
    iconRetinaUrl: require('../../../../../assets/location_pin.svg'),
    iconAnchor: null,
    popupAnchor: [-3, -76],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(10, 10),
});

export default locationPin;
