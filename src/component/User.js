import React, {Component} from 'react'
import Http from '../service/Http'
import NotificationManager from 'react-notifications/lib/NotificationManager'
import NotificationContainer from 'react-notifications/lib/NotificationContainer'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import Title from './Title'

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
            loading: true
        }

        this.getUsers = this.getUsers.bind(this)
        this.handleFilteringChange = this.handleFilteringChange.bind(this)
        this.filterUsers = this.filterUsers.bind(this)
    }

    componentDidMount() {

        this.getUsers()
    }

    handleFilteringChange(event) {

        const {target} = event
        const value = target.type === 'checkbox' ? target.checked : target.value
        const {name} = target

        console.log('name: ', name, ' value: ', value)

        this.setState( {
            filter: {
                ...this.state.filter,
                [name] : value
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
                    loading: false
                })
            })
            .catch((error) => {
                if(error && error.response) {
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

        if(event !== undefined) {
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
                                onClick={this.filterUsers}>Search</button>
                            <button className="btn btn-md btn-danger filtering-form-button"
                                onClick={this.getUsers}>Reset</button>
                        </div>
                    </form>
                </div>

                <div className="row center-content">

                    <ReactTable
                        data = {this.state.users}
                        pages = {this.state.pages}
                        defaultPageSize = {this.state.filter.pageSize}
                        columns = {
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
                                }
                            ]
                        }
                        loading={this.state.loading}
                        manual
                        onFetchData = {(state, instance) => {
                            this.state.filter.requestingPage = state.page + 1
                            this.state.filter.pageSize = state.pageSize

                            console.log('state: ', state,  ' filters: ', this.state.filter)
                            this.filterUsers()
                        }}
                        minRows = '2'
                        sortable = {false}
                    />

                </div>
                <NotificationContainer/>
            </div>
        )
    }
}

export default User