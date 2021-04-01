import Vue from 'vue'
import VueRouter from 'vue-router'

import bookMarkCard from "../components/bookmarks/BookMarkCard"
import icomTable from "../components/system/icon_manage/IcomTable"
import sortTable from "../components/system/bookmark_manage/SortTable"
import deviceTable from "../components/system/device_manage/DeviceTable"
import controlDevice from "../components/analog_device/ControlDevice"
import home from "../components/Home"
import divisorManage from "../components/system/divisor_manage/DivisorManage"


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
                path:"divisorManage",
                name:"divisorManage",
                component:divisorManage
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
