import React, {Component} from "react"
import {Map, GoogleApiWrapper} from "google-maps-react"


export class MapContainer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            latitude: props.data.latitude,
            longitude: props.data.longitude
        }
    }

    render() {

        return (
            <Map
                google={this.props.google}
                zoom={14}
                initialCenter={{
                    lat: this.state.latitude,
                    lng: this.state.longitude
                }}
            />
        )
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCj8qOOGWjVt7RaW2DsN_53ebgBjBgJoiY'
})(MapContainer)