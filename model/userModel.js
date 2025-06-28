const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const userSchemaRules={
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
}



const userSchema=new mongoose.Schema(userSchemaRules)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

// Add password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const UserModel=mongoose.model("UserModel",userSchema) 
module.exports=UserModel