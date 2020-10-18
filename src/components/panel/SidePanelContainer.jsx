import React, {Component, Fragment} from 'react';
import styled, {keyframes} from "styled-components";
import ExpandPanelButton from "./ExpandPanelButton";
import LocationSearchInput from "../../map/components/Search";

import { CSSTransition } from 'react-transition-group';

import {bounce} from "react-animations";
import CheckBox from "../../v2/components/checkbox/Checkbox";


class SidePanelContainer extends Component{
    constructor(props){
        super(props)
    }


    render(){
        return(
            <div className="pr-3 pl-3">

                <div className="pb-1 pt-1 border-bottom text-primary">Income</div>

                <div className="col-lg-12 row no-gutters p-0 pt-2 pb-2">
                    <div className="col-lg-6">
                        <div className="col-lg-12 p-0 pb-1">
                            <CheckBox label={ 'American Indian' } onChange={ () => {} } checked={ false }/>
                        </div>

                        <div className="col-lg-12 p-0 pb-1">
                            <CheckBox label={ 'Asian' } onChange={ () => {} } checked={ false }/>
                        </div>


                    </div>
                    <div className="col-lg-6">
                        <div className="col-lg-12 p-0 pb-1">
                            <CheckBox label={ 'American Indian' } onChange={ () => {} } checked={ false }/>
                        </div>

                        <div className="col-lg-12 p-0 pb-1">
                            <CheckBox label={ 'Asian' } onChange={ () => {} } checked={ false }/>
                        </div>


                    </div>
                </div>
            </div>
        )
    }
}

export default SidePanelContainer
