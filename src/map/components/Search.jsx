import React, { Component } from 'react'
import Downshift from "downshift";
import {Manager, Popper, Reference} from "react-popper";
import indexOf from "lodash/indexOf";
import isEmpty from 'lodash/isEmpty'
class Search extends Component {
    constructor(props){
        super(props)
        this.state = {
            value: '',
            items : [
                'apple',
                'orange',
                'banana',
                'carrot'
            ]


        }
        this.stateReducer = this.stateReducer.bind(this);
    }

    // lul = (changes) => {
    //
    //     if (changes.hasOwnProperty('inputValue')) {
    //         this.setState({value: changes.inputValue})
    //     }
    // }

    stateReducer(state, changes) {
        switch (changes.type) {
            case Downshift.stateChangeTypes.changeInput:
                const valid = changes.inputValue.length >= 3
                if(valid){
                    //TODO: here we will call the dispatch to nomatim
                    this.props.fetchPlaces(changes.inputValue);
                }
                return {
                    ...changes,
                    isOpen: valid,
                }

            case Downshift.stateChangeTypes.keyDownEnter:
            case Downshift.stateChangeTypes.clickItem:
                if(state.isOpen){
                    // TODO: dispatch(convertAddressToCoordinates(item))
                    this.props.setViewport({
                        center: []
                    })
                }
                const selected = this.props.places.find(item => item.display_name === changes.selectedItem.display_name)
                this.props.setViewport({
                    center: [selected.lat, selected.lon],
                    zoom: 14
                })
                return {
                    ...changes,
                    selectedItem: this.props.places.find(item => item.display_name === changes.selectedItem.display_name).display_name
                    // selectedItem: this.props.places[!changes.selectedItem ? 0 : indexOf(this.state.items,changes.selectedItem)].value
                }
            default:
                return changes
        }
    }

    render(){
        return(
            <Manager>

                <Downshift
                    selectedItem={this.state.value}
                    // onStateChange={this.lul}
                    stateReducer={this.stateReducer}
                    itemToString={item => (item ? item.display_name : '')}
                >
                    {({
                          getLabelProps,
                          getInputProps,
                          getToggleButtonProps,
                          getMenuProps,
                          getItemProps,
                          isOpen,
                          clearSelection,
                          selectedItem,
                          inputValue,
                          highlightedIndex,
                          setState
                      }) => (
                        <div className="p-2">
                            <Reference>
                                {({ ref }) => (
                                    <input
                                        type="search"
                                        ref={ref}
                                        {...getInputProps({
                                            placeholder: 'Search Places',
                                            onFocus: () => {
                                                if(inputValue.length >= 3 ){
                                                    setState({ isOpen: true})
                                                }
                                            },
                                            onKeyDown: event => {

                                                if(event.key === 'Enter' && inputValue.length >= 3 && highlightedIndex === null){
                                                    console.log('hit entered')
                                                    setState({ isOpen: false})
                                                }

                                            },
                                        })}
                                    />
                                )}
                            </Reference>

                            {

                                isOpen && this.props.places &&
                                <Popper placement="bottom">
                                    {({ ref, style, placement, arrowProps }) => (

                                        !isEmpty(this.props.places) &&
                                        <div ref={ref} style={style} data-placement={placement} className="map-z-index fix p-inherit ">
                                            <div className="border">
                                                {
                                                    this.props.places
                                                        .slice(0,5)
                                                        .map((item, index) => (
                                                            <div
                                                                {...getItemProps({
                                                                    key: item.place_id,
                                                                    index,
                                                                    item,
                                                                    style: {
                                                                        backgroundColor:
                                                                            highlightedIndex === index ? '#f5f6f6' : 'white',
                                                                        fontWeight: selectedItem === item ? 'bold' : 'normal',
                                                                        paddingRight: "10px",
                                                                        paddingLeft: "10px",
                                                                        paddingTop: "10px",
                                                                        paddingBottom: "10px",
                                                                        borderBottom: "1px solid #ecedee"
                                                                    },
                                                                })}
                                                            >
                                                                {item.display_name}
                                                            </div>
                                                        ))
                                                }

                                            </div>
                                            <div ref={arrowProps.ref} style={arrowProps.style} />

                                        </div>
                                    )}
                                </Popper>
                            }


                        </div>
                    )}
                </Downshift>
            </Manager>
        );
    }
}

export default Search;
