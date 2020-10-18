import React, { Fragment } from 'react'
import {BarLoader, BeatLoader, BounceLoader, FadeLoader, MoonLoader} from "react-spinners";
import css from '@emotion/css';



const Loading = ({ isLoading }) => (
    <Fragment>
        {
            isLoading &&
            <div className='map-z-index position-relative '>
                <BarLoader
                    css={` width: 100% !important;`}
                    color='#007bff'
                    loading={true}

                />
            </div>
        }

    </Fragment>
);

export default Loading;
