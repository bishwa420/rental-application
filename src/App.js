import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import {isTokenExpired} from './service/Util'
import PublicLayout from "./component/common/PublicLayout"
import PrivateLayout from "./component/common/PrivateLayout"
import Login from './component/authentication/Login'
import User from './component/user/User'
import Logout from "./component/authentication/Logout"
import NotFound from './component/common/NotFound'
import Apartment from './component/apartment/Apartment'
import Signup from './component/authentication/Signup'

const PrivateRoute = ({component: Component, ...rest}) => {

    const token = JSON.parse(localStorage.getItem('token'))
    return token ? (
        <Route {...rest} render = { matchProps => (
            <PrivateLayout>
                <Component {...matchProps} />
            </PrivateLayout>
        )}/>
    ) : <Redirect to="/login"/>
}

const PublicRoute = ({component: Component, ...rest}) => {

    const token = JSON.parse(localStorage.getItem('token'))

    return (token !== null && !isTokenExpired((token)) ? <Redirect to='/app/users'/> :
            <Route {...rest} render={ matchProps => (
                <PublicLayout>
                    <Component {...matchProps} />
                </PublicLayout>
            )}/>
    )
}

class App extends Component {

  render() {

      const token = JSON.parse(localStorage.getItem('token'))
      return (
          <Router>
              <Switch>
                  <Route exact path = "/">
                      <Redirect to = {(token !== null && !isTokenExpired(token) ? '/app/users' : '/login')} />
                  </Route>

                  <PublicRoute path="/login" component={Login}/>
                  <PublicRoute path="/signup" component={Signup}/>
                  <PrivateRoute path="/app/users" component={User}/>
                  <PrivateRoute path="/app/apartments" component={Apartment}/>
                  <PrivateRoute path="/app/logout" component={Logout}/>
                  <Route component = {NotFound}/>
              </Switch>
          </Router>
      )
  }
}

export default App;
