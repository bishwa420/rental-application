import React from 'react'

const PublicLayout = ({children, ...rest}) => {

    return (
        <div className="container">
            {children}
        </div>
    )
}

export default PublicLayout