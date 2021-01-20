import React, {Component} from 'react'
import Http from '../service/Http'
import NotificationManager from 'react-notifications/lib/NotificationManager'
import NotificationContainer from 'react-notifications/lib/NotificationContainer'

class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: '',
            filter: {
                name: '',
                email: '',
                role: 'ALL'
            }
        }

        this.getUsers = this.getUsers.bind(this)
        this.handleFilteringChange = this.handleFilteringChange.bind(this)
    }

    componentDidMount() {

        this.getUsers()
    }

    handleFilteringChange(event) {

        const {target} = event
        const value = target.type === 'checkbox' ? target.checked : target.value
        const {name} = target

        this.setState( {
            filter: {
                ...this.state.filter,
                [name] : value
            }
        })
    }

    getUsers(params) {

        Http.GET('get_users', params)
            .then((response) => {
                NotificationManager.success('Received users list from server')
                console.log('response: ', JSON.stringify(response))
            })
            .catch((error) => {
                if(error && error.response) {
                    NotificationManager.error(error.response.data.message)
                } else {
                    NotificationManager.error('Could not connect to server')
                }
            })
    }

    render() {

        return (
            <div>
                <div className="row">

                    <form className="filtering-form row">

                        <div className="col-md-3">

                            <label for="filterName">NAME</label>
                            <input className="form-control" id="filterName" value={this.state.filter.name}
                                onChange={this.handleFilteringChange}/>
                        </div>

                        <div className="col-md-3">
                            <label for="filterEmail">EMAIL</label>
                            <input className="form-control" value={this.state.filter.email}
                                onChange={this.handleFilteringChange}/>
                        </div>

                        <div className="col-md-3">
                            <label for="filterRole">ROLE</label>
                            <select value={this.state.filter.role}>
                                <option value="ALL">ALL</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="REALTOR">REALTOR</option>
                                <option value="CLIENT">CLIENT</option>
                            </select>
                        </div>

                        <div className="col-md-2">
                            <button className="btn btn-md btn-info filtering-form-button">Search</button>
                            <button className="btn btn-md btn-danger filtering-form-button">Reset</button>
                        </div>
                    </form>
                </div>

                <NotificationContainer/>
            </div>
        )
    }
}

export default User