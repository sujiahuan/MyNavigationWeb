import Vue from 'vue'
import VueRouter from 'vue-router'

import bookMarkCard from "../components/book_mark/BookMarkCard"
import icomTable from "../components/system/IcomTable"
import sortTable from "../components/system/SortTable"
import deviceTable from "../components/system/DeviceTable"
import controlDevice from "../components/simulation_facility/ControlDevice"
import home from "../components/Home"
import codeTable from "../components/system/DivisorTable"


Vue.use(VueRouter);

const routes=[
    {
        path:"/home",
        name:"home",
        // redirect: '/home/bookMarkCard/:id',
        component:home,
        children:[
            {
                path:"bookMarkCard/:id",
                name:"bookMarkCard",
                component:bookMarkCard,
            },
            {
                path:"deviceTable",
                name:"deviceTable",
                component:deviceTable
            },
            {
                path:"codeTable",
                name:"codeTable",
                component:codeTable
            },
            {
                path:"icomTable",
                name:"icomTable",
                component:icomTable
            },
            {
                path:"sortTable",
                name:"sortTable",
                component:sortTable
            },
            {
                path:"controlDevice/:id",
                name:"controlDevice",
                component:controlDevice
            },
        ]
    },
    { path: '*', redirect: '/home' }
]

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
    routes
})


export default router;
