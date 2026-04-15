// Format-specific structured data field definitions
// These keys must match what the template components expect when reading structuredData

export const FORMAT_STRUCTURED_FIELDS: Record<string, string[]> = {
    POLICY_BRIEF: [
        'executiveSummary',
        'policyRecommendations',
        'backgroundContext',
        'implementationTimeline',
    ],

    STRATEGIC_REPORT: [
        'executiveSummary',
        'strategicAssessment',
        'keyFindings',
        'recommendations',
    ],

    COMMENTARY: [
        'thesis',
        'evidence',
        'implications',
        'counterarguments',
    ],

    DATA_INSIGHT: [
        'keyFindings',
        'dataAnalysis',
        'methodology',
        'limitations',
    ],

    POLICY_TOOLKIT: [
        'policyContext',
        'toolkitComponents',
        'implementationGuidance',
        'caseStudies',
    ],

    ANNUAL_OUTLOOK: [
        'yearInReview',
        'trendAnalysis',
        'predictions',
        'wildcards',
    ],

    NEWS_BRIEF: [
        'summary',
        'keyDevelopments',
        'context',
        'outlook',
    ],

    CURRENT_AFFAIRS: [
        'situation',
        'analysis',
        'stakeholders',
        'implications',
    ],

    SCENARIO_ANALYSIS: [
        'scenarioOverview',
        'bestCase',
        'likelyCase',
        'worstCase',
    ],

    RISK_ASSESSMENT: [
        'riskOverview',
        'riskFactors',
        'mitigationStrategies',
        'riskMatrix',
    ],
};

export type FormatType = keyof typeof FORMAT_STRUCTURED_FIELDS;
