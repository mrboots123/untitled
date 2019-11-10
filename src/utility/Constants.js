
export const BLOCK = 'BLOCK';
export const CITY = 'CITY';
export const COUNTY = 'COUNTY';
export const STATE = 'STATE';


export const LAYER_COLORS = [
    '#d73027',
    '#fc8d59',
    '#fee090',
    '#e0f3f8',
    '#91bfdb',
    '#4575b4'
]

export const setColor = (salary) => {


    let color = '#fff'

    if(salary > 90000)
        color = '#4575b4';
    else if(salary < 90000 && salary > 75000)
        color = '#91bfdb'
    else if (salary < 75000 && salary > 60000)
        color ='#e0f3f8'
    else if( salary < 60000 && salary > 50000)
        color = '#fee090'
    else if(salary < 50000 && salary > 35000)
        color = '#fc8d59'
    else if (salary < 35000)
        color = '#d73027'

    return color;
}

export const DEFAULT_COLOR = [
    '#fff'
]
