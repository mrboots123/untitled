import React from 'react'
import {BarLoader, BeatLoader, BounceLoader, FadeLoader, MoonLoader} from "react-spinners";
import { css } from '@emotion/core';

const override = css`
    width: 100% !important;
`;


const Loading = () => (
    <div className='map-z-index position-relative '>
        <BarLoader
            css={override}
            color='#007bff'
            loading={true}

        />
    </div>
);

export default Loading;
