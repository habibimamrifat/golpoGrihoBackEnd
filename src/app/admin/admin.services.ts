import memberModel from "../members/member.model"

const findAllMember =async ()=>{
    const result =await memberModel.find().populate("installmentList")
    return result;
}

export const adminServeces ={findAllMember}