import router from '@/router'
export default ($axios,$instance) => {
    const path = `${process.env.VUE_APP_SERVERPATH}/api`
    return {
        login(user) {
            return $axios.post(`${path}/auth/login`, user).then(res => {
                localStorage.setItem("token", res.data.jwt.accessToken)
                $instance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`
                router.push('/')
            });
        },
        logout() {
            localStorage.removeItem('token')
            router.push({ name: 'login' })
        }
    }
};