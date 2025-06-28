const mongoose=require("mongoose")
const recipeSchemaRules={
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    ingredients:{
        type:String,
        required:true,
    },
    instructions:{
        type:String,
        required:true,
    },
    author:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        required:false
    },  
    createdAt:{
        type:Date,
        default:Date.now()
    }
}



const recipeSchema=new mongoose.Schema(recipeSchemaRules)

const RecipeModel=mongoose.model("RecipeModel",recipeSchema) 
module.exports=RecipeModel