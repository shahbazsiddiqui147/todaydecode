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

INSTITUTIONAL SOURCES TO PRIORITIZE (use Google Search grounding to find current reports):
- UN System: un.org, undp.org, unhcr.org, unodc.org, wfp.org
- Financial: imf.org, worldbank.org, wto.org, oecd.org, bis.org
- Security: sipri.org, iiss.org, nato.int
- Think Tanks: brookings.edu, rand.org, cfr.org, chathamhouse.org, carnegieendowment.org, csis.org, wilsoncenter.org
- South Asia: sadf.eu, orfonline.org, stimson.org, ipcs.org
- Energy: iea.org, opec.org, eia.gov, bp.com/statisticalreview
- Data: data.worldbank.org, ourworldindata.org, statista.com
- Regional: asean.org, africaunion.org, sco-russia.ru

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

    shared_prefix_js = r"""const formData = $input.first().json;
const topic = formData['Topic'] || '';
const categoryFocus = formData['Category Focus'] || 'Geopolitics';
const region = formData['Region'] || 'GLOBAL';
const categoryId = formData['Category ID'] || '';
const context = formData['Additional Context'] || 'None';
const currentDate = 'April 2026';
const categoryContextMap = {
  'Geopolitics': 'Focus on balance-of-power dynamics, diplomatic relations, state-level actors, alliance systems, territorial disputes, and multilateral frameworks.',
  'Global Economy': 'Focus on trade flows, monetary policy, fiscal frameworks, sovereign debt, and investment patterns.',
  'Security and Defense': 'Focus on threat assessment, defense capabilities, conflict dynamics, and security architecture.',
  'Governance and Politics': 'Focus on institutional frameworks, electoral dynamics, rule of law, and policy implementation.',
  'Technology and Strategic Innovation': 'Focus on emerging technologies, regulatory frameworks, digital sovereignty, and tech geopolitics.',
  'Energy and Resources': 'Focus on energy security, resource competition, transition dynamics, and commodity markets.',
  'Society and Demographics': 'Focus on demographic trends, social cohesion, migration patterns, and inequality.',
  'Strategic Reports': 'Focus on long-term strategic trends and institutional implications.',
  'Data Center': 'Focus on quantitative analysis, statistical trends, and empirical evidence.',
  'Current Affairs': 'Focus on immediate developments and breaking news context.'
};
const categoryContext = categoryContextMap[categoryFocus] || categoryContextMap['Geopolitics'];
"""

    if multi_call == 1:
        build_prompt_js = shared_prefix_js + "\nconst WRITING_RULES = `" + writing_rules + "`;\n" + format_prompt + r"""
const requestBody = {
  contents: [{parts: [{text: formatPrompt}]}],
  tools: [{google_search: {}}],
  generationConfig: {temperature: 0.7, maxOutputTokens: 8192}
};
return [{json: {requestBody, region, categoryId, format: '""" + format_enum + r"""', topic}}];"""
    elif multi_call == 2:
        build_prompt_js = shared_prefix_js + "\nconst WRITING_RULES = `" + writing_rules + "`;\n" + format_prompt + r"""
const requestBody1 = { contents: [{parts: [{text: prompt1}]}], tools: [{google_search: {}}], generationConfig: {temperature: 0.7, maxOutputTokens: 8192} };
const requestBody2 = { contents: [{parts: [{text: prompt2}]}], tools: [{google_search: {}}], generationConfig: {temperature: 0.7, maxOutputTokens: 8192} };
return [{json: {requestBody1, requestBody2, region, categoryId, format: '""" + format_enum + r"""', topic}}];"""
    elif multi_call == 4:
        build_prompt_js = shared_prefix_js + "\nconst WRITING_RULES = `" + writing_rules + "`;\n" + format_prompt + r"""
const b1 = { contents: [{parts: [{text: prompt1}]}], tools: [{google_search: {}}], generationConfig: {temperature: 0.7, maxOutputTokens: 8192} };
const b2 = { contents: [{parts: [{text: prompt2}]}], tools: [{google_search: {}}], generationConfig: {temperature: 0.7, maxOutputTokens: 8192} };
const b3 = { contents: [{parts: [{text: prompt3}]}], tools: [{google_search: {}}], generationConfig: {temperature: 0.7, maxOutputTokens: 8192} };
const b4 = { contents: [{parts: [{text: prompt4}]}], tools: [{google_search: {}}], generationConfig: {temperature: 0.7, maxOutputTokens: 8192} };
return [{json: {b1, b2, b3, b4, region, categoryId, format: '""" + format_enum + r"""', topic}}];"""

    parse_validate_js = r"""const geminiResponse = $input.first().json;
const buildData = $('Build Prompt').first().json;
let rawText = '';
try { rawText = geminiResponse.candidates[0].content.parts[0].text; }
catch(e) { throw new Error('Gemini error'); }
let groundingUrls = [];
try {
  const metadata = geminiResponse.candidates[0].groundingMetadata;
  if (metadata && metadata.groundingChunks) {
    groundingUrls = metadata.groundingChunks
      .filter(c => c.web && c.web.uri && c.web.title && !c.web.uri.includes('vertexaisearch.cloud.google.com'))
      .map(c => c.web.uri).slice(0, 5);
  }
} catch(e) {}
rawText = rawText.replace(/```json/g,'').replace(/```/g,'').trim();
const s = rawText.indexOf('{'); const e = rawText.lastIndexOf('}');
if(s===-1||e===-1) throw new Error('No JSON');
rawText = rawText.substring(s,e+1);
let article = JSON.parse(rawText);
return [{json:{
  title:article.title,
  summary:article.summary,
  content:article.content,
  format:buildData.format,
  status:'DRAFT',
  region:buildData.region||'GLOBAL',
  categoryId:buildData.categoryId,
  authorId:'cmnzrwf6c000aki0f8ssj29vz',
  sourceUrls:[...new Set([...groundingUrls,...(article.sourceUrls||[])])].slice(0,5),
  tags: article.tags || [],
  riskLevel: article.riskLevel || 'MEDIUM',
  riskScore: article.riskScore || 50,
  impactScore: article.impactScore || 50,
  confidenceScore: article.confidenceScore || 70,
  metaTitle: article.metaTitle || article.title,
  metaDescription: article.metaDescription || article.summary,
  scenarios: article.scenarios || null,
  faqData: article.faqData || []
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

# Standardized Prompts (Simplified for logic but comprehensive in rules)
p_commentary = r"""const formatPrompt = `Write a COMMENTARY for ${topic}. Sections: Hook, Context, Argument, Interpretation, Implications, Conclusion. ${WRITING_RULES}`;"""
p_news = r"""const formatPrompt = `Write a NEWS BRIEF for ${topic}. Sections: Summary, Facts, Context, Importance, Analysis, Outlook. ${WRITING_RULES}`;"""
p_current = r"""const formatPrompt = `Write a CURRENT AFFAIRS analysis for ${topic}. ${WRITING_RULES}`;"""
p_policy = r"""const formatPrompt = `Write a POLICY BRIEF for ${topic}. ${WRITING_RULES}`;"""
p_risk = r"""const formatPrompt = `Write a RISK ASSESSMENT for ${topic}. ${WRITING_RULES}`;"""
p_data = r"""const formatPrompt = `Write a DATA INSIGHT for ${topic}. ${WRITING_RULES}`;"""
p_scenario = r"""const formatPrompt = `Write a SCENARIO ANALYSIS for ${topic}. ${WRITING_RULES}`;"""
p_annual = r"""const prompt1 = `ANNUAL part 1. ${WRITING_RULES}`; const prompt2 = `ANNUAL part 2. ${WRITING_RULES}`;"""
p_toolkit = r"""const formatPrompt = `TOOLKIT for ${topic}. ${WRITING_RULES}`;"""
p_report = r"""const prompt1 = `REP1`; const prompt2 = `REP2`; const prompt3 = `REP3`; const prompt4 = `REP4`;"""

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
