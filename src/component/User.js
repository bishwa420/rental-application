import React, {Component} from 'react'
import Http from '../service/Http'
import NotificationManager from 'react-notifications/lib/NotificationManager'
import NotificationContainer from 'react-notifications/lib/NotificationContainer'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Title from './Title'
import Modal from './Modal'

class User extends Component {

    constructor(props) {
        super(props)
        this.state = {
            users: [],
            pages: 0,
            filter: {
                filterName: '',
                filterEmail: '',
                filterRole: 'ALL',
                pageSize: 10,
                requestingPage: 1
            },
            loading: true,
            showDeleteModal: false,
            deletingUser: {
                id: '',
                name: '',
                email: ''
            },
            showUpdateModal: false,
            updatingUser: {
                id: '',
                updateName: '',
                updateEmail: '',
                updateRole: '',
            }
        }

        this.getUsers = this.getUsers.bind(this)
        this.handleFilteringChange = this.handleFilteringChange.bind(this)
        this.filterUsers = this.filterUsers.bind(this)
        this.launchDeleteModal = this.launchDeleteModal.bind(this)
        this.onConfirmDeleteModal = this.onConfirmDeleteModal.bind(this)
        this.onCloseDeleteModal = this.onCloseDeleteModal.bind(this)
        this.launchUpdateModal = this.launchUpdateModal.bind(this)
        this.onConfirmUpdateUserModal = this.onConfirmUpdateUserModal.bind(this)
        this.onCloseUpdateUserModal = this.onCloseUpdateUserModal.bind(this)
        this.handleUpdateChange = this.handleUpdateChange.bind(this)
        this.resetFilter = this.resetFilter.bind(this)
    }

    componentDidMount() {

        this.getUsers()
    }

    handleFilteringChange(event) {

        const {target} = event
        const value = target.type === 'checkbox' ? target.checked : target.value
        const {name} = target

        console.log('name: ', name, ' value: ', value)

        this.setState({
            filter: {
                ...this.state.filter,
                [name]: value
            }
        })
    }

    getUsers(params) {

        this.setState({
            loading: true
        })

        Http.GET('get_users', params)
            .then((response) => {

                console.log('response: ', JSON.stringify(response, null, 2))
                NotificationManager.success('Received users list from server')
                this.setState({
                    users: response.data.userList,
                    pages: response.data.page.totalPages,
                    requestingPage: response.data.page.number,
                    loading: false
                })
            })
            .catch((error) => {
                if (error && error.response) {
                    NotificationManager.error(error.response.data.message)
                } else {
                    NotificationManager.error('Could not connect to server')
                }
                this.setState({
                    loading: false
                })
            })
    }

    filterUsers(event) {

        if (event !== undefined) {
            event.preventDefault()
        }

        let reqParam = {
            nameLike: this.state.filter.filterName ? this.state.filter.filterName : '',
            emailLike: this.state.filter.filterEmail ? this.state.filter.filterEmail : '',
            role: this.state.filter.filterRole !== 'ALL' ? this.state.filter.filterRole : '',
            page: this.state.filter.requestingPage,
            limit: this.state.filter.pageSize
        }

        this.getUsers(reqParam)
    }

    onConfirmDeleteModal() {

        let reqBody = {
            email: this.state.deletingUser.email
        }

        console.log('Will do request with request body: ', JSON.stringify(reqBody))

        Http.DELETE('delete_user', reqBody)
            .then((response) => {

                NotificationManager.success('User deleted successfully')
                this.onCloseDeleteModal()
                setTimeout(this.filterUsers, 2000)
            })
            .catch(error => {

                if( error.response && error.response.data.message)
                    NotificationManager.error(error.response.data.message)
                else
                    NotificationManager.error('User not deleted')
                this.onCloseDeleteModal()
            })
    }

    onCloseDeleteModal() {
        this.setState({
            showDeleteModal: false
        })
    }

    launchDeleteModal(rowInfo) {

        this.setState({
            showDeleteModal: true,
            deletingUser: {
                name: rowInfo.original.name,
                email: rowInfo.original.email,
                id: rowInfo.original.userId
            }
        })
    }

    launchUpdateModal(user) {

        this.setState({
            updatingUser: {
                id: user.userId,
                updateName: user.name,
                updateEmail: user.email,
                updateRole: user.role
            },
            showUpdateModal: true
        })
    }

    onConfirmUpdateUserModal() {

        let reqBody = {
            id: this.state.updatingUser.id,
            name: this.state.updatingUser.updateName,
            email: this.state.updatingUser.updateEmail,
            role: this.state.updatingUser.updateRole
        }

        Http.PUT('update_user', reqBody)
            .then((response) => {

                NotificationManager.success('User updated successfully')

                this.onCloseUpdateUserModal()
                setTimeout(this.filterUsers, 2000)
            })
            .catch(error => {
                if(error.response && error.response.data) {
                    NotificationManager.error(error.response.data.message)
                } else {
                    NotificationManager.error('Could not connect to server')
                }
            })
    }

