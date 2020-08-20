import Vue from 'vue'
import VueRouter from 'vue-router'

import bookMarkCard from "../components/BookMarkCard"
import icomTable from "../components/IcomTable"
import sortTable from "../components/SortTable"
import deviceTable from "../components/DeviceTable"
import controlDevice from "../components/ControlDevice"
import home from "../components/Home"


Vue.use(VueRouter);

const routes=[
    {
        path:"/home",
        name:"home",
        // redirect: '/home/bookMarkCard/:id',
        component:home,
        children:[
            {
                path:"bookMarkCard/:id/:leftNavigations",
                name:"bookMarkCard",
                component:bookMarkCard,
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
                path:"deviceTable",
                name:"deviceTable",
                component:deviceTable
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
