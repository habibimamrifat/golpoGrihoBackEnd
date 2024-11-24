import { UserModel } from "./user.model"

const findLastRegisteredUser = async()=>{
    const lastRgisteredId =await UserModel.findOne({},{id:1}).sort({createdAt:-1})
    return lastRgisteredId?.id.slice(3) || undefined
}

const idGearator = async (lastName :string)=>{
    const currennntId =await findLastRegisteredUser() || (0).toString()
    let covertedId  = (Number(currennntId)+1.).toString().padStart(4,"0")
    covertedId = `${lastName.slice(0,3)}${covertedId}`
    // console.log(covertedId)
    return covertedId
  }

  export default idGearator;