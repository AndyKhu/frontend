import Auth from "@/services/authService";
import TandaTerima from "@/services/tandaterimaService";
import axios from 'axios';
import router from '@/router'

let instance = axios.create({
    baseURL: `${process.env.VUE_APP_SERVERPATH}/api`
});
if(localStorage.token){
    instance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`
}
instance.interceptors.response.use(function (response) {
    return response;
}, function (err) {
    if(err.response.status === 401){
        localStorage.removeItem('token')
        router.go({name: 'login'})
    }
    return Promise.reject(err);
});
// Initialize API repositories
const repositories = {
    auth: Auth(axios,instance),
    tandaterima: TandaTerima(instance)
};
export { repositories };
