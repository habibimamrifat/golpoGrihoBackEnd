import { Response } from "express";

type TData <T>= {
    status:number,
    success:boolean,
    message?:string,
    data:T

}

const responseHandeler = <T>(res:Response, data:TData<T>)=>{
    res.status(data.status).json({
        success:data.success,
        message:data.message,
        data:data.data
    })
}

export default responseHandeler