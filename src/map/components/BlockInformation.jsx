import React, { Component } from 'react'
import {IoIosClose} from "react-icons/io";
import update from 'immutability-helper';
import ReactHighcharts from "react-highcharts";
import CircleLegend from "../../components/panel/CircleLegend";
import numeral from 'numeraljs'

class BlockInformation extends Component{
    constructor(props){
        super(props)
        this.state = {
            salary: 0,
            age: 0,
            races: {
                white: 0,
                black: 0,
                indian: 0,
                asian: 0,
                islander: 0,
                hispanic: 0
            },
            occupations: [],
            mortgage: 0
        }
    }


    componentDidUpdate(prevProps, prevState) {
        // only update chart if the data has changed
        if (prevProps.layer !== this.props.layer) {
            let str = this.props.layer.properties.AFFGEOID
            let geoid = str.substring(0,4) + str.substring(6, str.length)
            fetch(`https://api.censusreporter.org/1.0/data/show/latest?table_ids=B25077&geo_ids=${geoid}`)
                .then(response => response.json())
                .then(json => {

                    this.setState({ mortgage: json.data[geoid]['B25077'].estimate['B25077001']})
                });



            fetch(`https://api.censusreporter.org/1.0/data/show/latest?table_ids=B03002&geo_ids=${geoid}`)
                .then(response => response.json())
                .then(json => {

                    /*
    B03002001: 4060
    B03002002: 1660
    B03002003: 703
    B03002004: 769
    B03002005: 133
    B03002006: 0
    B03002007: 0
    B03002008: 0
    B03002009: 55
    B03002010: 15
    B03002011: 40
    B03002012: 2400
    B03002013: 1901
    B03002014: 75
    B03002015: 0
    B03002016: 0
    B03002017: 0
    B03002018: 384
    B03002019: 40
    B03002020: 40
    B03002021: 0
                     */
                    const { 'B03002003': white,
                        'B03002004': black,
                        'B03002005': indian,
                        'B03002006': asian,
                        'B03002007': hawaiian,
                        'B03002008': other,
                        'B03002009': twoPlusRaces,
                        'B03002010': twoPlusRacesOther,
                        'B03002012': hispanic,

                    } = json.data[geoid]['B03002'].estimate

                    this.setState({
                        races: {
                            white,
                            black,
                            indian,
                            asian,
                            islander: hawaiian,
                            hispanic
                        }
                    })

                });


            fetch(`https://api.censusreporter.org/1.0/data/show/latest?table_ids=B19013&geo_ids=${geoid}`)
                .then(response => response.json())
                .then(json => {
                    this.setState({ salary: json.data[geoid]['B19013'].estimate['B19013001']})
                });


            fetch(`https://api.censusreporter.org/1.0/data/show/latest?table_ids=B01002&geo_ids=${geoid}`)
                .then(response => response.json())
                .then(json => {
                    this.setState({age: json.data[geoid]['B01002'].estimate['B01002001']})

                });


            fetch(`https://api.censusreporter.org/1.0/data/show/latest?table_ids=B24124&geo_ids=${geoid}`)
                .then(response => response.json())
                .then(json => {
                    console.log(json)
                    //this.setState({age: json.data[geoid]['B01002'].estimate['B01002001']})

                });

            //B24050
        }
    }

    componentDidMount(){

    }

