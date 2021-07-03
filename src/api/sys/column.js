import base from "../base"
import axios from 'axios';
const column={
    getPage(data) {
        return axios.get(base.api + '/navigation/getPage',{params:data})
    },
    deleteById(id) {
        return  axios.delete(base.api + '/navigation/deleteById?id=' + id)
    },
    update(data) {
        return  axios.post(base.api + '/navigation/update', data)
    },
    add(data) {
        return  axios.post(base.api + '/navigation/add', data)
    },
    getById(id){
        return axios.get(base.api + '/navigation/getById?id=' + id)
    },
    getByType(type){
        return axios.get(base.api + '/navigation/getByType?type=' + type)
    }

}

export default column;