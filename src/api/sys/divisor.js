import base from "../base"
import axios from 'axios';
const api={
    getAll() {
        return axios.get(base.api + '/sysCode/getAll')
    },
    getPage(data) {
        return axios.get(base.api + "/sysCode/getPage", {params: data})
    }
}

export default api;