require('dotenv').config({
    path: require('path').resolve(__dirname, '../.env')
});
   
const axios = require('axios');

const crypto = require('crypto');

const {
    setCache,
    getCache
} = require('../utils/cache');


const OLLAMA_BASE_URL =
    process.env.OLLAMA_BASE_URL;

const OLLAMA_MODEL =
    process.env.OLLAMA_MODEL;

const EMBED_MODEL =
    process.env.EMBED_MODEL;


/**
 * ----------------------------------------
 * CREATE CACHE KEY
 * ----------------------------------------
 */
function createCacheKey(input) {

    return crypto
        .createHash('sha256')
        .update(input)
        .digest('hex');
}


/**
 * ----------------------------------------
 * GENERATE AI RESPONSE
 * ----------------------------------------
 */
async function generate(
    prompt,
    model = OLLAMA_MODEL
) {

    try {

        /**
         * Check cache first
         */
        const cacheKey =
            createCacheKey(prompt);

        const cached =
            getCache(cacheKey);

        if (cached) {

            console.log('Serving from cache');

            return {
                success: true,
                data: cached,
                cached: true
            };
        }

        /**
         * MODERN OLLAMA CHAT API
         */
        const response = await axios.post(
            `${OLLAMA_BASE_URL}/api/chat`,
            {
                model,

                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],

                stream: false
            },
            {
                timeout: 120000
            }
        );

        const aiText =
            response.data.message.content;

        /**
         * Store in cache
         */
        setCache(
            cacheKey,
            aiText
        );

        return {
            success: true,
            data: aiText,
            cached: false
        };

    } catch (error) {

        console.error(
            'Ollama Generate Error:',
            error.message
        );

        return {
            success: false,
            error: 'AI service temporarily unavailable',
            fallback: true,
            details: error.message
        };
    }
}


/**
 * ----------------------------------------
 * GENERATE EMBEDDING
 * ----------------------------------------
 */
async function generateEmbedding(text) {

    try {

        /**
         * Cache embeddings too
         */
        const cacheKey =
            createCacheKey(
                `embedding-${text}`
            );

        const cached =
            getCache(cacheKey);

        if (cached) {

            return {
                success: true,
                embedding: cached,
                cached: true
            };
        }

        const response = await axios.post(
            `${OLLAMA_BASE_URL}/api/embeddings`,
            {
                model: EMBED_MODEL,
                prompt: text
            },
            {
                timeout: 120000
            }
        );

        const embedding =
            response.data.embedding;

        /**
         * Cache embedding
         */
        setCache(
            cacheKey,
            embedding
        );

        return {
            success: true,
            embedding,
            cached: false
        };

    } catch (error) {

        console.error(
            'Embedding Error:',
            error.message
        );

        return {
            success: false,
            error: 'Embedding generation failed',
            details: error.message
        };
    }
}


/**
 * ----------------------------------------
 * HEALTH CHECK
 * ----------------------------------------
 */
async function healthCheck() {

    try {

        await axios.get(
            OLLAMA_BASE_URL,
            {
                timeout: 5000
            }
        );

        return {
            success: true,
            message: 'Ollama server is running',
            model: OLLAMA_MODEL,
            embeddingModel: EMBED_MODEL
        };

    } catch (error) {

        return {
            success: false,
            message: 'Ollama server unavailable',
            details: error.message
        };
    }
}


module.exports = {
    generate,
    generateEmbedding,
    healthCheck
};