const similarityService = require('./similarity.service');

const ollamaService = require('./ollama.service');

const {
    buildOriginalityPrompt
} = require('../prompts/originality.prompt');


/**
 * Analyze originality of a new idea
 */
async function analyzeOriginality({
    title,
    description,
    existingIdeas = []
}) {

    try {

        const fullIdeaText = `
Title: ${title}

Description:
${description}
`;

        /**
         * STEP 1:
         * Find semantically similar ideas
         */
        const similarityResult =
            await similarityService.findSimilarIdeas(
                fullIdeaText,
                existingIdeas
            );

        if (!similarityResult.success) {
            return {
                success: false,
                error: similarityResult.error
            };
        }

        /**
         * STEP 2:
         * Take top matches only
         */
        const topMatches =
            similarityResult.matches.slice(0, 5);

        /**
         * STEP 3:
         * Build originality prompt
         */
        const prompt =
            buildOriginalityPrompt(
                fullIdeaText,
                topMatches
            );

        /**
         * STEP 4:
         * Generate AI analysis
         */
        const aiResult =
            await ollamaService.generate(prompt);

        if (!aiResult.success) {
            return {
                success: false,
                error: aiResult.error
            };
        }

        /**
         * STEP 5:
         * Return final analysis
         */
        return {
            success: true,

            originalityAnalysis: aiResult.data,

            similarIdeas: topMatches
        };

    } catch (error) {

        console.error(
            'Originality Service Error:',
            error.message
        );

        return {
            success: false,
            error: 'Originality analysis failed',
            details: error.message
        };
    }
}

module.exports = {
    analyzeOriginality
};