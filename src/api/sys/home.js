import base from "../base"
import axios from 'axios';
const api={
    getBookMarkLeftNavigation(data) {
        return axios.get(base.api + '/navigation/getByType',{params:data})
    },
    getSimulationLeftNavigations() {
        return axios.get(base.api + '/counDevice/getAll')
    }
}

export default api;