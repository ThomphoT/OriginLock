const ollamaService = require('./services/ollama.service');

async function test() {

    console.log('Testing AI generation...\n');

    const result = await ollamaService.generate(
        'Give me 3 startup ideas for students'
    );

    console.log(result);

    console.log('\n----------------------------------\n');

    console.log('Testing embeddings...\n');

    const embeddingResult = await ollamaService.generateEmbedding(
        'AI powered grocery management platform'
    );

    console.log({
        success: embeddingResult.success,
        embeddingLength: embeddingResult.embedding?.length
    });
}

test();