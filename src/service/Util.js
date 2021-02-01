import NotificationManager from "react-notifications/lib/NotificationManager"

const isTokenExpired = (token) => {

    let base64Url = token.split('.')[1]
    if(base64Url === undefined)
        return true

    let base64 = base64Url.replace('-', '+')
    if(base64 === undefined)
        return true

    base64 = base64.replace('_', '/')
    if(base64 === undefined)
        return true

    let json = JSON.parse(window.atob(base64))
    if(json === undefined)
        return true

    let exp = JSON.parse(window.atob(base64)).exp
    if(exp === undefined)
        return true

    return exp*1000 <= new Date().getTime()
}

export const removeAllNotifications = () => {
    NotificationManager.listNotify.forEach(n => NotificationManager.remove({ id: n.id }));
}

export {isTokenExpired}
