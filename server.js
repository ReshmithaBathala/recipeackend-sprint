const express=require("express")
const dotenv=require("dotenv")
const mongoose=require("mongoose")
const jwt = require("jsonwebtoken");
dotenv.config();
const UserModel=require("./model/userModel")
const RecipeModel=require('./model/recipeModel')

const {DB_USER,DB_PASSWORD}=process.env
const PORT=process.env.PORT || 5000

// console.log({ PORT, DB_USER, DB_PASSWORD });


const app=express()

const dbURL=`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.oe1lm2i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(dbURL).then(function(connection){
    console.log("Connection success")
}).catch(err=>console.log(err))





app.use(express.json())

// API's
//1. Add user POST
// app.post("/api/user",createUserHandler);
// //2. get all users
// app.get("/api/user",getAllUsers);
// //3. get user by ID
// app.get("/api/user/:userId",getUserById)
// //4. delete user by ID
// app.delete("/api/user/:userId",deleteUserById)
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // you can use req.user.id in protected routes
    next();
  } catch (err) {
    res.status(401).json({ status: "fail", message: "Invalid token" });
  }
};

app.post("/api/r",createRecipeHandler)

app.get("/api/r",authMiddleware,getAllR);

app.get("/api/r/:rId",authMiddleware,getRById)

app.delete("/api/r/:rId",authMiddleware,deleteRById)



app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: "failure", message: "Email already registered" });
    }

    const newUser = await UserModel.create({ name, email, password, confirmPassword });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      user: { name: newUser.name, email: newUser.email }
    });
  } catch (err) {
    res.status(400).json({ status: "failure", message: err.message });
  }
});


app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      token
    });
  } catch (err) {
    res.status(401).json({ status: "failure", message: err.message });
  }
});



async function createRecipeHandler(req,res){
    try{
        const recipeDetails=req.body
        const recipe=await RecipeModel.create(recipeDetails)
        res.status(200).json({
            status:"Success",
            message:`added the recipe`,
            recipe
        })
    }catch(err){
        res.status(500).json({
            status:"failure",
            message:err.message
        })
    }
}

async function getAllR(req,res) {
    try{
        const recipeDataStore=await RecipeModel.find()
        if(recipeDataStore.length==0){
            throw new Error("No users found")
        }
        res.status(200).json({
             status:"success",
             message:recipeDataStore
        })

    }catch(err){
        res.status(404).json({
            status:"failure",
            message:err.message
        })
    }
}

async function getRById(req,res) {
    try{
        const rId=req.params.rId 
        // console.log(userId)
        const rDetails=await RecipeModel.findById(rId)
        if(!rDetails){
            throw new Error(`user found with ${rId} not found`)
        }else{
            res.status(200).json({
                status:"success",
                message:rDetails
            })
        }

    }catch(err){
        res.status(404).json({
            status:"failure",
            message:err.message
        })
    }
}

async function deleteRById(req,res){
        try{
            const rId=req.params.rId
            let element = await RecipeModel.findByIdAndDelete(rId);
            if(!rId){
                    return res.status(404).json({
                    status: "failure",
                    message: `Element with id:${rId} not found to delete`
                });
            }
            res.status(200).json({
                status:"successfull Deletion",
                message:element
            })
        }catch(err){
            res.status(204).json({
                status:"failure",
                message:`element with id:${rId} not found to delete`
            })
        }
}

app.use(function(req,res){
    res.status(404).json({
        status:"failure",
        message:"404 Page Not Found"
    })
})

app.listen(PORT,()=>{
    console.log(`Server running at this port ${PORT}`)
})