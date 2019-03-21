import React from 'react'
import ReactTooltip from "react-tooltip";
import {IoMdArrowDropleft, IoMdArrowDropright} from "react-icons/io";
import styled from "styled-components";

const SlidePanel = styled.div`
    height: 32px;
    width: 18px;
    position: absolute;
    left: ${props => props.expanded ? '25%': '0px'};
    top: 50%;
    z-index: 10001;
    background: white;
`

const ExpandPanelButton =({expanded, onExpandClick}) => (
    <SlidePanel expanded={expanded}>
        <div className="align-items-center d-flex justify-content-center h-100 border">
            <ReactTooltip
                place="right" type="dark"
                effect="solid"
                delayShow={1500}
                id='panel'
                globalEventOff='click'
            />

            <div data-tip="Expand Panel" data-for='panel' onClick={() => onExpandClick()}>

                {
                    expanded ?
                        <IoMdArrowDropleft/>:
                        <IoMdArrowDropright></IoMdArrowDropright>
                }
            </div>
        </div>

    </SlidePanel>
)

export default ExpandPanelButton
