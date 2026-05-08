/**
 * ----------------------------------------
 * BUILD ORIGINALITY PROMPT
 * ----------------------------------------
 */
function buildOriginalityPrompt(
    newIdea,
    similarIdeas = []
) {

    /**
     * Format similar ideas
     */
    const formattedSimilarIdeas =
        similarIdeas.length > 0
            ? similarIdeas.map(
                (idea, index) => `
${index + 1}.
Title: ${idea.title}

Description:
${idea.description}

Similarity Score:
${idea.similarity}
`
            ).join('\n')
            : 'No highly similar ideas were found.';


    return `
You are an expert innovation analyst,
startup strategist,
and intellectual property advisor.

Your task is to evaluate the originality
and uniqueness of a startup idea.

==================================================
NEW IDEA
==================================================

${newIdea}

==================================================
SIMILAR EXISTING IDEAS
==================================================

${formattedSimilarIdeas}

==================================================
ANALYSIS TASK
==================================================

Analyze the startup idea carefully.

Evaluate:

1. Originality level
2. Innovation quality
3. Market differentiation
4. Competitive overlap
5. Improvement opportunities
6. Commercial potential
7. Risks and weaknesses

==================================================
IMPORTANT RULES
==================================================

- Be realistic and constructive
- Do NOT claim the idea is completely unique
- Most startups share similarities with others
- Focus on practical improvements
- Be concise but insightful
- Use professional language
- Encourage innovation while being honest

==================================================
RESPONSE FORMAT
==================================================

Return your response EXACTLY
using this structure:

Originality Score: X/10

Executive Summary:
- ...

Strengths:
- ...
- ...
- ...

Overlaps With Existing Ideas:
- ...
- ...
- ...

Improvement Suggestions:
- ...
- ...
- ...

Potential Markets:
- ...
- ...
- ...

Risks & Weaknesses:
- ...
- ...
- ...

Commercial Potential:
- ...
`;
}


module.exports = {
    buildOriginalityPrompt
};