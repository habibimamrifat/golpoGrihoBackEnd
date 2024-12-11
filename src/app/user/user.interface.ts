import { UserRole } from "./user.constant"


export type TUser={
    id:string,
    email:string,
    password:string,
    needPasswoedChange:boolean,
    passwordChangeTime?:Date,
    role:"admin"|"member"|"precident"|"vicePrecident",
    status:"activeMember"|"blockedMember",
    requestState:"approved"|"waiting"|"canceled",
    isLoggedIn:boolean,
    logOutTime?:Date,
    isDelited:boolean,
}

export type TUserRole = keyof typeof UserRole