import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/'
const HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*'
}

const routes = {
    login: API_BASE_URL + 'login',
    get_users: API_BASE_URL + 'user'
}

const encodeQueryData = data => {

    let ret = [], temp
    for(let i in data) {
        temp = data[i]
        if(temp !== '' && temp !== null) {
            ret.push(encodeURIComponent(i) + '=' + encodeURI(temp))
        }
    }
    return ret.length ? '?' + ret.join('&') : ''
}

const updateTokenInHeader = () => {

    const token = {
        local : JSON.parse(localStorage.getItem('token')),
        header: axios.defaults.headers.common['token']
    }

    if(token.local && (!token.header || token.local !== token.header)) {
        axios.defaults.headers.common['token'] = token.local
    }

}

const Http = {

    GET: (key, params = '') => {
        updateTokenInHeader()
        params = typeof params === 'object' ? encodeQueryData(params) : params
        return axios.get(routes[key] + params)
    },

    POST: (key, params) => {
        updateTokenInHeader()
        return axios.post(routes[key], params, HEADERS)
    }
}

export default Http
