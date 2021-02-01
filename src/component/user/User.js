import React, {Component} from 'react'
import Http from '../../service/Http'
import NotificationManager from 'react-notifications/lib/NotificationManager'
import 'react-table/react-table.css'
import UserUI from './UserUI'
import {removeAllNotifications} from '../../service/Util'

const isEmailValid = (email) => {

    if(email.trim() === '')
        return false
    return !/^[A-Za-z0-9][A-Za-z0-9._-]*@[A-Za-z0-9][A-Za-z0-9._-]*\.([A-Za-z0-9][A-Za-z0-9_-]\.)*[A-Za-z]{2,}$/.test(email);

}


const isRoleValid = (role) => {

    return role === 'ADMIN' && role === 'REALTOR' && role === 'CLIENT'
}

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
                updateSuspendStatus: ''
            },
            creatingUser: {
                createName: '',
                createEmail: '',
                createPassword: '',
                createRole: 'CLIENT',
            },
            creatingUserError: {
                createNameError: false,
                createEmailError: false,
                createPasswordError: false,
                createRoleError: false
            },
            showCreateModal: false
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
        this.onConfirmAddUserModal = this.onConfirmAddUserModal.bind(this)
        this.onCloseAddUserModal = this.onCloseAddUserModal.bind(this)
        this.handleAddChange = this.handleAddChange.bind(this)
        this.launchCreateModal = this.launchCreateModal.bind(this)
        this.isCreateUserFormValid = this.isCreateUserFormValid.bind(this)
        this.updateCreateUserError = this.updateCreateUserError.bind(this)
        this.validateCreateName = this.validateCreateName.bind(this)
        this.validateCreateEmail = this.validateCreateEmail.bind(this)
        this.validateCreatePassword = this.validateCreatePassword.bind(this)
        this.validateCreateRole = this.validateCreateRole.bind(this)
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

                removeAllNotifications()
                NotificationManager.success('Received users list from server', 'Success')
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
                updateRole: user.role,
                updateSuspendStatus: user.isSuspended
            },
            showUpdateModal: true
        })
    }

    onConfirmUpdateUserModal() {

        let reqBody = {
            id: this.state.updatingUser.id,
            name: this.state.updatingUser.updateName,
            email: this.state.updatingUser.updateEmail,
            role: this.state.updatingUser.updateRole,
            doSuspend: this.state.updatingUser.updateSuspendStatus
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

    onConfirmAddUserModal() {

        if(!this.validateCreateName() || !this.validateCreateEmail() || !this.validateCreateRole()) {
            return;
        }

        let reqBody = {
            name: this.state.creatingUser.createName,
            email: this.state.creatingUser.createEmail,
            role: this.state.creatingUser.createRole,
            password: this.state.creatingUser.createPassword
        }

        console.log('Request body: ', JSON.stringify(reqBody, null, 2))

        Http.POST('create_user', reqBody)
            .then((response) => {

                NotificationManager.success("User created successfully")
                this.onCloseAddUserModal()
                setTimeout(this.filterUsers, 2000)
            })
            .catch(error => {

                console.log('error: ', JSON.stringify(error, null, 2))
                if(error && error.response) {
                    NotificationManager.error(error.response.data.message)
                } else {
                    NotificationManager.error("Could not connect to server")
                }
            })
    }

    onCloseAddUserModal() {

        this.setState({
            showCreateModal: false
        })
    }

    handleAddChange(event) {

        const {target} = event
        const value = target.type === 'checkbox' ? target.checked : target.value
        const {name} = target

        this.setState({
            creatingUser: {
                ...this.state.creatingUser,
                [name]: value
            }
        })
    }

    launchCreateModal() {
        this.setState({
            showCreateModal: true
        })
    }

    isCreateUserFormValid() {

        const {createName, createEmail, createRole} = this.state
        return createName.trim() !== '' && isEmailValid(createEmail) && isRoleValid(createRole)
    }

    updateCreateUserError(name, value) {

        this.setState({
            creatingUserError: {
                ...this.state.creatingUserError,
                [name]: value
            }
        })
    }

    validateCreateName() {
        if(this.state.creatingUser.createName.length < 1) {
            this.updateCreateUserError('createNameError', 'Name is required')
            return false
        } else {
            this.updateCreateUserError('createNameError', false)
            return true
        }
    }

    validateCreateEmail() {
        if(this.state.creatingUser.createEmail.length < 1) {
            this.updateCreateUserError('createEmailError', 'Email is required')
            return false
        } else if(isEmailValid(this.state.creatingUser.createEmail)) {
            this.updateCreateUserError('createEmailError', 'Email is invalid')
            return false
        } else {
            this.updateCreateUserError('createEmailError', false)
            return true
        }
    }

    validateCreatePassword() {

        if(this.state.creatingUser.createPassword.length < 1) {
            this.updateCreateUserError('createPasswordError', 'Password is required')
            return false
        } else {
            this.updateCreateUserError('createPasswordError', false)
            return true
        }
    }

    validateCreateRole() {
        if(this.state.creatingUser.createRole.length < 1) {
            this.updateCreateUserError('createRoleError', 'Role is required')
            return false
        } else {
            this.updateCreateUserError('createRoleError', false)
            return true
        }
    }


    render() {

        return (
            <div>

                <UserUI
                    data = {this.state}
                    handleFilteringChange = {this.handleFilteringChange}
                    getUsers = {this.getUsers}
                    filterUsers = {this.filterUsers}
                    onConfirmDeleteModal = {this.onConfirmDeleteModal}
                    onCloseDeleteModal = {this.onCloseDeleteModal}
                    launchDeleteModal = {this.launchDeleteModal}
                    launchUpdateModal = {this.launchUpdateModal}
                    onConfirmUpdateUserModal = {this.onConfirmUpdateUserModal}
                    onCloseUpdateUserModal = {this.onCloseUpdateUserModal}
                    handleUpdateChange = {this.handleUpdateChange}
                    resetFilter = {this.resetFilter}
                    onConfirmAddUserModal = {this.onConfirmAddUserModal}
                    onCloseAddUserModal = {this.onCloseAddUserModal}
                    handleAddChange = {this.handleAddChange}
                    launchCreateModal = {this.launchCreateModal}
                    isEmailValid = {isEmailValid}
                    validateCreateName = {this.validateCreateName}
                    validateCreateEmail = {this.validateCreateEmail}
                    validateCreateRole = {this.validateCreateRole}
                    validateCreatePassword = {this.validateCreatePassword}
                />
            </div>
        )
    }
}

export default User