import express from "express"
import { UserRouts } from "../app/user/user.routs"
import memberRoutes from "../app/members/member.rout"
import depositRout from "../app/deposits/deposit.rout"


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
        router:depositRout
    }
]


mouleRouts.forEach(route => router.use(route.path, route.router) )

export default router