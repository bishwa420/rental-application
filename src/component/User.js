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
                filterName: '',
                filterEmail: '',
                filterRole: 'ALL'
            }
        }

        this.getUsers = this.getUsers.bind(this)
        this.handleFilteringChange = this.handleFilteringChange.bind(this)
        this.filterBusinessRules = this.filterBusinessRules.bind(this)
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

    filterBusinessRules(event) {

        event.preventDefault()

        let reqParam = {
            'nameLike': this.state.filter.filterName ? this.state.filter.filterName : '',
            'emailLike': this.state.filter.filterEmail ? this.state.filter.filterEmail : '',
            'role': this.state.filter.filterRole !== 'ALL' ? this.state.filter.filterRole : ''
        }

        this.getUsers(reqParam)
    }

    render() {

        return (
            <div>
                <div className="row">

                    <form className="filtering-form row" onSubmit={this.filterBusinessRules}>

                        <div className="col-md-3">

                            <label htmlFor="filterName">NAME</label>
                            <input className="form-control" name="filterName"
                                   value={this.state.filter.filterName} id="filterName"
                                onChange={this.handleFilteringChange}/>
                        </div>

                        <div className="col-md-3">
                            <label htmlFor="filterEmail">EMAIL</label>
                            <input className="form-control" name="filterEmail"
                                   value={this.state.filter.filterEmail} id="filterEmail"
                                onChange={this.handleFilteringChange}/>
                        </div>

                        <div className="col-md-3">
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
                                onClick={this.filterBusinessRules}>Search</button>
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