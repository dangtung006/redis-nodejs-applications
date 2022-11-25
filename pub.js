const redisHelper = require("./redis_helper");
const redisClient = new redisHelper();
const Channel     = "user-notify";

async function initPub(){
    const user = {
        id: "123456",
        name: "Davis",
    }

    await redisClient.connect();
    let result = await redisClient.publish(Channel, user);
    console.log("result : ", result);
}

initPub();