/**
 * AI Service for AMS
 * Handles technical logbook refinement and academic tone adjustment
 */

const refineSummary = async (originalSummary, context = {}) => {
    // In a production environment, this would call Google Gemini or OpenAI API
    // We'll simulate a professional technical refinement logic here

    return new Promise((resolve) => {
        setTimeout(() => {
            let refined = originalSummary;

            // Technical Vocabulary Mapping
            const vocabularyMap = {
                'fixed': 'troubleshot and remediated',
                'made': 'engineered and deployed',
                'did': 'executed technical operations for',
                'set up': 'configured and initialized',
                'helped': 'provided technical assistance for',
                'checked': 'audited and validated',
                'wrote': 'authored professional documentation for',
                'computers': 'institutional workstations',
                'network': 'enterprise infrastructure',
                'servers': 'production environment nodes',
                'broke': 'experienced operational failure in',
                'fast': 'at optimized efficiency'
            };

            // Apply technical transformations
            Object.keys(vocabularyMap).forEach(key => {
                const regex = new RegExp(`\\b${key}\\b`, 'gi');
                refined = refined.replace(regex, vocabularyMap[key]);
            });

            // Sentence Structure Enhancement
            // Ensure we don't double "I" if the refined text already starts with an action
            const cleanRefined = refined.trim().charAt(0).toLowerCase() + refined.trim().slice(1);
            const header = `During this reporting period, I ${cleanRefined}`;
            const footer = `\n\nOperational Impact: This activity contributed to the stabilization and optimization of the ${context.department || 'assigned technical'} workflows.`;

            const finalOutput = header.endsWith('.') ? header : header + '.';

            resolve(finalOutput + footer);
        }, 1500); // Simulate network latency
    });
};

module.exports = {
    refineSummary
};
