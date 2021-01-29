import React, {Component} from "react"
import {Map, GoogleApiWrapper, InfoWindow, Marker} from "google-maps-react"
import {ApartmentContext} from "./ApartmentContext"



export class MapContainer extends Component {


    constructor(props) {
        super(props)
        this.state = {
            showInfoWindow: true,
            activeMarker: {},
            selectedPlace: {}
        }

    }

    onMarkerClick = (props, marker, e) => {

        console.log('onMarkerClick, props: ', JSON.stringify(props), ' marker: ', marker)
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showInfoWindow: true
        })
    }

    onClose = props => {
        if(this.state.showInfoWindow) {
            this.setState({
                showInfoWindow: false,
                activeMarker: null
            })
        }
    }

    render() {

        let loadedApartmentInfo = this.context

        return (
            <Map
                google={this.props.google}
                zoom={14}
                initialCenter={{
                    lat: loadedApartmentInfo.latitude,
                    lng: loadedApartmentInfo.longitude
                }}
                center={{
                    lat: loadedApartmentInfo.latitude,
                    lng: loadedApartmentInfo.longitude
                }}>
                <Marker
                    onClick={this.onMarkerClick}
                    name={"Name"}
                    position={{
                        lat: loadedApartmentInfo.latitude,
                        lng: loadedApartmentInfo.longitude
                    }}/>
                <InfoWindow
                    onClose={this.onClose()}
                    visible={this.state.showInfoWindow}
                    marker={this.state.activeMarker}>
                    <div>
                        <h4>{loadedApartmentInfo.name}</h4>
                    </div>
                </InfoWindow>
            </Map>
        )
    }
}

MapContainer.contextType = ApartmentContext


export default GoogleApiWrapper({
    apiKey: 'AIzaSyCnGjcCqsXT7bvxYpVRjUHhse3HtfERFVU'
})(MapContainer)