const RedisHelper = require("./redis_helper");
const RedisClient = new RedisHelper();
async function main(){
    await RedisClient.connect();
    require("./app")(RedisClient);
    //let result = await RedisHelper.get("language");
    //let result = await RedisHelper.set("demo", "set Value");
    //let result = await RedisHelper.del("demo");
    //let result = await RedisHelper.exists("language");
    //let result = await RedisHelper.expire("language");
    //let result_1 = await RedisHelper.set("age", 15);
    //let result_1 = await RedisHelper.incr("age");
    //let result_1 = await RedisHelper.incrBy("age", 5);
    //let result_1 = await RedisHelper.hmset("user", { name : "tung", age : 18});
    //let result_1 = await RedisHelper.hGetAll("user");

    //let result_1 = await RedisHelper.rPush("dbs", ["mongodb", "mySql"]);
    // let result_1 = await RedisHelper.lRange("dbs");
    // let result_2 = await RedisHelper.keys("*");
    // console.log("result 111; ", result_1);
    // console.log("result 222; ", result_2);
}

main();