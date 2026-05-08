function buildOriginalityPrompt(
    newIdea,
    similarIdeas = []
) {

    const formattedSimilarIdeas = similarIdeas.length > 0
        ? similarIdeas.map((idea, index) => `
${index + 1}. Title: ${idea.title}
Description: ${idea.description}
Similarity Score: ${idea.similarity}
`).join('\n')
        : 'No similar ideas were found.';

    return `
You are an expert innovation analyst and intellectual property advisor.

Your task is to evaluate the originality and uniqueness of a new idea submission.

==================================================
NEW IDEA
==================================================

${newIdea}

==================================================
SIMILAR EXISTING IDEAS
==================================================

${formattedSimilarIdeas}

==================================================
YOUR TASK
==================================================

Analyze the new idea carefully.

1. Estimate how original the idea is on a scale of 1-10.
2. Explain what makes the idea unique.
3. Explain what parts overlap with existing ideas.
4. Suggest at least 3 improvements or differentiators.
5. Suggest potential industries or markets.
6. Mention possible risks or weaknesses.
7. Keep the response constructive and encouraging.

==================================================
IMPORTANT RULES
==================================================

- Be specific and practical.
- Do not say the idea is "fully unique".
- Most ideas have similarities to existing concepts.
- Focus on helping the creator improve the idea.
- Respond professionally.
- Avoid overly generic feedback.

==================================================
RESPONSE FORMAT
==================================================

Originality Score: X/10

Strengths:
- ...

Overlaps:
- ...

Improvements:
- ...

Potential Markets:
- ...

Risks:
- ...
`;
}

module.exports = {
    buildOriginalityPrompt
};