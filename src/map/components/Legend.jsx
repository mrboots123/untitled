import React, {Component, Fragment} from 'react';
import styled from "styled-components";
import {IoIosArrowDown, IoIosArrowUp} from "react-icons/io";


const LegendIcon = styled.div`
  margin-left: 10px
  margin-right: 10px
  height: 10px;
  width: 10px;
  background-color: ${props => props.color ? props.color :'#bbb' }
  border-radius: 50%;
  display: inline-block;
`
class Legend extends Component {
    constructor(props){
        super(props)
        this.state = {
            expanded: true
        }
        this.setExpanded = this.setExpanded.bind(this);
    }


    setExpanded() {
        this.setState({ expanded: !this.state.expanded})
    }

    render(){
        return(
            <Fragment>
                <div className='map-legend map-z-index rounded position-absolute bg-white'>
                    <div className="d-flex pt-1 border-bottom text-primary" onClick={() => this.setExpanded()}>
                        <div className="w-100">
                            <div className="text-center">Legend</div>
                        </div>
                        <div className="pr-2 flex-grow-1">
                            {
                                this.state.expanded ?
                                    <IoIosArrowUp size={20} color="blue" /> :
                                    <IoIosArrowDown size={20} color="blue"/>

                            }
                        </div>
                    </div>
                    <Fragment>
                        {
                            this.state.expanded &&
                            <div className="pt-1 pb-1">
                                <div className="d-flex">
                                    <LegendIcon color={'#4575b4'}/>
                                    <div>Best</div>
                                </div>
                                <div className="d-flex">
                                    <LegendIcon color={'#91bfdb'}/>
                                    <div>Very Good</div>
                                </div>

                                <div className="d-flex">
                                    <LegendIcon color={'#e0f3f8'}/>
                                    <div>Good</div>
                                </div>
                                <div className="d-flex">
                                    <LegendIcon color={'#fee090'}/>
                                    <div>Average</div>
                                </div>
                                <div className="d-flex">
                                    <LegendIcon color={'#fc8d59'}/>
                                    <div>Fair</div>
                                </div>
                                <div className="d-flex">
                                    <LegendIcon color={'#d73027'}/>
                                    <div>Poor</div>
                                </div>
                            </div>
                        }
                    </Fragment>
                </div>
            </Fragment>
        );
    }

}

export default Legend
