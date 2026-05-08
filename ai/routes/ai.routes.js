const express = require('express');

const router = express.Router();

const ollamaService = require('../services/ollama.service');

const originalityService = require('../services/originality.service');

const {
    buildTitleSuggestionPrompt,
    buildDescriptionPrompt,
    buildImprovementPrompt
} = require('../prompts/suggestions.prompt');


/**
 * ----------------------------------------
 * HEALTH CHECK
 * GET /api/ai/health
 * ----------------------------------------
 */
router.get('/health', async (req, res) => {

    try {

        const result =
            await ollamaService.healthCheck();

        if (!result.success) {

            return res.status(500).json(result);
        }

        return res.json(result);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            error: 'Health check failed'
        });
    }
});


/**
 * ----------------------------------------
 * SUGGEST TITLES
 * POST /api/ai/suggest-title
 * ----------------------------------------
 */
router.post('/suggest-title', async (req, res) => {

    try {

        const { description } = req.body;

        if (!description) {

            return res.status(400).json({
                success: false,
                error: 'Description is required'
            });
        }

        const prompt =
            buildTitleSuggestionPrompt(description);

        const result =
            await ollamaService.generate(prompt);

        if (!result.success) {

            return res.status(500).json(result);
        }

        const suggestions =
            result.data
                .split('\n')
                .map(item => item.trim())
                .filter(Boolean);

        return res.json({
            success: true,
            suggestions
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            error: 'Failed to generate titles'
        });
    }
});


/**
 * ----------------------------------------
 * SUGGEST DESCRIPTION
 * POST /api/ai/suggest-description
 * ----------------------------------------
 */
router.post('/suggest-description', async (req, res) => {

    try {

        const { title } = req.body;

        if (!title) {

            return res.status(400).json({
                success: false,
                error: 'Title is required'
            });
        }

        const prompt =
            buildDescriptionPrompt(title);

        const result =
            await ollamaService.generate(prompt);

        if (!result.success) {

            return res.status(500).json(result);
        }

        return res.json({
            success: true,
            description: result.data
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            error: 'Failed to generate description'
        });
    }
});


/**
 * ----------------------------------------
 * CHECK ORIGINALITY
 * POST /api/ai/check-originality
 * ----------------------------------------
 */
router.post('/check-originality', async (req, res) => {

    try {

        const {
            title,
            description,
            existingIdeas = []
        } = req.body;

        if (!title || !description) {

            return res.status(400).json({
                success: false,
                error: 'Title and description are required'
            });
        }

        const result =
            await originalityService.analyzeOriginality({
                title,
                description,
                existingIdeas
            });

        if (!result.success) {

            return res.status(500).json(result);
        }

        return res.json(result);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            error: 'Originality analysis failed'
        });
    }
});


/**
 * ----------------------------------------
 * IMPROVE IDEA
 * POST /api/ai/improve
 * ----------------------------------------
 */
router.post('/improve', async (req, res) => {

    try {

        const {
            title,
            description
        } = req.body;

        if (!title || !description) {

            return res.status(400).json({
                success: false,
                error: 'Title and description are required'
            });
        }

        const prompt =
            buildImprovementPrompt(
                title,
                description
            );

        const result =
            await ollamaService.generate(prompt);

        if (!result.success) {

            return res.status(500).json(result);
        }

        return res.json({
            success: true,
            improvementAnalysis: result.data
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            error: 'Idea improvement failed'
        });
    }
});


module.exports = router;