import base from "../base"
import axios from 'axios';
const home={
    getBookMarkLeftNavigation() {
        return axios.get(base.api + '/navigation/getAll')
    },
    getSimulationLeftNavigations() {
        return axios.get(base.api + '/counDevice/getAll')
    }
}

export default home;