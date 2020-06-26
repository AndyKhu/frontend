export default ($axios) => {
    $axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`
    return {
        getDataALL() {
            return $axios.get(`/tandaterima/getData`)
        },
        getPelanggans() {
            return $axios.get(`/supel/getData`)
        },
        savePelanggan(value) {
            return $axios.post(`/supel/save`,value)
        },
        save(value) {
            return $axios.post(`/tandaterima/save`, value)
        },
        update(value) {
            return $axios.post(`/tandaterima/update`, value)
        },
        deletett(value) {
            return $axios.post(`/tandaterima/delete`, value)
        }
    }
}