require('dotenv').config();

const axios = require('axios');

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL;
const EMBED_MODEL = process.env.EMBED_MODEL;

/**
 * Generate AI text response
 */
async function generate(prompt, model = OLLAMA_MODEL) {
    try {
        const response = await axios.post(
            `${OLLAMA_BASE_URL}/api/generate`,
            {
                model,
                prompt,
                stream: false
            }
        );

        return {
            success: true,
            data: response.data.response
        };

    } catch (error) {
        console.error('Ollama Generate Error:', error.message);

        return {
            success: false,
            error: 'AI generation failed',
            details: error.message
        };
    }
}

/**
 * Generate embeddings for semantic similarity
 */
async function generateEmbedding(text) {
    try {
        const response = await axios.post(
            `${OLLAMA_BASE_URL}/api/embeddings`,
            {
                model: EMBED_MODEL,
                prompt: text
            }
        );

        return {
            success: true,
            embedding: response.data.embedding
        };

    } catch (error) {
        console.error('Embedding Error:', error.message);

        return {
            success: false,
            error: 'Embedding generation failed',
            details: error.message
        };
    }
}

/**
 * Health check for Ollama server
 */
async function healthCheck() {
    try {
        const response = await axios.get(`${OLLAMA_BASE_URL}`);

        return {
            success: true,
            message: 'Ollama server is running'
        };

    } catch (error) {
        return {
            success: false,
            message: 'Ollama server is unavailable'
        };
    }
}

module.exports = {
    generate,
    generateEmbedding,
    healthCheck
};