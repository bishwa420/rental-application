import React, {Component} from "react"
import ApartmentUI from "./ApartmentUI"


class Apartment extends Component {

    constructor(props) {
        super(props)
        this.state = {
            apartments: [],
            loading: true,
            filter: {
                filterLatitude: '',
                filterLongitude: '',
                pageSize: 10,
                requestingPage: 1
            }
        }
    }

    render() {
        return (
            <ApartmentUI/>
        )
    }
}

export default Apartment