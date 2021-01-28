import React from "react"
import Title from "../common/Title";
import ReactTable from "react-table";
import {NotificationContainer, NotificationManager} from "react-notifications/lib"
import MapContainer from "./MapContainer"
import Modal from "../common/Modal"

export default function ApartmentUI(props) {

    return (
        <div>

            <Title value="Apartments"></Title>

            <div className="row center-content">

                <ReactTable
                    data={props.data.apartments}
                    pages={props.data.pages}
                    defaultPageSize={props.data.filter.pageSize}
                    columns={
                        [
                            {
                                Header: 'S/N',
                                id: 'row',
                                filterable: false,
                                Cell: (row) => {
                                    return <div> {row.index + 1} </div>
                                },
                                width: 60,
                                resizable: false,
                                style: {
                                    textAlign: 'right'
                                }
                            },
                            {
                                Header: 'NAME',
                                width: 250,
                                accessor: 'name',
                                resizable: false,
                            },
                            {
                                Header: 'AREA',
                                width: 150,
                                accessor: 'floorArea',
                                resizable: false,
                            },
                            {
                                Header: 'PRICE',
                                accessor: 'price',
                                resizable: false
                            },
                            {
                                Header: 'ROOMS',
                                width: 100,
                                accessor: 'roomCount',
                                resizable: false
                            },
                            {
                                Header: 'LOCATION',
                                accessor: 'latitude',
                                Cell: (row) => {
                                    return (
                                        <div style={{textAlign: 'center'}}>
                                            <a style={{cursor: 'pointer'}}>
                                                <i className="fa fa-map-marker fa-2x"
                                                   style={{color: '#2ddd8a'}}
                                                   onClick={() => props.launchMap(row)}></i>
                                            </a>
                                        </div>
                                    )
                                }
                            }
                        ]
                    }
                    loading={props.data.loading}
                    manual
                    onFetchData={(state, instance) => {
                        props.data.filter.requestingPage = state.page + 1
                        props.data.filter.pageSize = state.pageSize
                        props.filterApartments()
                    }}
                    minRows='2'
                    sortable={false}
                />

            </div>

            <Modal
                id="LocationModal"
                title={props.data.loadedApartmentName}
                show={props.data.showLocationModal}
                action = {
                    {
                        confirm: props.closeLocationModal,
                        close: props.closeLocationModal
                    }
                }
                hideConfirmButton = {true}
                isMapModal = {true}>

                <MapContainer
                    data = { {
                        latitude: props.data.loadedApartmentLatitude,
                        longitude: props.data.loadedApartmentLongitude
                    }}
                />
            </Modal>

            <NotificationContainer/>
        </div>
    )
}