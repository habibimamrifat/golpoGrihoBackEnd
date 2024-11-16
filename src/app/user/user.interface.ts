export type TUser={
    id:string,
    email:string,
    password:string,
    needPasswoedChange:boolean,
    role:"admin"|"member"|"precident"|"vicePrecident",
    status:"activeMember"|"blockedMember",
    requestState:"approved"|"waiting"|"canceled",
    isLoggedIn:boolean,
    isDelited:boolean,
}