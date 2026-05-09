require('dotenv').config({
    path: require('path').resolve(__dirname, '.env')
});

const ollamaService =
    require('./services/ollama.service');

const originalityService =
    require('./services/originality.service');


/**
 * ----------------------------------------
 * TEST AI GENERATION
 * ----------------------------------------
 */
async function testGeneration() {

    console.log(`
========================================
TESTING AI GENERATION
========================================
`);

    const result =
        await ollamaService.generate(
            'Give me one startup idea.'
        );

    console.log(result);

    console.log(`
========================================
GENERATION TEST COMPLETE
========================================
`);
}


/**
 * ----------------------------------------
 * TEST EMBEDDINGS
 * ----------------------------------------
 */
async function testEmbeddings() {

    console.log(`
========================================
TESTING EMBEDDINGS
========================================
`);

    const embeddingResult =
        await ollamaService.generateEmbedding(
            'AI-powered grocery management platform'
        );

    console.log({
        success:
            embeddingResult.success,

        embeddingLength:
            embeddingResult.embedding?.length,

        cached:
            embeddingResult.cached
    });

    console.log(`
========================================
EMBEDDING TEST COMPLETE
========================================
`);
}


/**
 * ----------------------------------------
 * TEST ORIGINALITY ANALYSIS
 * ----------------------------------------
 */
async function testOriginality() {

    console.log(`
========================================
TESTING ORIGINALITY ANALYSIS
========================================
`);

    const result =
        await originalityService.analyzeOriginality({

            title:
                'StudyFlow AI',

            description:
                'An AI-powered academic planning assistant that helps students manage assignments, schedules, and productivity.',

            existingIdeas: [
                {
                    id: 1,

                    title:
                        'Notion AI',

                    description:
                        'AI productivity and organization assistant.'
                },

                {
                    id: 2,

                    title:
                        'Grammarly',

                    description:
                        'AI writing assistant for students and professionals.'
                },

                {
                    id: 3,

                    title:
                        'Todoist',

                    description:
                        'Task management and productivity platform.'
                }
            ]
        });

    console.log(JSON.stringify(
        result,
        null,
        2
    ));

    console.log(`
========================================
ORIGINALITY TEST COMPLETE
========================================
`);
}


/**
 * ----------------------------------------
 * RUN ALL TESTS
 * ----------------------------------------
 */
async function runTests() {

    console.log(`
========================================
ORIGINLOCK AI TEST SUITE
========================================
`);

    await testGeneration();

    await testEmbeddings();

    await testOriginality();

    console.log(`
========================================
ALL TESTS COMPLETED
========================================
`);
}


runTests();