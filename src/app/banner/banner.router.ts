import express from "express"
import { bannerController } from "./banner.controller"


const bannerRout = express.Router()

bannerRout.get("/getBanner",bannerController.getBanner)

export default bannerRout