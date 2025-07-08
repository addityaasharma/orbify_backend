import { createClient } from 'redis'

export const redisClient = createClient({
    url: process.env.REDIS_URL,
})

redisClient.on('error', (err) => {
    console.error('❌ Redis connection error:', err)
})

redisClient.on('connect', () => {
    console.log('✅ Connected to Redis Cloud')
})

await redisClient.connect()