    // componentDidMount(){
    //
    //
    //    occupations:
        //
    //
    //     /* TODO: set if its a family area or not
    //     B99121	ALLOCATION OF MARITAL STATUS FOR THE POPULATION 15 YEARS AND OVER	selected variables
    //     B99122	ALLOCATION OF DIVORCED IN THE PAST 12 MONTHS FOR THE POPULATION 15 YEARS AND OVER	selected variables
    //     B99123	ALLOCATION OF MARRIED IN THE PAST 12 MONTHS FOR THE POPULATION 15 YEARS AND OVER	selected variables
    //     B99124	ALLOCATION OF WIDOWED IN THE PAST 12 MONTHS FOR THE POPULATION 15 YEARS AND OVER
    //      */
    //
    //
    //     // the fetch call to races
    //     //B03002_001E total population
    //     //B03002_012E hispanic
    //     //B03002_003E	Estimate!!Total!!Not Hispanic or Latino!!White alone
    //     //B03002_004E	Estimate!!Total!!Not Hispanic or Latino!!Black or African American alone
    //     //B03002_005E	Estimate!!Total!!Not Hispanic or Latino!!American Indian and Alaska Native alone
    //     //B03002_006E	Estimate!!Total!!Not Hispanic or Latino!!Asian alone
    //     //B03002_007E	Estimate!!Total!!Not Hispanic or Latino!!Native Hawaiian and Other Pacific Islander alone
    //
    //
    //
    //     //B25082_001E
    //
    //     fetch(`https://api.census.gov/data/2017/acs/acs5?get=B25077_001E,NAME&for=block%20group:${this.props.layer.properties.BLKGRPCE}&in=state:${this.props.layer.properties.STATEFP}%20county:${this.props.layer.properties.COUNTYFP}%20tract:${this.props.layer.properties.TRACTCE}`)
    //         .then(response => response.json())
    //         .then(json => {
    //             console.log('MORTGAGE AVERAGE:')
    //             console.log(json)
    //
    //             this.setState(
    //                 {mortgage:  json[1][0] }
    //             )
    //         });
    //
    //
    //     fetch(`https://api.census.gov/data/2017/acs/acs5?get=B03002_003E,NAME&for=block%20group:${this.props.layer.properties.BLKGRPCE}&in=state:${this.props.layer.properties.STATEFP}%20county:${this.props.layer.properties.COUNTYFP}%20tract:${this.props.layer.properties.TRACTCE}`)
    //         .then(response => response.json())
    //         .then(json => {
    //             console.log('white:')
    //             console.log(json[1][0])
    //
    //             let newState = update(this.state, {
    //                 races: {
    //                     white: { $set: parseInt(json[1][0]) }
    //                 }
    //             });
    //             this.setState(
    //                 newState
    //             )
    //         });
    //
    //     fetch(`https://api.census.gov/data/2017/acs/acs5?get=B03002_001E,NAME&for=block%20group:${this.props.layer.properties.BLKGRPCE}&in=state:${this.props.layer.properties.STATEFP}%20county:${this.props.layer.properties.COUNTYFP}%20tract:${this.props.layer.properties.TRACTCE}`)
    //         .then(response => response.json())
    //         .then(json => {
    //             console.log('total:')
    //             console.log(json)
    //             let newState = update(this.state, {
    //                 races: {
    //                     total: { $set: parseInt(json[1][0]) }
    //                 }
    //             });
    //             this.setState(
    //                 newState
    //             )
    //         });
    //
    //     fetch(`https://api.census.gov/data/2017/acs/acs5?get=B02001_003E,NAME&for=block%20group:${this.props.layer.properties.BLKGRPCE}&in=state:${this.props.layer.properties.STATEFP}%20county:${this.props.layer.properties.COUNTYFP}%20tract:${this.props.layer.properties.TRACTCE}`)
    //         .then(response => response.json())
    //         .then(json => {
    //             console.log('black:')
    //             console.log(json)
    //             let newState = update(this.state, {
    //                 races: {
    //                     black: { $set: parseInt(json[1][0])}
    //                 }
    //             });
    //             this.setState(
    //                 newState
    //             )
    //         });
    //     //
    //     fetch(`https://api.census.gov/data/2017/acs/acs5?get=B03002_006E,NAME&for=block%20group:${this.props.layer.properties.BLKGRPCE}&in=state:${this.props.layer.properties.STATEFP}%20county:${this.props.layer.properties.COUNTYFP}%20tract:${this.props.layer.properties.TRACTCE}`)
    //         .then(response => response.json())
    //         .then(json => {
    //             console.log('asian:')
    //             console.log(json)
    //             let newState = update(this.state, {
    //                 races: {
    //                     asian: { $set: parseInt(json[1][0]) }
    //                 }
    //             });
    //             this.setState(
    //                 newState
    //             )
    //         });
    //
    //     fetch(`https://api.census.gov/data/2017/acs/acs5?get=B03002_012E,NAME&for=block%20group:${this.props.layer.properties.BLKGRPCE}&in=state:${this.props.layer.properties.STATEFP}%20county:${this.props.layer.properties.COUNTYFP}%20tract:${this.props.layer.properties.TRACTCE}`)
    //         .then(response => response.json())
    //         .then(json => {
    //             console.log('hispanic:')
    //             console.log(json)
    //             let newState = update(this.state, {
    //                 races: {
    //                     hispanic: { $set: parseInt(json[1][0]) }
    //                 }
    //             });
    //             this.setState(
    //                 newState
    //             )
    //         });
    //
    //     fetch(`https://api.census.gov/data/2017/acs/acs5?get=B19013_001E,NAME&for=block%20group:${this.props.layer.properties.BLKGRPCE}&in=state:${this.props.layer.properties.STATEFP}%20county:${this.props.layer.properties.COUNTYFP}%20tract:${this.props.layer.properties.TRACTCE}`)
    //         .then(response => response.json())
    //         .then(json => {
    //             this.setState(
    //                 {salary: json[1][0]}
    //             )
    //         });
    //
    //     fetch(`https://api.census.gov/data/2017/acs/acs5?get=B01002_001E,NAME&for=block%20group:${this.props.layer.properties.BLKGRPCE}&in=state:${this.props.layer.properties.STATEFP}%20county:${this.props.layer.properties.COUNTYFP}%20tract:${this.props.layer.properties.TRACTCE}`)
    //         .then(response => response.json())
    //         .then(json => {
    //             this.setState(
    //                 {age: json[1][0]}
    //             )
    //         });
    // }

