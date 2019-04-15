import * as turf from '@turf/turf'
import blocks from '../Blocks'

export const createPolygonFromBounds = (latLngBounds) => {
    let latlngs = [];

    latlngs.push([latLngBounds.getNorthWest().lat,latLngBounds.getNorthWest().lng]); //top left
    latlngs.push([latLngBounds.getNorthEast().lat,latLngBounds.getNorthEast().lng]); //top right
    latlngs.push([latLngBounds.getSouthEast().lat,latLngBounds.getSouthEast().lng]); //bottom right
    latlngs.push([latLngBounds.getSouthWest().lat,latLngBounds.getSouthWest().lng]); //bottom left

    latlngs.push([latLngBounds.getNorthWest().lat,latLngBounds.getNorthWest().lng]); //top left

    return latlngs;
}



export const moveMeToServer = (bounds) => {
    const bbox = turf.polygon([createPolygonFromBounds(bounds)]);
    let featureCollection = {
        type: "FeatureCollection"
    }
    let list = []
    turf.flip(blocks).features.map(feature => {
        if(feature.geometry.type === 'Polygon'){
            if(!turf.booleanDisjoint(feature, bbox)){
                list.push(feature)
            }
        }
    })
    featureCollection.features = list

    return featureCollection
}

export const isNestedPolygon = (features, bbox) => {
  // console.log(features)
  features.forEach(feature => {
      const { type } = feature.geometry
      if(type === 'Polygon'){
          if( turf.booleanWithin(feature, bbox)){
             console.log('this is itttt')
          }
          else{
              console.log('we are freee')
          }
      }
      else {
         // return test(feature, bbox);
      }
  });

    return true;
}


export const reverseGeoCoding = (lat, lng) => {

}
