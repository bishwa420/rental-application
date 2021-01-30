import React from "react"
import Title from "../common/Title";
import ReactTable from "react-table";
import {NotificationContainer, NotificationManager} from "react-notifications/lib"
import MapContainer from "./MapContainer"
import Modal from "../common/Modal"
import {Slider, Rail, Handles, Tracks} from "react-compound-slider"
import {sliderStyle, railStyle, Handle, Track} from "../../service/SlideStyle"

export default function ApartmentUI(props) {

    return (
        <div>

            <Title value="Apartments"></Title>

            <form className="filtering-form row" onSubmit={e => e.preventDefault()}>

                <div className="col-md-3 offset-md-1">

                    <label htmlFor="filterName" className="range-label">PRICE</label>
                    <Slider
                        values={[props.data.filter.filterMinPrice, props.data.filter.filterMaxPrice]}
                        step={100}
                        mode={2}
                        domain={[100,10000]}
                        rootStyle={sliderStyle}
                        onChange={props.handleFilteringChange}>

                        <Rail>
                            {({ getRailProps }) => (
                                <div style={railStyle} {...getRailProps()} />
                            )}
                        </Rail>
                        <Handles>
                            {
                                ({handles, getHandleProps}) => (
                                    <div className="slider-handles">
                                        {
                                            handles.map(handle => (
                                                <Handle
                                                    key={handle.id}
                                                    handle={handle}
                                                    getHandleProps={getHandleProps}
                                                />
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </Handles>

                        <Tracks right={false}>
                            {({tracks, getTrackProps}) => (
                                <div className="slider-tracks">
                                    {
                                        tracks.map(({id, source, target}) => (
                                            <Track
                                                key={id}
                                                source={source}
                                                target={target}
                                                getTrackProps={getTrackProps}
                                            />
                                        ))
                                    }
                                </div>
                            )}
                        </Tracks>
                    </Slider>

                </div>

                <div className="col-md-12 slider-submit-section">
                    <button className="btn btn-lg btn-info slider-submit-button"
                            onClick={props.filterApartments}>Search
                    </button>
                    <button className="btn btn-lg btn-danger slider-submit-button"
                            onClick={props.resetFilter}>Reset
                    </button>
                </div>
            </form>

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
                title={props.data.loadedApartmentInfo.name}
                show={props.data.showLocationModal}
                action = {
                    {
                        confirm: props.closeLocationModal,
                        close: props.closeLocationModal
                    }
                }
                hideConfirmButton = {true}
                isMapModal = {true}>

                <MapContainer/>
            </Modal>

            <NotificationContainer/>
        </div>
    )
}