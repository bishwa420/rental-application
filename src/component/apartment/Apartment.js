import React, {Component, createContext} from "react"
import ApartmentUI from "./ApartmentUI"
import Http from "../../service/Http"
import {apartmentInfo, ApartmentContext} from "./ApartmentContext"
import {notifyFailure, notifySuccess} from "../../service/Util";


class Apartment extends Component {

    constructor(props) {
        super(props)
        this.state = {
            apartments: [],
            loading: true,
            filter: {
                filterMinArea: 0,
                filterMaxArea: 10000000,
                filterMinPrice: 100,
                filterMaxPrice: 2000,
                filterMinRooms: 0,
                filterMaxRooms: 10000000,
                pageSize: 10,
                requestingPage: 1
            },
            pages: 0,
            loadedApartmentInfo: apartmentInfo,
            showLocationModal: false
        }
        this.filterApartments = this.filterApartments.bind(this)
        this.getApartments = this.getApartments.bind(this)
        this.launchMap = this.launchMap.bind(this)
        this.closeLocationModal = this.closeLocationModal.bind(this)
        this.handlePriceFilteringChange = this.handlePriceFilteringChange.bind(this)
        this.resetFilter = this.resetFilter.bind(this)
    }

    componentDidMount() {
        this.getApartments()
    }

    resetFilter() {

        this.setState({
            filter: {
                filterMinArea: 0,
                filterMaxArea: 10000000,
                filterMinPrice: 100,
                filterMaxPrice: 2000,
                filterMinRooms: 0,
                filterMaxRooms: 10000000,
                pageSize: 10,
                requestingPage: 1
            }
        }, () => this.getApartments())
    }

    handlePriceFilteringChange(value) {

        this.setState({
            filter: {
                ...this.state.filter,
                filterMinPrice: value[0],
                filterMaxPrice: value[1]
            }
        })
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


        Http.GET('get_apartments', params)
            .then((response) => {

                notifySuccess('Apartment fetched successfully', 'Success')
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
                    notifyFailure(error.response.data.message)
                } else {
                    notifyFailure('Could not connect to server')
                }
                this.setState({
                    loading: false
                })
            })
    }

    launchMap(rowInfo) {

        this.setState({

            loadedApartmentInfo: {
                name: rowInfo.original.name,
                latitude: rowInfo.original.latitude,
                longitude: rowInfo.original.longitude
            },
            showLocationModal: true
        }, () => console.log('launching map: ',
            JSON.stringify(this.state.loadedApartmentInfo, null, 2)))
    }

    render() {
        return (
            <ApartmentContext.Provider value={this.state.loadedApartmentInfo}>
                <ApartmentUI
                    data = {this.state}
                    filterApartments = {this.filterApartments}
                    launchMap = {this.launchMap}
                    closeLocationModal = {this.closeLocationModal}
                    handleFilteringChange = {this.handlePriceFilteringChange}
                    resetFilter = {this.resetFilter}
                />
            </ApartmentContext.Provider>

        )
    }
}

export default Apartment