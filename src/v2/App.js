import React, {Component, useContext} from 'react';
import {ApolloProvider} from "@apollo/client";
import client from './apollo/index';
import InjusticeMap from "./map/InjusticeMap";
import {store} from "./context/store";

const App = () => {

    return <ApolloProvider client={client}>
        <div className="container-fluid p-0 vh-100 ">
            <div className="row no-gutters p-0 h-100 ">
                <InjusticeMap
                />
            </div>
        </div>
    </ApolloProvider>;
}

export default App;
