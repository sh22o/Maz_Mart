
import joi from 'joi' 
 export const signup = {
    body: joi.object().required().keys({
        userName: joi.string().min(2).max(20).required(),
        email: joi.string().email().required(),
        password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
        cpassword: joi.string().valid(joi.ref('password')).required(),
    })
}

// login validation  

export const login = {
    body: joi.object().required().keys({
        email: joi.string().email().required(),
        password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
      
    })
}

// for token 

export const token = {
    params: joi.object().required().keys({
        token: joi.string().min(10).required(),
       
    })
}































/*export const signup = { 
    body: joi.object().required().keys({
    userName:joi.string().min(2).max(20).required().message({
        'any.required':" userName is required ",
        'any.empty':"empty userName is not accepted ",

    }),
    email:joi.string().email().required().message({
        'any.required':" userName is required ",
        'any.empty':"empty userName is not accepted ",

    }),
    password:joi.string().pattern( new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)).required().message({
       

    }), 
    cpassword:joi.string().valid(joi.ref('password')).required().message({
        'any.required':" password  is required ",
        'any.empty':"empty password is not accepted ",
       

    }) 
    // write national id validation for maz-mart form 












    })

}*/