import React, {Fragment} from 'react';

const SearchArea = ({ isRedoSearch, setRedoSearch }) => (
    <Fragment>
        {
            isRedoSearch ?
                <div className='map-z-index position-absolute map-redoSearch'>
                    <button
                        type="button"
                        className="btn btn-primary h-100  btn-block"
                        onClick={ setRedoSearch }
                    >

                        Search Area
                    </button>
                </div> :
                <Fragment/>
        }
    </Fragment>
);

export default SearchArea;
