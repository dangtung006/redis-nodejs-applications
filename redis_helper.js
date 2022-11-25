const redis = require("redis");


const  _getRedisValue = (err, reply, taskName= "Redis")=> {
    if(err) {
        console.log(`Err with ${taskName} : `, err);
        return null;
    }
    return reply;
}

const  _handleRequest = (promise) => promise.then(data=>[undefined, data]).catch(err=>[err, undefined])


class RedisClient{

    constructor(opts){
        this.opts = opts;
        if(!this.opts) this.opts = {};
        this.opts.host = this.opts.host ? this.opts.host : "localhost";
        this.opts.port = this.opts.port ? this.opts.port : "6379";
        this.client = redis.createClient({host :  this.opts.host , port : this.opts.port});

        this.client.on("error", function(e){
            console.log("redis error : ", e);
        });

        this.client.on("connect", function(){
            console.log("Redis connected!!!");
        })

    }

    async connect(){
        await this.client.connect();
    }

    async get(key){
        let [err, result] = await _handleRequest(this.client.get(key));
        return _getRedisValue(err, result, "Redis Get");
    }

    async set(key, value){
        let [err, result] = await _handleRequest(this.client.set(key, value));
        return _getRedisValue(err, result, "Redis Set") == "OK";
    }

    async setEx(key, seconds, value){
        let [err, result] = await _handleRequest(this.client.setEx(key, seconds, value));
        return _getRedisValue(err, result, "Redis Set Ex") == "OK";
    }

    async del(key){
        let [err, result] = await _handleRequest(this.client.del(key));
        return _getRedisValue(err, result, "Redis Del") == 1;
    }

    async exists(key){
        let [err, result] = await _handleRequest(this.client.exists(key));
        return _getRedisValue(err, result, "Redis Exist") == 1;
    }

    async expire(key){
        let [err, result] = await _handleRequest(this.client.expire(key, 30));
        return _getRedisValue(err, result, "Redis Expire");
    }

    async keys(keyPattern){
        let [err, result] = await _handleRequest(this.client.keys(keyPattern));
        return _getRedisValue(err, result, "Redis List Key");
    }

    async getTypeByKey(key){
        let [err, result] = await _handleRequest(this.client.type(key));
        return _getRedisValue(err, result, "Redis Type");
    }

    async incr(key){
        let [err, result] = await _handleRequest(this.client.incr(key));
        return _getRedisValue(err, result, "Redis incr Key");
    }

    async incrBy(key, value){
        let [err, result] = await _handleRequest(this.client.incrBy(key, value));
        return _getRedisValue(err, result, "Redis incr Key");
    }

    //hash
    async hset(key, obj){
        let [err, result] = await _handleRequest(this.client.hSet(key, obj));
        return _getRedisValue(err, result, "Redis hset ");
    }

    async hGetAll(key){
        let [err, result] = await _handleRequest(this.client.hGetAll(key));
        console.log(typeof _getRedisValue(err, result, "Redis hGetAll Key"));
        return _getRedisValue(err, result, "Redis hGetAll");
    }

    //list
    async rPush(key, list){
        // list  = [key].concat(list);
        // console.log("list : ", list);
        let [err, result] = await _handleRequest(this.client.rPush(key,list));
        return _getRedisValue(err, result, "Redis rpush");
    }

    async lRange(key, start=0, stop=100000){
        let [err, result] = await _handleRequest(this.client.lRange(key, start, stop));
        return _getRedisValue(err, result, "Redis lRange");
    }

    //
    async sAdd(key){
        //members : array;
        let [err, result] = await _handleRequest(this.client.sAdd(key, members));
        return _getRedisValue(err, result, "Redis sMember");
    }

    async sMember(key){
        let [err, result] = await _handleRequest(this.client.sMembers(key));
        return _getRedisValue(err, result, "Redis sMember");
    }


    // Message Broker;
    //subribe;
    async subscribe(channel, cb){
        let [err, result] = await _handleRequest(this.client.subscribe(channel, cb));
        return _getRedisValue(err, result, "Redis sub");
    }

    //publish;
    async publish(channel, message){
        let data   = message;
        if (typeof(data)!="string") {
            data   = JSON.stringify(data);
        }
        let [err, result] = await _handleRequest(this.client.publish(channel, data));
        return _getRedisValue(err, result, "Redis Pub") == 1;
    }

}

module.exports = RedisClient;