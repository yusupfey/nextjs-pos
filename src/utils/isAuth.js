import { removeCookie } from "./cookie"

export const IsAuth = (responseCode, callback) => {
    if(responseCode == 401){
        removeCookie('token')
        removeCookie('logged_in')
        callback(true)
    }
}