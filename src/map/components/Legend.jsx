import React, {Component, Fragment} from 'react';


class Legend extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <Fragment>
                <div className='map-legend map-z-index rounded position-absolute bg-white'>
                    <div className="text-center pt-1 pb-1">Communities Legend</div>
                    <div>Best</div>
                    <div>Good</div>
                    <div>Average</div>
                    <div>Poor</div>
                    <div>Very Poor</div>
                </div>
            </Fragment>
        );
    }

}

export default Legend
