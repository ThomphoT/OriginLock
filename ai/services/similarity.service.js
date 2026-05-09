const ollamaService = require('./ollama.service');

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {

    if (vecA.length !== vecB.length) {
        throw new Error('Vectors must have same length');
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] * vecA[i];
        magnitudeB += vecB[i] * vecB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Find similar ideas
 */
async function findSimilarIdeas(newIdeaText, existingIdeas = []) {

    try {

        // Generate embedding for new idea
        const newEmbeddingResult =
            await ollamaService.generateEmbedding(newIdeaText);

        if (!newEmbeddingResult.success) {
            return {
                success: false,
                error: 'Failed to generate embedding for new idea'
            };
        }

        const newEmbedding = newEmbeddingResult.embedding;

        const similarityResults = [];

        for (const idea of existingIdeas) {

            // Generate embedding for existing idea
            const existingEmbeddingResult =
                await ollamaService.generateEmbedding(
                    `${idea.title} ${idea.description}`
                );

            if (!existingEmbeddingResult.success) {
                continue;
            }

            const similarityScore = cosineSimilarity(
                newEmbedding,
                existingEmbeddingResult.embedding
            );

            similarityResults.push({
                id: idea.id,
                title: idea.title,
                description: idea.description,
                similarity: Number(similarityScore.toFixed(4))
            });
        }

        // Sort highest similarity first
        similarityResults.sort(
            (a, b) => b.similarity - a.similarity
        );

        return {
            success: true,
            matches: similarityResults
        };

    } catch (error) {

        console.error('Similarity Service Error:', error.message);

        return {
            success: false,
            error: 'Similarity search failed',
            details: error.message
        };
    }
}

module.exports = {
    cosineSimilarity,
    findSimilarIdeas
};