const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { User } = require("../db/usersScema");


const auth = async (req, res, next)=>{
    try{
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(403).json({
                msg: "no bearer token"
            });     
        }
        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, JWT_SECRET);
        const userd = await User.findOne({username: payload.username});
        req.userd = userd;
        next();
    } catch(err){
        console.log(err);
        res.status(403).json({
            msg: "error in middleware"
        });
    }
    
}

module.exports = auth;