import Auth from "@/services/authService";
import TandaTerima from "@/services/tandaterimaService";
import axios from 'axios';


let instance = axios.create({
    baseURL: `${process.env.VUE_APP_SERVERPATH}/api`
});
instance.interceptors.response.use(function (response) {
    return response;
}, function (err) {
    if(err.response.status === 401){
        Auth(instance).logout()
    }
    return Promise.reject(err);
});
// Initialize API repositories
const repositories = {
    auth: Auth(instance),
    tandaterima: TandaTerima(instance)
};
const apiAuth = {
    auth: Auth(instance)
}
export { apiAuth, repositories };