    onCloseUpdateUserModal () {

        this.setState({
            showUpdateModal: false
        })
    }

    handleUpdateChange(event) {

        const {target} = event
        const value = target.type === 'checkbox' ? target.checked : target.value
        const {name} = target

        this.setState({
            updatingUser: {
                ...this.state.updatingUser,
                [name]: value
            }
        })
    }

    resetFilter() {

        this.setState({
            filter: {
                filterName: '',
                filterEmail: '',
                filterRole: 'ALL',
                pageSize: 10,
                requestingPage: 1
            }
        }, () => this.getUsers())
    }
    render() {

        return (
            <div>

                <Title value="Users"></Title>

                <div className="row">

                    <form className="filtering-form row" onSubmit={e => e.preventDefault()}>

                        <div className="col-md-3 offset-md-1">

                            <label htmlFor="filterName">NAME</label>
                            <input className="form-control" name="filterName"
                                   value={this.state.filter.filterName} id="filterName"
                                   placeholder="name"
                                   onChange={this.handleFilteringChange}/>
                        </div>

                        <div className="col-md-3">
                            <label htmlFor="filterEmail">EMAIL</label>
                            <input className="form-control" name="filterEmail"
                                   value={this.state.filter.filterEmail} id="filterEmail"
                                   placeholder="email"
                                   onChange={this.handleFilteringChange}/>
                        </div>

                        <div className="col-md-2">
                            <label htmlFor="filterRole">ROLE</label>
                            <select value={this.state.filter.filterRole}
                                    name="filterRole" id="filterRole"
                                    onChange={this.handleFilteringChange}>
                                <option value="ALL">ALL</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="REALTOR">REALTOR</option>
                                <option value="CLIENT">CLIENT</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <button className="btn btn-md btn-info filtering-form-button"
                                    onClick={this.filterUsers}>Search
                            </button>
                            <button className="btn btn-md btn-danger filtering-form-button"
                                    onClick={this.resetFilter}>Reset
                            </button>
                        </div>
                    </form>
                </div>

                <div className="row center-content">

                    <ReactTable
                        data={this.state.users}
                        pages={this.state.pages}
                        defaultPageSize={this.state.filter.pageSize}
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
                                                                                     onClick={e => this.launchDeleteModal(row)}></i>
                                        </div>
                                    }
                                }
                            ]
                        }
                        loading={this.state.loading}
                        manual
                        onFetchData={(state, instance) => {
                            this.state.filter.requestingPage = state.page + 1
                            this.state.filter.pageSize = state.pageSize

                            console.log('state: ', state, ' filters: ', this.state.filter)
                            this.filterUsers()
                        }}
                        minRows='2'
                        sortable={false}
                        getTdProps={(state, rowInfo, column, instance) => {
                            return {
                                onClick: (event) => {

                                    if(column.Header === 'ACTION') {
                                        return
                                    }

                                    this.launchUpdateModal(rowInfo.original)
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
                    show={this.state.showDeleteModal}
                    action = {
                        {
                            confirm: this.onConfirmDeleteModal,
                            close: this.onCloseDeleteModal
                        }
                    }>

                    <div className="row">

                        <span>Are you sure you want to delete user <span style={{fontWeight: 'bold'}}>{this.state.deletingUser.name}</span> (email: <span style={{fontWeight: 'bold'}}>{this.state.deletingUser.email}</span>)?
                        </span>
                    </div>
                </Modal>

                <Modal id="UpdateUserModal"
                    title="Update User"
                    show={this.state.showUpdateModal}
                    action = {
                        {
                            confirm: this.onConfirmUpdateUserModal,
                            close: this.onCloseUpdateUserModal
                        }
                    }>

                    <form>
                        <div className="row form-group">
                            <label htmlFor="updateUserName">NAME</label>
                            <input className="form-control"
                                value={this.state.updatingUser.updateName}
                                name="updateName"
                                id="updateUserName"
                                onChange={this.handleUpdateChange}/>
                        </div>

                        <div className="row form-group">
                            <label htmlFor="updateEmail">EMAIL</label>
                            <input className="form-control"
                                   value={this.state.updatingUser.updateEmail}
                                   name="updateEmail"
                                   id="updateUserEmail"
                                    onChange={this.handleUpdateChange}/>
                        </div>

                        <div className="row form-group">
                            <label>ROLE</label>
                            <select className="form-control"
                                value={this.state.updatingUser.updateRole}
                                name="updateRole"
                                id="updateUserRole"
                                onChange={this.handleUpdateChange}>

                                <option value="ADMIN">ADMIN</option>
                                <option value="REALTOR">REALTOR</option>
                                <option value="CLIENT">CLIENT</option>
                            </select>
                        </div>
                    </form>
                </Modal>

                <NotificationContainer/>
            </div>
        )
    }
}

export default User