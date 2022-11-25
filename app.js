const PORT    = 3000;
const express = require("express");
const app     = express();
const axios = require('axios');
const moment = require("moment");
//redis-server
//redis-cli

function initApp(RedisClient){
    const urlHelper = require("./url_helper")(RedisClient);

    const getUserFromRedis = async function(req, res, next){
        let key    = req.query.key; //user_list
        let cached = await RedisClient.get(key);
        if(!cached) return next();
        return res.send({data : JSON.parse(cached)});
    }
    
    const fetchUserApi   = async function(req, res){
        let key      = req.query.key;
        let { data } = await axios.get(`https://jsonplaceholder.typicode.com/users/`); 
        await RedisClient.setEx(key, 600, JSON.stringify(data));
        return res.send({ data : data });
    }

    //Middleware Limit api call;
    app.use(async (req, res, next)=>{
        //req.headers.user;
        let key    = req.query.token ? req.query.token : "";
        console.log("token : " , key);
        if(!key) return res.send("Bad request");
        let isExist = await RedisClient.exists(key);

        if(!isExist) return _initRate();

        let data  = await RedisClient.get(key);
        data      = JSON.parse(data);

        let currentTime = moment().unix();
        let difference = (currentTime - data.startTime)/60; // limit 3 times in 1 mininutes;

        if(difference >= 1) return _initRate();
        if(data.count > 10) return res.send("To many request, try later")

        data.count++;
        newRate = await RedisClient.set(key, JSON.stringify(data));
        if(!newRate)   return res.send("request fail, try again");
        return next();

        async function _initRate(){
            let rateInfo = { 
                'count': 1,
                'startTime': moment().unix() 
            }

            let result = await RedisClient.set(key, JSON.stringify(rateInfo));
            if(result) return next();
            return res.send("request fail, try again");
        }
    })
    

    app.get('/', (req, res)=>{
        res.sendFile(__dirname + '/views/short_url.html');
    });

    //save shorten url to redis
    app.get('/api/short', async(req, res)=>{
        let url = req.query.url.trim();
        let shorten = await urlHelper.storeUrl(url);
        let fullUrl = req.protocol + '://' + req.get('host') 
        res.send(fullUrl + '/' + shorten);
    });

    //get code verify from redis and send to user by mail;
    app.post("/send_verify", async(req, res)=>{

    });

    // verify code by link;
    app.get("/verify", async(req, res)=>{

    });

    //get url from redis and redirect;
    app.get("/:url", async (req, res)=>{
        console.log("req.params.url : ", req.params.url);
        let url = await urlHelper.findUrl(req.params.url);
        if(!url) return res.send("invalid/expired URL");
        res.redirect(url);
    });

    //cached mongodb data by redis;
    app.get("api/product", async (req, res, next)=>{

    });

    //cached api data by redis
    app.get("/api/user",getUserFromRedis, fetchUserApi);

    app.listen(PORT, ()=>{
        console.log(`Server Start AT ${PORT}`);
    })
}

module.exports = initApp;
