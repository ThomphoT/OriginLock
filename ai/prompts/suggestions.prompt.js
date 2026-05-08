/**
 * ----------------------------------------
 * TITLE SUGGESTION PROMPT
 * ----------------------------------------
 */
function buildTitleSuggestionPrompt(description) {

    return `
You are a startup branding expert.

Generate 3 creative, modern,
and memorable startup names
for the following idea.

==================================
IDEA DESCRIPTION
==================================

${description}

==================================
RULES
==================================

- Return ONLY the startup names
- One per line
- No numbering
- No explanations
- Keep names short and brandable
`;
}


/**
 * ----------------------------------------
 * DESCRIPTION SUGGESTION PROMPT
 * ----------------------------------------
 */
function buildDescriptionPrompt(title) {

    return `
You are an innovation strategist.

Write a professional startup idea
description for this title:

"${title}"

==================================
RULES
==================================

- Keep it under 200 words
- Make it realistic
- Make it investor-friendly
- Explain the core idea clearly
- Use professional language
`;
}


/**
 * ----------------------------------------
 * IMPROVEMENT PROMPT
 * ----------------------------------------
 */
function buildImprovementPrompt(title, description) {

    return `
You are a startup mentor
and innovation consultant.

Analyze this startup idea
and provide improvement advice.

==================================
IDEA TITLE
==================================

${title}

==================================
IDEA DESCRIPTION
==================================

${description}

==================================
YOUR TASK
==================================

1. Identify strengths
2. Identify weaknesses
3. Suggest improvements
4. Suggest new opportunities
5. Suggest target industries

==================================
RESPONSE FORMAT
==================================

Strengths:
- ...

Weaknesses:
- ...

Improvements:
- ...

Industries:
- ...
`;
}


module.exports = {
    buildTitleSuggestionPrompt,
    buildDescriptionPrompt,
    buildImprovementPrompt
};