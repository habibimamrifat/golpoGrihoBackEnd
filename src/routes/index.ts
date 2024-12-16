import express from "express"
import { UserRouts } from "../app/user/user.routs"
import memberRoutes from "../app/members/member.rout"
import installmenttRout from "../app/innstallmennt/installment.rout"
import adminRouts from "../app/admin/admin.rout"
import precedentOrVpRout from "../app/precedentOrVp/presedentOrvp.router"
import bannerRout from "../app/banner/banner.router"
import investOrExpenncesRouts from "../app/ivestmetOrExpeces/ivestOrExpence.routs"
import authRouts from "../app/auth/auth.routs"
import sendEmailRout from "../app/sendEmail/sendEmail.routs"



const router = express.Router()



const mouleRouts = [
    {
        path:"/users",
        router:UserRouts
    },
    {
        path:"/member",
        router:memberRoutes
    },
    {
        path:"/deposit",
        router:installmenttRout
    },
    {
        path:"/admin",
        router:adminRouts
    },
    {
        path:"/VpOrP",
        router:precedentOrVpRout
    },
    {
        path:"/baner",
        router:bannerRout
    },
    {
        path:"/investOrExpennces",
        router:investOrExpenncesRouts
    },
    {
        path:"/auth",
        router:authRouts
    },
    {
        path:"/email",
        router:sendEmailRout
    }
]


mouleRouts.forEach(route => router.use(route.path, route.router) )

export default router