import React, { Component } from 'react'
import CheckBox from "../Checkbox";
import {IoIosAdd, IoIosRemove} from "react-icons/io";

class CheckBoxList extends Component {
    constructor(props){
        super(props)
        this.state = {
            expanded: true,
            selected_items: []
        }
    }

    setExpanded(){
        this.setState({ expanded: !this.state.expanded })
    }

    selectItem(label){
        if(this.props.filters.includes(label)){
            this.props.setFilters(this.props.filters.filter(item => item !== label))
            //this.setState({selected_items: this.props.filters.filter(item => item !== label)})
        }
        else {
            // this.setState({selected_items: [...this.props.filters, label]})
            this.props.setFilters([...this.props.filters, label])
        }
    }

    leftColumnItems(){
        return this.props.items.map( (element, index )=>
            index % 2 === 0 &&
            <div className="pt-2">
                <CheckBox label={element.label} checked={this.props.filters.includes(element.label)} onChange={() => this.selectItem(element.label)}/>
            </div>
        )
    }

    rightColumnItems(){
        return this.props.items.map( (element, index )=>
            index % 2 !== 0 &&
            <div className="pt-2">
                <CheckBox label={element.label} checked={this.props.filters.includes(element.label)} onChange={() => this.selectItem(element.label)}/>
            </div>

        )
    }

    render(){
        return(
            <div className="pr-3 pl-3 pb-3">

                <div className="d-flex pt-1 border-bottom text-primary" onClick={() => this.setExpanded()}>
                    <div className="w-100">
                        <h5>{this.props.header}</h5>
                    </div>
                    <div className="pr-2 flex-grow-1">
                        {
                            this.state.expanded ?
                                <IoIosRemove size={20} color="blue" onClick={() => console.log('hello world')}/> :
                                <IoIosAdd size={20} color="blue" onClick={() => console.log('hello world')}/>

                        }
                    </div>





                </div>

                {
                    this.state.expanded &&
                    <div className="col-lg-12 row no-gutters p-0 pt-1 pb-2">
                        <div className="col-lg-6 pl-3">
                            {
                                this.leftColumnItems()
                            }
                        </div>
                        <div className="col-lg-6 pl-3">
                            {
                                this.rightColumnItems()
                            }
                        </div>
                    </div>
                }


            </div>
        )
    }
}

export default CheckBoxList
