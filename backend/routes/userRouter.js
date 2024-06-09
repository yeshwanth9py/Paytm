const express = require("express");
const {z} = require("zod");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../db/usersScema");
const { JWT_SECRET } = require("../config");
const auth = require("../middlewares/auth");
const Account = require("../db/accountSchema");


const userSchema = z.object({
    username: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string()
});



userRouter.post("/signup", async (req, res)=>{
    try{
        const {success} = userSchema.safeParse(req.body);
        if(!success){
            return res.json({
                msg: "Incorrect inputs"
            });
        }
        const {username,  firstName, lastName, password} = req.body;
        

        const userdetails = await User.find({username});

        if(userdetails.length>0){
            return res.status(411).json({
                msg: "Email already taken",
                userdetails
            });
        };

        

        const token = jwt.sign({
            username,
            firstName,
            lastName
        },JWT_SECRET );

        const user = await User.create({
            username,
            firstName,
            lastName,
            password
        });

        await Account.create({
            userId: user._id,
            balance: 1+(Math.random()*10000)
        })

        await user.save();

        res.status(200).json({
            msg: "user created successfully",
            token
        });

    } catch(err){
        console.log(err);
        res.status(404).json({
            msg: "some error while signing up"
        });
    }
})

const signinSchema = z.object({
    username: z.string().email(),
    password: z.string()
});

userRouter.post("/signin", async (req, res)=>{
    try{
        const {success} = signinSchema.safeParse(req.body);
        if(!success){
            return res.status(404).json({
                msg: "all fields are not validated"
            });
        }
        const {username, password} = req.body;

        const userd = await User.findOne({username});
        if(!userd){
            return res.status(404).json({
                msg: "details not found in db"
            });
        }

        if(userd.password != password){
            return res.status(404).json({
                msg: "username/password incorrect",
                userd   
            });
        }
        console.log("before token");
        const token = jwt.sign({
            username,
            "firstName": userd.firstName,
            "lastName": userd.lastName
        }, JWT_SECRET);

        return res.json({
            msg: "signed in successfully",
            jwt: token
        });

    } catch(err) {
        console.log(err)
        return res.status(404).json({
            msg: "smt went wrong",
            err
        });
    }
});

const updateschema = z.object({
    password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional()
});

userRouter.put("/", auth, async (req, res)=>{
    const {success} = updateschema.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message: "Error while updating information"
        });
    }

    const newuserd = await User.findOneAndUpdate({ username: req.userd.username }, req.body,
        {
            new: true,             
            runValidators: true    
        }
    );

    res.status(200).json(newuserd);
});



userRouter.get("/bulk", async (req, res)=>{
    const sname = req.query.filter || "";
    
    const userd = await User.find({$or:[{firstName:{"$regex":sname}}, {lastName: {"$regex":sname}}]});

    res.json({
        user: userd.map((c)=>{
            return {
                username: c.username,
                firstName: c.firstName,
                lastName: c.lastName
            }
        })
    });
});


module.exports = {
    userRouter
};