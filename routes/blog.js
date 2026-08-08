const express=require("express");
const router=express.Router();


const {dummyLink} =require("../controllers/likeController");

router.get("/dummyroute",dummyLink);

module.exports= router;