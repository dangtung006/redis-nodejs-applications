const redisHelper = require("./redis_helper");
const redisClient = new redisHelper();
const Channel     = "user-notify";

async function initSub(){
    await redisClient.connect();
    await redisClient.subscribe(Channel, async (message)=>{
        console.log(message);
    });
}

initSub();

