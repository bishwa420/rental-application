// https://www.pngkey.com/detail/u2q8o0w7w7y3a9y3_404-error-404-not-found-png/
// The image is free as can be seen in the aforementioned location

import React, {Component} from "react"
import not_found from '../image/not-found.png'

class NotFound extends Component {

    render() {

        return (
            <div className="container">
                <div className="col-md-12" style={{textAlign: 'center'}}>
                    <h1 className="text-center">Page Not Found</h1>
                    <img src={not_found} style={{marginTop: '10em'}} alt = "404 not found"/>
                </div>
            </div>
        )
    }
}

export default NotFound