    render(){

        let chartOptions = {
            chart: {
                renderTo: 'container',
                type: 'pie',
                height: 300,

            },
            // colors: ['blue', 'orange', 'yellow', 'gray', '#1aadce',
            //     '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
            title: {
                text: 'Race'
            },
            yAxis: {
                title: {
                    text: 'Total percent market share'
                }
            },



            plotOptions: {
                pie: {
                    shadow: false,
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                },
                series: {
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                },
            },
            tooltip: {

                enabled: true
            },
            series: [{
                name: 'Races',
                data: [["Asian",this.state.races.asian],["Black",this.state.races.black],["Hispanic",this.state.races.hispanic],["White",this.state.races.white]],
                size: '100%',
                innerSize: '75%',
                showInLegend:true,
                dataLabels: {
                    enabled: false
                }
            }]
        };

        return(
            <div className="col-sm-3">
                <div className="d-flex justify-content-end p-1 pb-0 bg-primary text-white">
                    <div className="mr-auto pl-3 ">Block 42124</div>
                    <IoIosClose size={30} onClick={() => this.props.setSelected(-1)}></IoIosClose>
                </div>
                <div className="col-lg-12 text-center border-bottom p-0 no-gutters ">
                    <h5 className="font-weight-normal text-primary">Home value</h5>
                    <h5 className={`${this.state.mortgage > 300000 ? 'text-success' : `${this.state.mortgage < 300000 && this.state.mortgage > 180000 ? 'text-warning': 'text-danger' }`}`}>
                        {numeral(this.state.mortgage).format('$0,0')}
                    </h5>
                </div>
                <div className="col-lg-12 row border-bottom p-0 no-gutters">

                    <div className="col-lg-6 text-center border-right pt-2 pb-2">
                        <h5 className="font-weight-normal text-primary">Salary</h5>
                        <h5 className={`${this.state.salary > 122000 ? 'text-success': `${this.state.salary < 122000 && this.state.salary > 40500 ? 'text-warning': 'text-danger'} `}`}> {numeral(this.state.salary).format('$0,0')}</h5>
                    </div>
                    <div className="col-lg-6 text-center pt-2 pb-2">
                        <h5 className="font-weight-normal text-primary">Age</h5>
                        <h5 className=""> {this.state.age}</h5>
                    </div>
                </div>

                <div className="col-lg-12">
                    <ReactHighcharts config={chartOptions} isPureConfig={true}> </ReactHighcharts>
                </div>
                <div className="col-lg-12">

                </div>
                <div className="col-lg-12"></div>
                <div className="col-lg-12"></div>
            </div>
        );
    }
}

export default BlockInformation;
