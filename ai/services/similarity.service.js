const ollamaService =
    require('./ollama.service');


/**
 * ----------------------------------------
 * COSINE SIMILARITY
 * ----------------------------------------
 */
function cosineSimilarity(vecA, vecB) {

    /**
     * Safety checks
     */
    if (!Array.isArray(vecA) ||
        !Array.isArray(vecB)) {

        throw new Error(
            'Both inputs must be arrays'
        );
    }

    if (vecA.length !== vecB.length) {

        throw new Error(
            'Vectors must have same length'
        );
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

    /**
     * Prevent divide-by-zero
     */
    if (magnitudeA === 0 ||
        magnitudeB === 0) {

        return 0;
    }

    return dotProduct /
        (magnitudeA * magnitudeB);
}


/**
 * ----------------------------------------
 * FIND SIMILAR IDEAS
 * ----------------------------------------
 */
async function findSimilarIdeas(
    newIdeaText,
    existingIdeas = []
) {

    try {

        const startTime = Date.now();

        /**
         * ----------------------------------------
         * GENERATE NEW IDEA EMBEDDING
         * ----------------------------------------
         */
        const newEmbeddingResult =
            await ollamaService.generateEmbedding(
                newIdeaText
            );

        if (!newEmbeddingResult.success) {

            return {
                success: false,
                error:
                    'Failed to generate embedding for new idea'
            };
        }

        const newEmbedding =
            newEmbeddingResult.embedding;

        const similarityResults = [];

        /**
         * ----------------------------------------
         * LOOP THROUGH EXISTING IDEAS
         * ----------------------------------------
         */
        for (const idea of existingIdeas) {

            try {

                /**
                 * Skip invalid ideas
                 */
                if (!idea.title &&
                    !idea.description) {

                    continue;
                }

                const existingIdeaText = `
Title:
${idea.title || ''}

Description:
${idea.description || ''}
`;

                /**
                 * Generate embedding
                 */
                const existingEmbeddingResult =
                    await ollamaService.generateEmbedding(
                        existingIdeaText
                    );

                if (!existingEmbeddingResult.success) {

                    continue;
                }

                /**
                 * Calculate similarity
                 */
                const similarityScore =
                    cosineSimilarity(
                        newEmbedding,
                        existingEmbeddingResult.embedding
                    );

                /**
                 * Normalize score
                 */
                const normalizedScore =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            similarityScore
                        )
                    );

                similarityResults.push({
                    id: idea.id,

                    title: idea.title,

                    description:
                        idea.description,

                    similarity:
                        Number(
                            normalizedScore
                                .toFixed(4)
                        )
                });

            } catch (innerError) {

                console.error(
                    'Idea similarity error:',
                    innerError.message
                );

                continue;
            }
        }

        /**
         * ----------------------------------------
         * SORT HIGHEST FIRST
         * ----------------------------------------
         */
        similarityResults.sort(
            (a, b) =>
                b.similarity - a.similarity
        );

        /**
         * ----------------------------------------
         * REMOVE DUPLICATES
         * ----------------------------------------
         */
        const uniqueResults = [];

        const seenIds = new Set();

        for (const result of similarityResults) {

            if (seenIds.has(result.id)) {
                continue;
            }

            seenIds.add(result.id);

            uniqueResults.push(result);
        }

        const endTime = Date.now();

        return {
            success: true,

            matches: uniqueResults,

            metadata: {
                totalIdeasChecked:
                    existingIdeas.length,

                matchesFound:
                    uniqueResults.length,

                processingTimeMs:
                    endTime - startTime
            }
        };

    } catch (error) {

        console.error(
            'Similarity Service Error:',
            error.message
        );

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