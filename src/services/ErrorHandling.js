
/* make my middleware error handling to display error massage 
display for develop error stack to find code error and know the type easlly */ 

export const asyncHandndler = (fun)=>{
    return (req,res,next)=>{

     fun(req,res,next).catch(err=>{

      // res.status(500).json({message: err.message , stack : err.stack}) 
      next (  new Error (err , {cause:500}))
     
     })


    }
} 

// make gloabel function to handling error 
 export const GlobalErrorHandling = ((err ,req,res,next) =>{ 
    if(err){ 
        if(process.env.mode === 'dev'){
         
            res.status(err['cause']||500).json({message:err.message ,stack:err.stack})

        }else{
           
            res.status(err['cause']||500).json({message:err.message })
        }
    
    }

})