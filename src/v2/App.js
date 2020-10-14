import React, { Component } from 'react';
import {ApolloProvider} from "@apollo/client";
import client from './apollo/index';
import InjusticeMap from "./map/InjusticeMap";

class App extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        return <ApolloProvider client={client}>
            <InjusticeMap/>
        </ApolloProvider>
    }
}
export default App;
