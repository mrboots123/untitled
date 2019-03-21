import * as turf from '@turf/turf'

export const createPolygonFromBounds = (latLngBounds) => {
    let latlngs = [];

    latlngs.push([latLngBounds.getNorthWest().lat,latLngBounds.getNorthWest().lng]); //top left
    latlngs.push([latLngBounds.getNorthEast().lat,latLngBounds.getNorthEast().lng]); //top right
    latlngs.push([latLngBounds.getSouthEast().lat,latLngBounds.getSouthEast().lng]); //bottom right
    latlngs.push([latLngBounds.getSouthWest().lat,latLngBounds.getSouthWest().lng]); //bottom left

    latlngs.push([latLngBounds.getNorthWest().lat,latLngBounds.getNorthWest().lng]); //top left

    return latlngs;
}


const test = (feature, bbox) => {
            feature.geometry.coordinates.forEach(ele => {
                const poly = turf.polygon(ele)
                if(turf.booleanWithin(poly, bbox)){
                    return true;
                }

            })
    return false;
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
