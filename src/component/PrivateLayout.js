import React from 'react'
import Sidebar from "./Sidebar"


const PrivateLayout = ({children, ...rest}) => {

    return (
        <div className="wrapper">

            <Sidebar/>
            <div id="content">
                {children}
            </div>
        </div>
    )
}

export default PrivateLayout