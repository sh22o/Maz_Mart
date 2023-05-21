 import bcrypt from 'bcryptjs'
 import userModel from '../../../../DB/model/User.model.js' 
 import {findOne ,findOneAndUpdate} from '../../../../DB/DBMethods.js'
 import jwt from 'jsonwebtoken' 
 import { nanoid } from 'nanoid'
import {sendEmail} from '../../../services/email.js' 
import {asyncHandndler} from '../../../services/ErrorHandling.js' 
export const signup = asyncHandndler( async (req,res,next)=>{  
 
        // make distructing data 
    const {userName,email,password } = req.body  
    
    //check if db have a email or not 
   // const user = await userModel.findOne({email}).select('email')  
   // secound way by db method 
       const user = await findOne({ model:userModel,filter:{email} , select:'email'})
     if(user){ 
        //409 maen have Conflict >> can not be processed 
       // res.status(409).json({massage:" Email Exist"})  
     return  next( Error (" Email Exist" , {cause:409}))

      
     } else{ 
        // maen email not exist  
        // make hashing for password 
        const hash = bcrypt.hashSync(password, parseInt(process.env.SALTROUND)) 
        const  newUser = new userModel({userName,email,password:hash}) 
        //console.log(newUser)  
        // in development token exp: 2*60 = 2min 
        const token = jwt.sign({id:newUser._id},process.env.emailToken,{expiresIn:'1h'})
        const Reftoken = jwt.sign({id:newUser._id},process.env.emailToken,{expiresIn:'2h'})
        //console.log(token)
        const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}` 
        const linkRef = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/requestEmailToken/${Reftoken}`
        // console.log(link)
        const message = ` 
        <a href=${link}> confirm Email </a> 
        <br>
        <br> 
        <a href=${linkRef}> new confirmation Email </a>
        ` 
        
       const info = await  sendEmail(email,'confirmEmail',message) 
       if(info?.accepted?.length){
         const savedUser= await newUser.save()
      return   res.status(201).json({massage:"Done", userid:savedUser._id})
       }else{
        // res.status(404).json({massage:" Email rejected "})
        // by handling error way 
       return next (Error( 'Email rejected',{cause:404}))
       }

       }



      
      
   }) 
   export const confirmEmail = asyncHandndler(async (req,res,next)=>{  
     
           // make distructing data 
       const {token } = req.params
          // make decoded for token 
          const decode= jwt.verify(token,process.env.emailToken)
        if(!decode?.id){ 
         //   res.status(400).json({massage:"invalid payload"}) 
       return  next (Error( 'invalid payload"',{cause:400}))
        } else{  
         // update confirm email to be true 
             //const user =  await userModel.findOneAndUpdate({_id:decode.id ,confirmEmail:false},{confirmEmail:true})
             const user = await findOneAndUpdate({ model:userModel ,filter:{_id:decode.id ,confirmEmail:false}, data :{confirmEmail:true}
                       , options:{new : true } 
                     })
         return     res.status(200).redirect(process.env.forntendU)     
            }
         } )

   // login function 
   export const login = asyncHandndler(async (req,res,next)=>{  
    
           // make distructing data 
       const {email,password } = req.body  
       //find email for user 
       const user = await findOne({ model:userModel,filter:{email} })
        if(!user){ 
           
          //  res.status(404).json({massage:" Email not Exist " })
        return  next (Error( 'Email not Exist ',{cause:404}))
          
        } else{ 
         if(!confirmEmail){
           // res.status(400).json({massage:" email not confirmed yet  " })
            next (Error( 'email not confirmed yet ',{cause:400}))
         }else{ 
            const match = bcrypt.compareSync(password, user.password) 
      
           if(!match){
           // res.status(400).json({massage:" invalid password " }) 
         return  next (Error( ' invalid password ',{cause:400}))
           
           }else{ 
            const token = jwt.sign({id:user._id,isLoggedIn:true},process.env.tokenSignature,{expiresIn:(60*60)*24}) 
        return    res.status(200).json({massage:"Done", token})

           }

         }
      }
         
   }) 

   // refresh token 

   export const Reftoken = asyncHandndler (async (req,res,next)=>{

    const {token} = req.params
    const decoded= jwt.verify(token,process.env.emailToken) 
          if(!decoded || !decoded.id){
        return    next (Error( 'invalid token',{cause:400}))
          }else{
            const user = await userModel.findById(decoded.id).select('userName email confirmEmail')

            if(!user){
           return   next (Error( 'invalid Account',{cause:400}))
            }else{ 
              if(user.confirmEmail){
             return   res.json(" Account aready confirmed")
              }else{
                // in development 2*60 //2min 
                const token = jwt.sign({id:newUser._id},process.env.emailToken,{expiresIn:'1h'})
                const massage =  `<a href=${linkRef}> new confirmation Email </a> `  
                const info = await  sendEmail(email,'confirmEmail',massage) 
                if(info?.accepted?.length){
                  const savedUser= await newUser.save()
               return   res.status(201).json({massage:"Done", userid:savedUser._id})
                }else{
                 // res.status(404).json({massage:" Email rejected "})
                 // by handling error way 
               return  next (Error( 'Email rejected',{cause:404}))
                }
         


              }

            }
          }

   }) 


   // function for forgetpass // 
   //function for generate code 
    export const sendCode =  asyncHandndler ( async (req, res) =>{
      const { email } = req.body
      const user = await userModel.findOne({ email }).select('userName email')
      if (!user) {
        return  next( Error ("Not register account" , {cause:409}))
      } else {
          const accessCode = nanoid()
          await userModel.findByIdAndUpdate(user._id, { code: accessCode })
          sendEmail(user.email, `<h1>access code :  ${accessCode} </h1>`)
        return  res.status(201).json({massage:"Done check u email"})
      } 
      })



export const forgetPassword = asyncHandndler (async(req, res) => {
  const { email, code, password } = req.body
  if (!code) {
    return   res.json({ message: "Account dosn't require forget password yet!" })
      
  } else {
      const user  = await  userModel.findOne({email , code})
      if (!user) {
       return    res.json({ message: "In-valid account or In-valid OTP code" })
      } else {
          const hashPassword  = await  bcrypt.hash(password , parseInt(process.env.saltRound))
          await userModel.updateOne({_id:user._id} , {code:null , password : hashPassword})
        return   res.json({message:"Done"})
          
      } 
  } 
} 
) 

   
         
         
      