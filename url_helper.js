const shortId = require('shortid');
module.exports = function(redisClient){
    return {
        async storeUrl(url){
            let data = await redisClient.get(url);
            if(data) return data; 
            // make new entry
            let id = shortId.generate();
            await redisClient.setEx(id, 600, url);
            // set URL as a key too for searching
            await redisClient.setEx(url, 600, id);
            return id;
        },

        async findUrl(key){
            return await redisClient.get(key);
        }
    }
}