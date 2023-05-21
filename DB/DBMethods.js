



// find method  
// make this function named function = object not positional function  
export const find = async  ({model ,filter={}, select='', populate=[],skip=0,limit=10 }={})=>{ 
    const result = await model.find(filter).select(select).skip(skip).limit(limit).populate(populate) 
    return result ; 

 

}  
export const findOne = async  ({model ,filter={}, select='' , populate=[]}={})=>{ 
    const result = await model.findOne(filter).select(select).populate(populate) 
    return result ; 

 

}  
export const findbyId = async ({ model, filter = {}, populate = [], select = "" } = {}) => {
    const result = await model.findbyId(filter).select(select).populate(populate)
    return result
}  





// update 

export const findOneAndUpdate= async ({ model ,filter={} , data={} ,options={},select=" ", populate=[]}={})=>{ 

    const result =  await model.findOneAndUpdate (filter ,data , options).select(select).populate(populate)
    
    return result ; 

} 


export const findByIdAndUpdate= async ({ model ,filter={} , data={} ,options={},select=" ", populate=[]}={})=>{ 

    const result =  await model.findByIdAndUpdate(filter ,data , options).select(select).populate(populate)
    
    return result ; 

} 

export const updateOne= async ({ model ,filter={} , data={} })=>{ 

    const result =  await model.updateOne(filter ,data )
    
    return result ; 

}


// delete 

export const findOneAndDelete= async ({ model ,filter={} , data={} ,select=" ", populate=[]}={})=>{ 

    const result =  await model.findOneAndDelete(filter ,data ).select(select).populate(populate)
    
    return result ; 

}

export const findByIdAndDelete= async ({ model ,filter={} , data={} ,select=" ", populate=[]}={})=>{ 

    const result =  await model.findByIdAndDelete(filter ,data ).select(select).populate(populate)
    
    return result ; 

} 

export const DeleteOne= async ({ model ,filter={} , data={} })=>{ 

    const result =  await model.DeleteOne(filter ,data )
    
    return result ; 

} 


// create 

export const create= async({ model , data={} }={})=>{ 

    const result = await model.create(data)
    
    return result ; 

}  
export const createAndSave= async ({ model  , data={} }={})=>{ 

   const newObject = new model(data) 
   const saveObject= await newObject.save()
    
    return saveObject; 

} 
 
export const insertMany= async ({ model  , data=[{}] }={})=>{ 

   const result = await model.insertMany(data) 
   return result
 
 } 