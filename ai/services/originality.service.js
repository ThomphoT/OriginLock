const similarityService =
    require('./similarity.service');

const ollamaService =
    require('./ollama.service');

const {
    buildOriginalityPrompt
} = require('../prompts/originality.prompt');


/**
 * ----------------------------------------
 * ANALYZE ORIGINALITY
 * ----------------------------------------
 */
async function analyzeOriginality({
    title,
    description,
    existingIdeas = []
}) {

    try {

        /**
         * Build full idea text
         */
        const fullIdeaText = `
Title:
${title}

Description:
${description}
`;

        /**
         * ----------------------------------------
         * STEP 1
         * FIND SIMILAR IDEAS
         * ----------------------------------------
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
         * ----------------------------------------
         * STEP 2
         * FILTER RELEVANT MATCHES
         * ----------------------------------------
         */
        const similarityThreshold = 0.45;

        const filteredMatches =
            similarityResult.matches.filter(
                match =>
                    match.similarity >=
                    similarityThreshold
            );

        /**
         * ----------------------------------------
         * STEP 3
         * LIMIT TOP MATCHES
         * ----------------------------------------
         */
        const topMatches =
            filteredMatches.slice(0, 5);

        /**
         * ----------------------------------------
         * STEP 4
         * BUILD AI PROMPT
         * ----------------------------------------
         */
        const prompt =
            buildOriginalityPrompt(
                fullIdeaText,
                topMatches
            );

        /**
         * ----------------------------------------
         * STEP 5
         * GENERATE AI ANALYSIS
         * ----------------------------------------
         */
        const aiResult =
            await ollamaService.generate(prompt);

        if (!aiResult.success) {

            return {
                success: false,
                error: aiResult.error,
                fallback: aiResult.fallback
            };
        }

        /**
         * ----------------------------------------
         * STEP 6
         * BUILD RESPONSE
         * ----------------------------------------
         */
        return {
            success: true,

            originalityAnalysis:
                aiResult.data,

            metadata: {
                analyzedIdeas:
                    existingIdeas.length,

                similarIdeasFound:
                    topMatches.length,

                similarityThreshold
            },

            similarIdeas:
                topMatches
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