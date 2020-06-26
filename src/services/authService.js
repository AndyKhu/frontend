import router from '@/router'
export default $axios => ({
    login(user) {
        return $axios.post(`/auth/login`, user).then(res => {
            localStorage.setItem("token", res.data.jwt.accessToken)
            $axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`
            router.push('/')
        });
    },
    logout() {
        localStorage.removeItem('token')
        router.push('login')
        delete $axios.defaults.headers.common['Authorization']
    },
    checkToken() {
        return $axios.get(`/auth/checkToken`, { headers: { Authorization: `Bearer ${localStorage.token}` } })
    }
});