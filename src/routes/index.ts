import express from "express"
import { UserRouts } from "../app/user/user.routs"
import memberRoutes from "../app/members/member.rout"
import installmenttRout from "../app/innstallmennt/installment.rout"
import adminRouts from "../app/admin/admin.rout"



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
    }
]


mouleRouts.forEach(route => router.use(route.path, route.router) )

export default router