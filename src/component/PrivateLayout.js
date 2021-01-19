import React from 'react'


const PrivateLayout = ({children, ...rest}) => {

    return (
        <div className="wrapper">

            <div id="content">
                {children}
            </div>
        </div>
    )
}

export default PrivateLayout