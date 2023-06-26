import redisClient from '.utils/redis';

(async () => {
  console.log(redisClient.isAlive());
  console.log(await redisClient.getAsync('myKey'));
  await redisClient.setAsync('myKey', 12, 5);
  console.log(await redisClient.getAsync('myKey'));

  setTimeout(async () => {
    console.log(await redisClient.getAsync('myKey'));
  }, 1000 * 10);
})();
