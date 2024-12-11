import jwt from "jsonwebtoken"


const createToken = (
    tokenizeData:Record<string,any>,
    tokenSecret:string,
    expiresIn:string

)=>{
    const token = jwt.sign(
        tokenizeData,
        tokenSecret,
        {expiresIn:expiresIn},
      );
      return token
}
export default createToken