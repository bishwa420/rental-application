import React from 'react'
import Title from "./Title"
import ReactTable from "react-table"
import Modal from "./Modal"
import NotificationContainer from "react-notifications/lib/NotificationContainer"


export default function UserUI(props) {

    return (
        <div>

            <Title value="Users"></Title>

            <div className="row">

                <div className="col-md-3 offset-md-9" style={{textAlign: 'right'}}>
                    <button className="btn btn-md btn-success"
                            style={{marginRight: '1.5em'}}
                            onClick={props.launchCreateModal}>
                        <i className="fa fa-plus"></i> Create User
                    </button>
                </div>

                <form className="filtering-form row" onSubmit={e => e.preventDefault()}>

                    <div className="col-md-3 offset-md-1">

                        <label htmlFor="filterName">NAME</label>
                        <input className="form-control" name="filterName"
                               value={props.data.filter.filterName} id="filterName"
                               placeholder="name"
                               onChange={props.handleFilteringChange}/>
                    </div>

                    <div className="col-md-3">
                        <label htmlFor="filterEmail">EMAIL</label>
                        <input className="form-control" name="filterEmail"
                               value={props.data.filter.filterEmail} id="filterEmail"
                               placeholder="email"
                               onChange={props.handleFilteringChange}/>
                    </div>

                    <div className="col-md-2">
                        <label htmlFor="filterRole">ROLE</label>
                        <select value={props.data.filter.filterRole}
                                name="filterRole" id="filterRole"
                                onChange={props.handleFilteringChange}>
                            <option value="ALL">ALL</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="REALTOR">REALTOR</option>
                            <option value="CLIENT">CLIENT</option>
                        </select>
                    </div>

                    <div className="col-md-2">
                        <button className="btn btn-md btn-info filtering-form-button"
                                onClick={props.filterUsers}>Search
                        </button>
                        <button className="btn btn-md btn-danger filtering-form-button"
                                onClick={props.resetFilter}>Reset
                        </button>
                    </div>
                </form>
            </div>

            <div className="row center-content">

                <ReactTable
                    data={props.data.users}
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
                                width: 280,
                                accessor: 'name',
                                resizable: false,
                            },
                            {
                                Header: 'EMAIL',
                                width: 280,
                                accessor: 'email',
                                resizable: false,
                            },
                            {
                                Header: 'ROLE',
                                accessor: 'role',
                                resizable: false
                            },
                            {
                                Header: 'STATUS',
                                width: 180,
                                accessor: 'status',
                                resizable: false
                            },
                            {
                                Header: 'ACTION',
                                accessor: 'userId',
                                Cell: (row) => {
                                    return <div style={{textAlign: 'center'}}><i className="fa fa-times"
                                                                                 style={{color: 'red', cursor: 'pointer'}}
                                                                                 onClick={e => props.launchDeleteModal(row)}></i>
                                    </div>
                                }
                            }
                        ]
                    }
                    loading={props.data.loading}
                    manual
                    onFetchData={(state, instance) => {
                        props.data.filter.requestingPage = state.page + 1
                        props.data.filter.pageSize = state.pageSize
                        props.filterUsers()
                    }}
                    minRows='2'
                    sortable={false}
                    getTdProps={(state, rowInfo, column, instance) => {
                        return {
                            onClick: (event) => {

                                if(column.Header === 'ACTION') {
                                    return
                                }

                                props.launchUpdateModal(rowInfo.original)
                            },
                            style: {
                                cursor: 'pointer'
                            }
                        }
                    }}
                />

            </div>

            <Modal id="DeleteUserModal"
                   title="Delete User"
                   show={props.data.showDeleteModal}
                   action = {
                       {
                           confirm: props.onConfirmDeleteModal,
                           close: props.onCloseDeleteModal
                       }
                   }>

                <div className="row">

                        <span>Are you sure you want to delete user <span style={{fontWeight: 'bold'}}>{props.data.deletingUser.name}</span> (email: <span style={{fontWeight: 'bold'}}>{props.data.deletingUser.email}</span>)?
                        </span>
                </div>
            </Modal>

            <Modal id="UpdateUserModal"
                   title="Update User"
                   show={props.data.showUpdateModal}
                   action = {
                       {
                           confirm: props.onConfirmUpdateUserModal,
                           close: props.onCloseUpdateUserModal
                       }
                   }>

                <form>
                    <div className="row form-group">
                        <label htmlFor="updateUserName">NAME</label>
                        <input className="form-control"
                               value={props.data.updatingUser.updateName}
                               name="updateName"
                               id="updateUserName"
                               onChange={props.handleUpdateChange}/>
                    </div>

                    <div className="row form-group">
                        <label htmlFor="updateEmail">EMAIL</label>
                        <input className="form-control"
                               value={props.data.updatingUser.updateEmail}
                               name="updateEmail"
                               id="updateUserEmail"
                               onChange={props.handleUpdateChange}/>
                    </div>

                    <div className="row form-group">
                        <label>ROLE</label>
                        <select className="form-control"
                                value={props.data.updatingUser.updateRole}
                                name="updateRole"
                                id="updateUserRole"
                                onChange={props.handleUpdateChange}>

                            <option value="ADMIN">ADMIN</option>
                            <option value="REALTOR">REALTOR</option>
                            <option value="CLIENT">CLIENT</option>
                        </select>
                    </div>
                </form>
            </Modal>

            <Modal  id="CreateUserModal"
                    title="Create User"
                    show={props.data.showCreateModal}
                    action = {
                        {
                            confirm: props.onConfirmAddUserModal,
                            close: props.onCloseAddUserModal
                        }
                    }>

                <form>
                    <div className="row form-group">
                        <label htmlFor="createName" className="react-label">NAME <span className="help-block text-danger">*</span></label>
                        <input className="form-control"
                               type="text"
                               placeholder="name"
                               value={props.data.creatingUser.createName}
                               name="createName"
                               id="createName"
                               onChange={props.handleAddChange}
                               onBlur={props.validateCreateName}
                               required/>
                        {
                            props.data.creatingUserError.createNameError ? <span id="helpCreateName"
                                                              className="help-block text-danger">
                                    <small>{props.data.creatingUserError.createNameError}</small>
                                </span> : null
                        }
                    </div>

                    <div className="row form-group">
                        <label htmlFor="createEmail">EMAIL <span className="help-block text-danger">*</span></label>
                        <input className="form-control"
                               value={props.data.creatingUser.createEmail}
                               name="createEmail"
                               id="createEmail"
                               onChange={props.handleAddChange}
                               onBlur={props.validateCreateEmail}/>
                        {
                            props.data.creatingUserError.createEmailError ? <span id="helpCreateEmail"
                                                                                 className="help-block text-danger">
                                    <small>{props.data.creatingUserError.createEmailError}</small>
                                </span> : null
                        }
                    </div>

                    <div className="row form-group">
                        <label htmlFor="createPassword">PASSWORD <span className="help-block text-danger">*</span></label>
                        <input className="form-control"
                               type="password"
                               value={props.data.creatingUser.createPassword}
                               name="createPassword"
                               id="createPassword"
                               onChange={props.handleAddChange}
                               onBlur={props.validateCreatePassword}/>
                        {
                            props.data.creatingUserError.createPasswordError ? <span id="helpCreatePassword"
                                                                                  className="help-block text-danger">
                                    <small>{props.data.creatingUserError.createPasswordError}</small>
                                </span> : null
                        }
                    </div>

                    <div className="row form-group">
                        <label>ROLE <span className="help-block text-danger">*</span></label>
                        <select className="form-control"
                                value={props.data.creatingUser.createRole}
                                name="createRole"
                                id="createRole"
                                onChange={props.handleAddChange}
                                onBlur={props.validateCreateRole}>

                            <option value="ADMIN">ADMIN</option>
                            <option value="REALTOR">REALTOR</option>
                            <option value="CLIENT">CLIENT</option>
                        </select>

                        {
                            props.data.creatingUserError.createRoleError ? <span id="helpCreateRole"
                                                                                  className="help-block text-danger">
                                    <small>{props.data.creatingUserError.createRoleError}</small>
                                </span> : null
                        }
                    </div>
                </form>
            </Modal>

            <NotificationContainer/>
        </div>
    )
}