import React from 'react';
import { useQuery, gql } from '@apollo/client';

const lol = gql`
    query {
  cities(northWest: [33.41288727916097,-112.25675221312537], southEast: [33.44555122515294,-112.16414090025916]){
      name
  }
}
`
const Test = ({}) => {
    const { loading, error, data } = useQuery(lol);

    console.log(data);
    return <div>
        lol
    </div>
}

export default Test;
