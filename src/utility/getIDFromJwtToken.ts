import jwt, { JwtPayload } from "jsonwebtoken"
import config from "../config"
const getIdFromJwtToken = (token:string)=>{
    const decoded = jwt.verify(token, config.jwtTokennSecret as string) as JwtPayload

    const {id}=decoded
    return id

}
export default getIdFromJwtToken