import { NextFunction, Request, Response } from "express"
import { UserModel } from "../app/user/user.model"
import asyncCatch from "../utility/asynncCatch"
import  jwt, { JwtPayload }  from "jsonwebtoken"
import config from "../config"
import { TUserRole } from "../app/user/user.interface"


const auth=(...requeredUserRole:TUserRole[])=>{
    return (
        asyncCatch(async (req:Request, res:Response, next:NextFunction)=>{
           
           const authorizatioToken = req?.headers?.authorization
        //    console.log(authorizatioToken)
           if(!authorizatioToken)
           {
            throw Error("UnAuthorised User")
           }

           jwt.verify(authorizatioToken, config.jwtTokennSecret as string, function(err, decoded) {
            if(err)
            {
                throw Error("tocan decodaing Failed")
            }
            else if (decoded)
            {
                console.log("decoded", decoded)
                
                const decodedRole = (decoded as JwtPayload).role
                if(requeredUserRole && ! requeredUserRole.includes(decodedRole))
                {
                    throw Error("UnAuthorised User")
                }

                req.user = decoded as JwtPayload
                next()
            }
          });
            
        })
    )
}
export default auth