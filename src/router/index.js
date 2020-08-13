import Vue from 'vue'
import VueRouter from 'vue-router'

import bookMarkCard from "../components/BookMarkCard"
import icomTable from "../components/IcomTable"
import leftNavigationTable from "../components/LeftNavigationTable"


Vue.use(VueRouter);

const routes=[
    {
        path:"/bookMarkCard",
        name:"bookMarkCard",
        component:bookMarkCard
    },
    {
        path:"/icomTable",
        name:"icomTable",
        component:icomTable
    },
    {
        path:"/leftNavigationTable",
        name:"leftNavigationTable",
        component:leftNavigationTable
    },
]

const router = new VueRouter({
    routes
})

export default router;
