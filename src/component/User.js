import React, {Component} from 'react'
import Http from '../service/Http'
import NotificationManager from 'react-notifications/lib/NotificationManager'
import NotificationContainer from 'react-notifications/lib/NotificationContainer'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Title from './Title'
import Modal from './Modal'
import UserUI from './UserUI'

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

                if (error.response && error.response.data.message)
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
                if (error.response && error.response.data) {
                    NotificationManager.error(error.response.data.message)
                } else {
                    NotificationManager.error('Could not connect to server')
                }
            })
    }

    onCloseUpdateUserModal() {

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
            <UserUI
                data={this.state}
                handleFilteringChange={this.handleFilteringChange}
                getUsers={this.getUsers}
                filterUsers={this.filterUsers}
                onConfirmDeleteModal={this.onConfirmDeleteModal}
                onCloseDeleteModal={this.onCloseDeleteModal}
                launchDeleteModal={this.launchDeleteModal}
                launchUpdateModal={this.launchUpdateModal}
                onConfirmUpdateUserModal={this.onConfirmUpdateUserModal}
                onCloseUpdateUserModal={this.onCloseUpdateUserModal}
                handleUpdateChange={this.handleUpdateChange}
                resetFilter={this.resetFilter}
            />
        )
    }
}

export default User