import React, {Component} from "react"
import ApartmentUI from "./ApartmentUI"
import Http from "../../service/Http"
import NotificationManager from "react-notifications/lib/NotificationManager";


class Apartment extends Component {

    constructor(props) {
        super(props)
        this.state = {
            apartments: [],
            loading: true,
            filter: {
                filterMinArea: 0,
                filterMaxArea: 10000000,
                filterMinPrice: 0,
                filterMaxPrice: 1000000000,
                filterMinRooms: 0,
                filterMaxRooms: 10000000,
                pageSize: 10,
                requestingPage: 1
            },
            pages: 0,
            loadedApartmentName: '',
            loadedApartmentLatitude: '',
            loadedApartmentLongitude: '',
            showLocationModal: false
        }
        this.filterApartments = this.filterApartments.bind(this)
        this.getApartments = this.getApartments.bind(this)
        this.launchMap = this.launchMap.bind(this)
        this.closeLocationModal = this.closeLocationModal.bind(this)
    }

    componentDidMount() {
        this.getApartments()
    }

    closeLocationModal() {
        this.setState({
            showLocationModal: false
        })
    }

    filterApartments() {

        let param = {
            minArea: this.state.filter.filterMinArea,
            maxArea: this.state.filter.filterMaxArea,
            minPrice: this.state.filter.filterMinPrice,
            maxPrice: this.state.filter.filterMaxPrice,
            minRooms: this.state.filter.filterMinRooms,
            maxRooms: this.state.filter.filterMaxRooms,
            page: this.state.filter.requestingPage,
            limit: this.state.filter.pageSize
        }

        this.getApartments(param)
    }

    getApartments(params) {

        this.setState({
            loading: true
        })

        console.log('calling get_apartments with params: ', params)

        Http.GET('get_apartments', params)
            .then((response) => {

                NotificationManager.success('Apartment fetched successfully')
                this.setState({
                    loading: false,
                    apartments: response.data.apartmentList,
                    filter: {
                        ...this.state.filter,
                        requestingPage: response.data.page.number,
                    },
                    pages: response.data.page.totalPages
                })
            })
            .catch(error => {

                if(error.response && error.response.data) {
                    NotificationManager.error(error.response.data.message)
                } else {
                    NotificationManager.error('Could not connect to server')
                }
                this.setState({
                    loading: false
                })
            })
    }

    launchMap(rowInfo) {

        console.log('rowInfo: ', JSON.stringify(rowInfo, null, 2))

        this.setState({
            loadedApartmentLatitude: rowInfo.original.latitude,
            loadedApartmentLongitude: rowInfo.original.longitude,
            showLocationModal: true
        })
    }

    render() {
        return (
            <ApartmentUI
                data = {this.state}
                filterApartments = {this.filterApartments}
                launchMap = {this.launchMap}
                closeLocationModal = {this.closeLocationModal}
            />
        )
    }
}

export default Apartment