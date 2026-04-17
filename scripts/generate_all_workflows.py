import json
import os

def generate_workflow(filename, workflow_name, format_enum, format_prompt, multi_call=1):
    secret = "0f9308d261f24fd5bf75c3f2859cd9c1d0fe9a1a9baf459994d3405084695fe7"
    gemini_key = "PASTE_YOUR_GEMINI_KEY_HERE"
    
    writing_rules = r"""
LANGUAGE AND STYLE RULES (mandatory):
- Write in neutral, authoritative analytical tone targeting global readership
- Use natural transitional language: however, moreover, nevertheless, consequently, meanwhile, notably, that said, even so, despite this, subsequently, in contrast, crucially, significantly, furthermore, as a result
- Vary sentence length: mix short punchy sentences with longer analytical ones
- Every article must include minimum 3 specific statistics, percentages, or data points
- Format numbers as: $2.3 billion not $2300000000, 47% not forty-seven percent, 2.1 million not two point one million
- Embed external links naturally in content using: <a href="URL" target="_blank" rel="noopener">anchor text</a>
- Never start sentences with: It is worth noting, It is important to highlight, In today's rapidly evolving landscape, Delve into, Leverage, Utilize, Comprehensive, In conclusion
- Never repeat the same analytical point in different words across sections
- End with forward-looking statement not a summary of what was just said
- Maintain consistent formal analytical register throughout
- Anti-plagiarism: Never copy sentences from sources. Always paraphrase and synthesize. Add original analytical perspective

BANNED CHARACTERS AND PUNCTUATION (absolutely never use):
- The Em dash (Unicode U+2014) is strictly forbidden in all content
- The En dash (Unicode U+2013) is also forbidden
- Instead of dashes, restructure sentences using: however, while, although, which, that, because, since, as, and, but, or use a new sentence entirely

HTML FORMATTING (mandatory):
- Wrap every paragraph in <p> tags
- Use <h2> for main section headers
- Use <h3> for subsections
- Use <strong> for key terms and critical data points
- Use <ul><li> for bullet lists
- Use <blockquote><p> for pull quotes (1-2 per long-form article)
- Use <a href="URL" target="_blank" rel="noopener">text</a> for embedded links
- Never use markdown symbols outside HTML tags
"""

    json_template = r"""
{
  "title": "Clear Analytical Title",
  "summary": "1-2 sentence high-level overview",
  "onPageLead": "Punchy 1-sentence hook",
  "content": "Full HTML formatted article body",
  "riskLevel": "LOW/MEDIUM/HIGH/CRITICAL",
  "riskScore": 0-100,
  "impactScore": 0-100,
  "confidenceScore": 0-100,
  "tags": ["tag1", "tag2", "tag3"],
  "metaTitle": "SEO title (max 60 chars)",
  "metaDescription": "SEO description (max 155 chars)",
  "directAnswer": "1-sentence direct answer to the implicit user query",
  "faqData": [
    {"question": "Question 1?", "answer": "Answer 1."},
    {"question": "Question 2?", "answer": "Answer 2."},
    {"question": "Question 3?", "answer": "Answer 3."}
  ],
  "scenarios": {
    "best": {"title": "Optimistic Trend", "description": "Detailed description", "impact": 20},
    "likely": {"title": "Baseline Projection", "description": "Detailed description", "impact": 55},
    "worst": {"title": "Risk Realization", "description": "Detailed description", "impact": 85}
  },
  "sourceUrls": ["https://source1.org", "https://source2.org"],
  "imagePrompts": {"hero": "detailed alt text description", "infographic": "data visualization description"},
  "unsplashKeyword": "word1 word2",
  "featuredImageAlt": "Alt text for image"
}
"""

    # Escape function for prompt to survive JS template string inside JSON
    def escape_for_js(s):
        return s.replace('\\', '\\\\').replace('`', '\\`').replace('$', '\\$').replace("'", "\\'").replace('\n', '\\n')

    esc_rules = escape_for_js(writing_rules)
    esc_template = escape_for_js(json_template)
    esc_format = escape_for_js(format_prompt)

    shared_prefix_js = r"""const formData = $input.first().json;
const topic = formData['Topic'] || '';
const categoryFocus = formData['Category Focus'] || 'Geopolitics';
const region = formData['Region'] || 'GLOBAL';
const categoryId = formData['Category ID'] || '';
const context = formData['Additional Context'] || 'None';
const currentDate = 'April 2026';
const WRITING_RULES = `""" + esc_rules + r"""`;
const JSON_TEMPLATE = `""" + esc_template + r"""`;
"""

    if multi_call == 1:
        build_prompt_js = shared_prefix_js + r"""
const formatPrompt = `YOU MUST RESPOND WITH ONLY A VALID JSON OBJECT. NO TEXT BEFORE OR AFTER THE JSON. NO MARKDOWN CODE FENCES. JUST THE RAW JSON OBJECT STARTING WITH { AND ENDING WITH }.

""" + esc_format + r"""

${WRITING_RULES}

YOU MUST FOLLOW THIS JSON STRUCTURE EXACTLY:
${JSON_TEMPLATE}
`;
const requestBody = {
  contents: [{parts: [{text: formatPrompt}]}],
  tools: [{google_search: {}}],
  generationConfig: {temperature: 0.7, maxOutputTokens: 8192}
};
return [{json: {requestBody, region, categoryId, format: '""" + format_enum + r"""', topic}}];"""
    elif multi_call == 2:
        build_prompt_js = shared_prefix_js + r"""
const prompt1 = `PART 1: """ + esc_format + r"""\n\n${WRITING_RULES}\n\nRESPONSE MUST BE RAW JSON.`;
const prompt2 = `PART 2: Finish and provide full JSON. Template: ${JSON_TEMPLATE}`;
const requestBody1 = { contents: [{parts: [{text: prompt1}]}], tools: [{google_search: {}}], generationConfig: {temperature: 0.7, maxOutputTokens: 8192} };
const requestBody2 = { contents: [{parts: [{text: prompt2}]}], tools: [{google_search: {}}], generationConfig: {temperature: 0.7, maxOutputTokens: 8192} };
return [{json: {requestBody1, requestBody2, region, categoryId, format: '""" + format_enum + r"""', topic}}];"""
    elif multi_call == 4:
        build_prompt_js = shared_prefix_js + r"""
const prompt1 = `Step 1: Research and draft CORE sections.`;
const prompt2 = `Step 2: Analysis and Data.`;
const prompt3 = `Step 3: Strategic Outlook.`;
const prompt4 = `Step 4: Finalize and provide FULL article in this JSON structure: ${JSON_TEMPLATE}\n\n${WRITING_RULES}`;
const b1 = { contents: [{parts: [{text: prompt1}]}], tools: [{google_search: {}}], generationConfig: {temperature: 0.7, maxOutputTokens: 8192} };
const b2 = { contents: [{parts: [{text: prompt2}]}], tools: [{google_search: {}}], generationConfig: {temperature: 0.7, maxOutputTokens: 8192} };
const b3 = { contents: [{parts: [{text: prompt3}]}], tools: [{google_search: {}}], generationConfig: {temperature: 0.7, maxOutputTokens: 8192} };
const b4 = { contents: [{parts: [{text: prompt4}]}], tools: [{google_search: {}}], generationConfig: {temperature: 0.7, maxOutputTokens: 8192} };
return [{json: {b1, b2, b3, b4, region, categoryId, format: '""" + format_enum + r"""', topic}}];"""

    parse_validate_js = r"""const geminiResponse = $input.first().json;
const buildData = $('Build Prompt').first().json;
let rawText = '';
try {
  rawText = geminiResponse.candidates[0].content.parts[0].text;
} catch(e) {
  throw new Error('Gemini error: ' + JSON.stringify(geminiResponse).substring(0,300));
}

// Extract grounding URLs
let groundingUrls = [];
try {
  const candidate = geminiResponse.candidates[0];
  const metadata = candidate.groundingMetadata;
  if (metadata && metadata.groundingChunks) {
    const filtered = metadata.groundingChunks
      .filter(c => c.web && c.web.uri && c.web.title && !c.web.uri.includes('vertexaisearch.cloud.google.com'));
    if (filtered.length > 0) {
      groundingUrls = filtered.map(c => c.web.uri).slice(0, 5);
    } else {
      groundingUrls = metadata.groundingChunks
        .filter(c => c.web && c.web.title)
        .map(c => {
          const t = c.web.title.toLowerCase();
          if (t.includes('reuters')) return 'https://www.reuters.com';
          if (t.includes('bbc')) return 'https://www.bbc.com';
          if (t.includes('aljazeera')) return 'https://www.aljazeera.com';
          if (t.includes('ft.com') || t.includes('financial times')) return 'https://www.ft.com';
          if (t.includes('foreignpolicy')) return 'https://foreignpolicy.com';
          if (t.includes('brookings')) return 'https://www.brookings.edu';
          if (t.includes('rand')) return 'https://www.rand.org';
          if (t.includes('cfr')) return 'https://www.cfr.org';
          if (t.includes('chatham')) return 'https://www.chathamhouse.org';
          if (t.includes('imf')) return 'https://www.imf.org';
          if (t.includes('worldbank') || t.includes('world bank')) return 'https://www.worldbank.org';
          if (t.includes('un.org') || t.includes('united nations')) return 'https://www.un.org';
          if (t.includes('sipri')) return 'https://www.sipri.org';
          if (t.includes('guardian')) return 'https://www.theguardian.com';
          if (t.includes('economist')) return 'https://www.economist.com';
          if (t.includes('iea')) return 'https://www.iea.org';
          if (t.includes('nato')) return 'https://www.nato.int';
          if (t.includes('wikipedia')) return 'https://www.wikipedia.org';
          return null;
        })
        .filter(url => url !== null)
        .filter((url, i, self) => self.indexOf(url) === i)
        .slice(0, 5);
    }
  }
} catch(e) { groundingUrls = []; }

// Clean raw text
rawText = rawText.replace(/```json/g,'').replace(/```/g,'').trim();

// Find JSON boundaries
const s = rawText.indexOf('{');
const e2 = rawText.lastIndexOf('}');
if (s === -1 || e2 === -1) throw new Error('No JSON in response');
const jsonStr = rawText.substring(s, e2 + 1);

let parsed;
try { parsed = JSON.parse(jsonStr); }
catch(e) { throw new Error('JSON parse failed: ' + jsonStr.substring(0,200)); }

// Find the real article data regardless of nesting
const nested = parsed.newsBrief || parsed.currentAffairs || parsed.commentary ||
  parsed.policyBrief || parsed.riskAssessment || parsed.dataInsight ||
  parsed.scenarioAnalysis || parsed.annualOutlook || parsed.policyToolkit ||
  parsed.strategicReport || parsed.article || parsed;

// Function definitions
function extractField(obj, fields) {
  for (const f of fields) {
    if (obj[f] && typeof obj[f] === 'string' && obj[f].length > 10) return obj[f];
  }
  return null;
}

function sectionsToHtml(sections) {
  if (!Array.isArray(sections)) return '';
  let html = '';
  sections.forEach(sec => {
    if (sec.heading) html += '<h2>' + sec.heading + '</h2>';
    if (sec.content) {
      if (Array.isArray(sec.content)) {
        html += '<ul>' + sec.content.map(i => '<li>' + i + '</li>').join('') + '</ul>';
      } else if (typeof sec.content === 'string') {
        html += '<p>' + sec.content + '</p>';
      }
    }
  });
  return html;
}

// Content extraction
let content = extractField(nested, ['content', 'body', 'articleContent', 'text']);
if (!content && nested.sections) {
  content = sectionsToHtml(nested.sections);
}
if (!content && nested.article && nested.article.sections) {
  content = sectionsToHtml(nested.article.sections);
}
if (!content) content = '<p>' + buildData.topic + '</p>';

// ALL scalar variables
const riskScore = Number(nested.riskScore) || Number(parsed.riskScore) || 50;
const impactScore = Number(nested.impactScore) || Number(parsed.impactScore) || 55;
const confidenceScore = Number(nested.confidenceScore) || Number(parsed.confidenceScore) || 70;
const riskLevel = nested.riskLevel || parsed.riskLevel || 'MEDIUM';
const title = extractField(nested, ['title', 'headline']) || buildData.topic;
const summary = extractField(nested, ['summary', 'executiveSummary', 'abstract', 'overview']) || content.replace(/<[^>]+>/g, '').substring(0, 200).trim();
const onPageLead = extractField(nested, ['onPageLead', 'hook', 'lead', 'lede']) || summary.substring(0, 180);
const metaTitle = extractField(nested, ['metaTitle', 'seoTitle']) || title.substring(0, 60);
const metaDescription = extractField(nested, ['metaDescription', 'seoDescription']) || summary.substring(0, 155);
const tags = Array.isArray(nested.tags) ? nested.tags : (Array.isArray(parsed.tags) ? parsed.tags : [buildData.topic.toLowerCase().split(' ')[0], buildData.region.toLowerCase(), '2026']);
const unsplashKeyword = nested.unsplashKeyword || parsed.unsplashKeyword || buildData.topic.split(' ').slice(0, 2).join(' ');
const featuredImageAlt = nested.featuredImageAlt || parsed.featuredImageAlt || title;
const imagePrompts = nested.imagePrompts || parsed.imagePrompts || {};

// Extract faqData - search everywhere in the parsed object
let faqData = [];
if (Array.isArray(nested.faqData) && nested.faqData.length > 0) {
  faqData = nested.faqData;
} else if (Array.isArray(parsed.faqData) && parsed.faqData.length > 0) {
  faqData = parsed.faqData;
} else if (Array.isArray(nested.faq) && nested.faq.length > 0) {
  faqData = nested.faq;
} else if (Array.isArray(parsed.faq) && parsed.faq.length > 0) {
  faqData = parsed.faq;
} else {
  // Search all keys of parsed object for any array containing question/answer objects
  for (const key of Object.keys(parsed)) {
    const val = parsed[key];
    if (Array.isArray(val) && val.length > 0 && val[0].question && val[0].answer) {
      faqData = val;
      break;
    }
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      for (const innerKey of Object.keys(val)) {
        const innerVal = val[innerKey];
        if (Array.isArray(innerVal) && innerVal.length > 0 && innerVal[0].question && innerVal[0].answer) {
          faqData = innerVal;
          break;
        }
      }
    }
  }
}

// Extract directAnswer - search everywhere
let directAnswer = '';
const directAnswerFields = ['directAnswer', 'keyFinding', 'bottomLine', 'keyTakeaway', 'mainPoint'];
for (const field of directAnswerFields) {
  if (nested[field] && typeof nested[field] === 'string' && nested[field].length > 5) {
    directAnswer = nested[field];
    break;
  }
  if (parsed[field] && typeof parsed[field] === 'string' && parsed[field].length > 5) {
    directAnswer = parsed[field];
    break;
  }
}
// If still empty search all nested objects
if (!directAnswer) {
  for (const key of Object.keys(parsed)) {
    const val = parsed[key];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      for (const field of directAnswerFields) {
        if (val[field] && typeof val[field] === 'string' && val[field].length > 5) {
          directAnswer = val[field];
          break;
        }
      }
    }
  }
}

// Extract scenarios - search everywhere with full description extraction
let scenarios = null;
function extractScenarios(obj) {
  if (!obj || typeof obj !== 'object') return null;
  const raw = obj.scenarios || obj.scenarioProjections || obj.scenarioAnalysis;
  if (!raw) return null;
  const best = raw.best || raw.bestCase || raw.convergence || raw.optimistic;
  const likely = raw.likely || raw.mostLikely || raw.continuation || raw.baseline;
  const worst = raw.worst || raw.worstCase || raw.fragmentation || raw.pessimistic;
  if (!best || !likely || !worst) return null;
  return {
    best: {
      title: best.title || best.name || 'Strategic Convergence',
      description: best.description || best.details || best.summary || best.content || '',
      impact: Number(best.impact) || Number(best.probability) || Number(best.weight) || 20
    },
    likely: {
      title: likely.title || likely.name || 'Linear Tension',
      description: likely.description || likely.details || likely.summary || likely.content || '',
      impact: Number(likely.impact) || Number(likely.probability) || Number(likely.weight) || 55
    },
    worst: {
      title: worst.title || worst.name || 'Systemic Fragmentation',
      description: worst.description || worst.details || worst.summary || worst.content || '',
      impact: Number(worst.impact) || Number(worst.probability) || Number(worst.weight) || 85
    }
  };
}
scenarios = extractScenarios(nested) || extractScenarios(parsed);
// Also search one level deeper
if (!scenarios) {
  for (const key of Object.keys(parsed)) {
    const val = parsed[key];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      scenarios = extractScenarios(val);
      if (scenarios) break;
    }
  }
}

// Extract sourceUrls - search everywhere, filter valid URLs only
let articleUrls = [];
const urlFields = ['sourceUrls', 'sources', 'references', 'links', 'citations'];
for (const field of urlFields) {
  if (Array.isArray(nested[field]) && nested[field].length > 0) {
    articleUrls = nested[field].filter(u => u && typeof u === 'string' && u.startsWith('http'));
    if (articleUrls.length > 0) break;
  }
  if (Array.isArray(parsed[field]) && parsed[field].length > 0) {
    articleUrls = parsed[field].filter(u => u && typeof u === 'string' && u.startsWith('http'));
    if (articleUrls.length > 0) break;
  }
}
// Search nested objects if still empty
if (articleUrls.length === 0) {
  for (const key of Object.keys(parsed)) {
    const val = parsed[key];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      for (const field of urlFields) {
        if (Array.isArray(val[field]) && val[field].length > 0) {
          const found = val[field].filter(u => u && typeof u === 'string' && u.startsWith('http'));
          if (found.length > 0) { articleUrls = found; break; }
        }
      }
    }
  }
}
const allUrls = [...new Set([...groundingUrls, ...articleUrls])].filter(u => u && u.startsWith('http')).slice(0, 5);

if (!title || !content) throw new Error('Could not extract required fields from Gemini response');

console.log('sourceUrls Verification (first 3 chars):', allUrls.length > 0 ? allUrls[0].substring(0, 3) : 'NONE');

return [{json: {
  title,
  summary,
  onPageLead,
  content,
  format: buildData.format,
  status: 'DRAFT',
  region: buildData.region || 'GLOBAL',
  categoryId: buildData.categoryId,
  authorId: 'cmnzrwf6c000aki0f8ssj29vz',
  riskLevel,
  riskScore,
  impactScore,
  confidenceScore,
  tags,
  metaTitle,
  metaDescription,
  directAnswer,
  faqData,
  scenarios,
  sourceUrls: allUrls,
  featuredImage: 'https://source.unsplash.com/1200x630/?' + encodeURIComponent(unsplashKeyword),
  featuredImageAlt,
  researchArchive: JSON.stringify(imagePrompts),
  locale: 'en',
  isPremium: false
}}];"""

    nodes = [
        {
            "id": "form-trigger",
            "name": "Form Trigger",
            "type": "n8n-nodes-base.formTrigger",
            "typeVersion": 2.2,
            "position": [240, 300],
            "parameters": {
                "formTitle": workflow_name,
                "formDescription": "Generate a " + format_enum + " article using Gemini AI",
                "formFields": {
                    "values": [
                        {"fieldLabel": "Topic", "fieldType": "textarea", "requiredField": True},
                        {
                            "fieldLabel": "Category Focus", "fieldType": "dropdown", "requiredField": True,
                            "fieldOptions": {"values": [
                                {"option": "Geopolitics"}, {"option": "Global Economy"}, {"option": "Security and Defense"},
                                {"option": "Governance and Politics"}, {"option": "Technology and Strategic Innovation"},
                                {"option": "Energy and Resources"}, {"option": "Society and Demographics"},
                                {"option": "Strategic Reports"}, {"option": "Data Center"}, {"option": "Current Affairs"}
                            ]}
                        },
                        {
                            "fieldLabel": "Region", "fieldType": "dropdown", "requiredField": True,
                            "fieldOptions": {"values": [
                                {"option": "GLOBAL"}, {"option": "MENA"}, {"option": "APAC"},
                                {"option": "EUROPE"}, {"option": "AMERICAS"}, {"option": "AFRICA"}
                            ]}
                        },
                        {"fieldLabel": "Category ID", "fieldType": "text", "requiredField": True, "placeholder": "e.g. cmnw30ddz0001kisz5twwny30"},
                        {"fieldLabel": "Additional Context", "fieldType": "textarea", "requiredField": False}
                    ]
                },
                "options": {}
            }
        },
        {
            "id": "build-prompt",
            "name": "Build Prompt",
            "type": "n8n-nodes-base.code",
            "typeVersion": 2,
            "position": [500, 300],
            "parameters": {"jsCode": build_prompt_js}
        }
    ]

    connections = {
        "Form Trigger": {"main": [[{"node": "Build Prompt", "type": "main", "index": 0}]]}
    }

    last_node = "Build Prompt"
    x = 760

    if multi_call == 1:
        nodes.append({
            "id": "gemini-ai", "name": "Gemini AI", "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2, "position": [x, 300],
            "parameters": {
                "method": "POST",
                "url": f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={gemini_key}",
                "sendBody": True, "specifyBody": "json",
                "jsonBody": "={{ JSON.stringify($json.requestBody) }}"
            }
        })
        connections["Build Prompt"] = {"main": [[{"node": "Gemini AI", "type": "main", "index": 0}]]}
        last_node = "Gemini AI"
        x += 260
    elif multi_call == 2:
        nodes.append({
            "id": "gemini-1", "name": "Gemini Part 1", "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2, "position": [x, 150],
            "parameters": {"method": "POST", "url": f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={gemini_key}", "sendBody": True, "specifyBody": "json", "jsonBody": "={{ JSON.stringify($json.requestBody1) }}"}
        })
        nodes.append({
            "id": "gemini-2", "name": "Gemini Part 2", "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2, "position": [x, 450],
            "parameters": {"method": "POST", "url": f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={gemini_key}", "sendBody": True, "specifyBody": "json", "jsonBody": "={{ JSON.stringify($json.requestBody2) }}"}
        })
        x += 260
        nodes.append({
            "id": "merge-node", "name": "Merge AI Content", "type": "n8n-nodes-base.code", "typeVersion": 2, "position": [x, 300],
            "parameters": {"jsCode": "const c1 = $('Gemini Part 1').first().json; const c2 = $('Gemini Part 2').first().json; const text = c1.candidates[0].content.parts[0].text + c2.candidates[0].content.parts[0].text; return [{json: { candidates: [{ content: { parts: [{ text }] } }] }}];"}
        })
        connections["Build Prompt"] = {"main": [[{"node": "Gemini Part 1", "type": "main", "index": 0}, {"node": "Gemini Part 2", "type": "main", "index": 0}]]}
        connections["Gemini Part 1"] = {"main": [[{"node": "Merge AI Content", "type": "main", "index": 0}]]}
        connections["Gemini Part 2"] = {"main": [[{"node": "Merge AI Content", "type": "main", "index": 0}]]}
        last_node = "Merge AI Content"
        x += 260
    elif multi_call == 4:
        gnodes = []
        for i in range(1, 5):
            nodes.append({
                "id": f"gemini-{i}", "name": f"Gemini Part {i}", "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2, "position": [x, 100 * i],
                "parameters": {"method": "POST", "url": f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={gemini_key}", "sendBody": True, "specifyBody": "json", "jsonBody": f"={{ JSON.stringify($json.b{i}) }}"}
            })
            gnodes.append({"node": f"Gemini Part {i}", "type": "main", "index": 0})
            connections[f"Gemini Part {i}"] = {"main": [[{"node": "Merge AI Content", "type": "main", "index": 0}]]}
        connections["Build Prompt"] = {"main": [gnodes]}
        x += 260
        nodes.append({
            "id": "merge-node", "name": "Merge AI Content", "type": "n8n-nodes-base.code", "typeVersion": 2, "position": [x, 300],
            "parameters": {"jsCode": "const parts = [$('Gemini Part 1').first().json, $('Gemini Part 2').first().json, $('Gemini Part 3').first().json, $('Gemini Part 4').first().json]; const text = parts.map(p => p.candidates[0].content.parts[0].text).join(''); return [{json: { candidates: [{ content: { parts: [{ text }] } }] }}];"}
        })
        last_node = "Merge AI Content"
        x += 260

    nodes.append({
        "id": "parse-node", "name": "Parse and Validate", "type": "n8n-nodes-base.code", "typeVersion": 2, "position": [x, 300],
        "parameters": {"jsCode": parse_validate_js}
    })
    connections[last_node] = {"main": [[{"node": "Parse and Validate", "type": "main", "index": 0}]]}
    x += 260

    nodes.append({
        "id": "ingest-node", "name": "POST to TodayDecode API", "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2, "position": [x, 300],
            "parameters": {
                "method": "POST", "url": "https://todaydecode.com/api/n8n/ingest/", "sendHeaders": True,
                "headerParameters": {"parameters": [{"name": "x-n8n-secret", "value": secret}, {"name": "Content-Type", "value": "application/json"}]},
                "sendBody": True, "specifyBody": "json", "jsonBody": "={{ JSON.stringify($json) }}"
            }
    })
    connections["Parse and Validate"] = {"main": [[{"node": "POST to TodayDecode API", "type": "main", "index": 0}]]}
    x += 260

    nodes.append({
        "id": "result-node", "name": "Result", "type": "n8n-nodes-base.code", "typeVersion": 2, "position": [x, 300],
        "parameters": {"jsCode": "return [{json: $input.first().json}];"}
    })
    connections["POST to TodayDecode API"] = {"main": [[{"node": "Result", "type": "main", "index": 0}]]}

    dir_path = r"f:\TodayDecode\docs"
    os.makedirs(dir_path, exist_ok=True)
    with open(os.path.join(dir_path, filename), "w", encoding="utf-8") as f:
        json.dump({"name": workflow_name, "nodes": nodes, "connections": connections, "settings": {"executionOrder": "v1"}, "tags": [{"name": "todaydecode"}]}, f, indent=2, ensure_ascii=False)
    print(f"Written: {filename}")

# Format Prompts
p_commentary = r"""Write a COMMENTARY for ${topic}.
Sections:
- Hook: 50-100 words
- Immediate Context: 100-150 words
- Main Argument: 150-250 words
- Interpretation: 100-200 words
- Strategic Implications: 100-200 words
- Conclusion: 50-100 words"""
p_news = r"""Write a NEWS BRIEF for ${topic}.
MANDATORY SECTIONS:
- Event Summary: 100-150 words
- Key Facts: 50-100 words as bullet points
- Immediate Context: 100-150 words
- Why It Matters: 100-200 words
- Short Analysis: 100-150 words
- Outlook: 50-100 words"""
p_current = r"""Write a CURRENT AFFAIRS analysis for ${topic}.
Sections:
- Breaking Context: 100-150 words
- The Actors: 100-150 words
- Conflict/Dynamic Analysis: 150-250 words
- Regional Impact: 100-200 words
- Path Ahead: 50-100 words"""
p_policy = r"""Write a POLICY BRIEF for ${topic}.
Sections:
- Executive Summary: 100-150 words
- Problem Definition: 150-250 words
- Policy Options: 150-250 words
- Strategic Recommendation: 100-200 words
- Implementation Framework: 100-150 words"""
p_risk = r"""Write a RISK ASSESSMENT for ${topic}.
Sections:
- Risk Profile: 100-150 words
- Trigger Events: 100-150 words
- Vulnerability Analysis: 150-250 words
- Mitigation Strategies: 100-200 words
- Probabilistic Outlook: 50-100 words"""
p_data = r"""Write a DATA INSIGHT for ${topic}.
Sections:
- Data Overview: 100-150 words
- Variable Analysis: 150-250 words
- Statistical Significant Trends: 150-250 words
- Empirical Conclusions: 100-200 words"""
p_scenario = r"""Write a SCENARIO ANALYSIS for ${topic}.
Sections:
- Driver Identification: 100-150 words
- The Scenarios: 200-400 words
- Indicator Monitoring: 100-200 words
- Strategic Preparedness: 100-150 words"""
p_annual = r"""Write an ANNUAL OUTLOOK for ${topic}.
Sections:
- Yearly Retrospective: 200-300 words
- Macro Drivers: 250-400 words
- Sector/Regional Trends: 250-400 words
- Risk/Opportunity Matrix: 200-300 words
- 12-Month Outlook: 150-250 words"""
p_toolkit = r"""Write a POLICY TOOLKIT for ${topic}.
Sections:
- Objective Framework: 100-150 words
- Core Instruments: 200-300 words
- Best Practices: 150-250 words
- Monitoring & Evaluation: 100-150 words"""
p_report = r"""Write a STRATEGIC REPORT for ${topic}.
Sections:
- Strategic Context: 200-300 words
- Capability Assessment: 250-400 words
- Adversarial/Competitive Analysis: 250-400 words
- Theatre/Market Dynamics: 200-300 words
- Strategic Conclusions: 150-250 words"""

formats = [
    ("TodayDecode_Commentary_Workflow.json", "Commentary Generator", "COMMENTARY", p_commentary, 1),
    ("TodayDecode_NewsBrief_Workflow.json", "News Brief Generator", "NEWS_BRIEF", p_news, 1),
    ("TodayDecode_CurrentAffairs_Workflow.json", "Current Affairs Generator", "CURRENT_AFFAIRS", p_current, 1),
    ("TodayDecode_PolicyBrief_Workflow.json", "Policy Brief Generator", "POLICY_BRIEF", p_policy, 1),
    ("TodayDecode_RiskAssessment_Workflow.json", "Risk Assessment Generator", "RISK_ASSESSMENT", p_risk, 1),
    ("TodayDecode_DataInsight_Workflow.json", "Data Insight Generator", "DATA_INSIGHT", p_data, 1),
    ("TodayDecode_ScenarioAnalysis_Workflow.json", "Scenario Analysis Generator", "SCENARIO_ANALYSIS", p_scenario, 1),
    ("TodayDecode_AnnualOutlook_Workflow.json", "Annual Outlook Generator", "ANNUAL_OUTLOOK", p_annual, 2),
    ("TodayDecode_PolicyToolkit_Workflow.json", "Policy Toolkit Generator", "POLICY_TOOLKIT", p_toolkit, 1),
    ("TodayDecode_StrategicReport_Workflow.json", "Strategic Report Generator", "STRATEGIC_REPORT", p_report, 4)
]

for f in formats: generate_workflow(*f)
