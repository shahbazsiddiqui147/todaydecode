import json
import os

workflow = {
    "name": "TodayDecode Commentary Workflow",
    "nodes": [
        {
            "parameters": {
                "path": "commentary-generator",
                "formTitle": "TodayDecode — Commentary Generator",
                "formDescription": "Generate an expert commentary article using Gemini AI with real source URLs",
                "formFields": {
                    "values": [
                        {"fieldLabel": "Topic", "fieldType": "textarea", "required": True},
                        {
                            "fieldLabel": "Region",
                            "fieldType": "dropdown",
                            "required": True,
                            "fieldOptions": {
                                "values": [
                                    {"name": "GLOBAL", "value": "GLOBAL"},
                                    {"name": "MENA", "value": "MENA"},
                                    {"name": "APAC", "value": "APAC"},
                                    {"name": "EUROPE", "value": "EUROPE"},
                                    {"name": "AMERICAS", "value": "AMERICAS"},
                                    {"name": "AFRICA", "value": "AFRICA"}
                                ]
                            }
                        },
                        {"fieldLabel": "Category ID", "fieldType": "string", "required": True, "placeholder": "e.g. cmnw30ddz0001kisz5twwny30"},
                        {"fieldLabel": "Additional Context", "fieldType": "textarea", "required": False}
                    ]
                }
            },
            "id": "form-trigger",
            "name": "Form Trigger",
            "type": "n8n-nodes-base.formTrigger",
            "typeVersion": 2.2,
            "position": [240, 300]
        },
        {
            "parameters": {
                "jsCode": r"""const formData = $input.first().json;
const topic = formData['Topic'] || '';
const region = formData['Region'] || 'GLOBAL';
const context = formData['Additional Context'] || 'None';
const categoryId = formData['Category ID'] || '';
const prompt = `You are a Senior Geopolitical Risk Analyst writing for TodayDecode. Write a COMMENTARY article.\n\nTOPIC: ${topic}\nREGION: ${region}\nADDITIONAL CONTEXT: ${context}\n\nRULES:\n- Open with a sharp thesis\n- 700-900 words strictly\n- Use <p> <h2> <strong> <ul> <li> HTML tags only\n- Never use markdown ## or **\n\nUse Google Search grounding to find 3-5 real URLs from Reuters, BBC, Al Jazeera, Foreign Policy, Financial Times.\n\nReturn ONLY this JSON:\n{"title":"headline max 12 words","summary":"2-3 sentences max 200 chars","onPageLead":"1 sentence max 180 chars","content":"full HTML article 700-900 words","metaTitle":"max 60 chars","metaDescription":"max 155 chars","tags":["tag1","tag2","tag3","tag4"],"riskLevel":"MEDIUM","riskScore":55,"impactScore":65,"confidenceScore":75,"directAnswer":"one sentence answer","faqData":[{"question":"question 1?","answer":"answer 1"},{"question":"question 2?","answer":"answer 2"},{"question":"question 3?","answer":"answer 3"}],"scenarios":{"best":{"title":"Strategic Convergence","description":"2-3 sentences best case","impact":20},"likely":{"title":"Linear Tension","description":"2-3 sentences likely case","impact":55},"worst":{"title":"Systemic Fragmentation","description":"2-3 sentences worst case","impact":85}},"sourceUrls":["https://url1.com","https://url2.com","https://url3.com"]}`;
const requestBody = {contents:[{parts:[{text:prompt}]}],tools:[{google_search:{}}],generationConfig:{temperature:0.7,maxOutputTokens:8192}};
return [{json:{requestBody,region,categoryId}}];"""
            },
            "id": "build-prompt",
            "name": "Build Prompt",
            "type": "n8n-nodes-base.code",
            "typeVersion": 2,
            "position": [500, 300]
        },
        {
            "parameters": {
                "method": "POST",
                "url": "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=PASTE_YOUR_GEMINI_KEY_HERE",
                "sendBody": True,
                "specifyBody": "json",
                "jsonBody": "={{ JSON.stringify($json.requestBody) }}",
                "options": {}
            },
            "id": "gemini-ai",
            "name": "Gemini AI with Grounding",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4.2,
            "position": [760, 300]
        },
        {
            "parameters": {
                "jsCode": r"""const geminiResponse = $input.first().json;
let rawText = '';
try { rawText = geminiResponse.candidates[0].content.parts[0].text; } catch(e) { throw new Error('Gemini error: ' + JSON.stringify(geminiResponse).substring(0,300)); }
let groundingUrls = [];
try { const m = geminiResponse.candidates[0].groundingMetadata; if(m && m.groundingChunks) { groundingUrls = m.groundingChunks.filter(c=>c.web&&c.web.uri).map(c=>c.web.uri).slice(0,5); } } catch(e) { groundingUrls = []; }
rawText = rawText.replace(/```json/g,'').replace(/```/g,'').trim();
const s = rawText.indexOf('{'); const e = rawText.lastIndexOf('}');
if(s===-1||e===-1) throw new Error('No JSON in response: '+rawText.substring(0,300));
rawText = rawText.substring(s,e+1);
let article;
try { article = JSON.parse(rawText); } catch(e) { throw new Error('Parse failed: '+rawText.substring(0,300)); }
if(!article.title||!article.summary||!article.content) throw new Error('Missing required fields');
const bd = $('Build Prompt').first().json;
const articleUrls = Array.isArray(article.sourceUrls) ? article.sourceUrls : [];
const allUrls = [...new Set([...groundingUrls,...articleUrls])].slice(0,5);
const scenarios = (article.scenarios&&article.scenarios.best&&article.scenarios.likely&&article.scenarios.worst) ? {best:{title:article.scenarios.best.title||'Strategic Convergence',description:article.scenarios.best.description||'',impact:Number(article.scenarios.best.impact)||20},likely:{title:article.scenarios.likely.title||'Linear Tension',description:article.scenarios.likely.description||'',impact:Number(article.scenarios.likely.impact)||55},worst:{title:article.scenarios.worst.title||'Systemic Fragmentation',description:article.scenarios.worst.description||'',impact:Number(article.scenarios.worst.impact)||85}} : null;
return [{json:{title:article.title,summary:article.summary,onPageLead:article.onPageLead||article.summary.substring(0,180),content:article.content,format:'COMMENTARY',status:'DRAFT',region:bd.region||'GLOBAL',categoryId:bd.categoryId,authorId:'cmnzrwf6c000aki0f8ssj29vz',riskLevel:article.riskLevel||'MEDIUM',riskScore:Number(article.riskScore)||50,impactScore:Number(article.impactScore)||50,confidenceScore:Number(article.confidenceScore)||70,tags:Array.isArray(article.tags)?article.tags:[],metaTitle:article.metaTitle||article.title,metaDescription:article.metaDescription||article.summary.substring(0,155),directAnswer:article.directAnswer||'',faqData:Array.isArray(article.faqData)?article.faqData:[],scenarios:scenarios,sourceUrls:allUrls,locale:'en',isPremium:false}}];"""
            },
            "id": "parse-node",
            "name": "Parse & Validate",
            "type": "n8n-nodes-base.code",
            "typeVersion": 2,
            "position": [1020, 300]
        },
        {
            "parameters": {
                "method": "POST",
                "url": "https://todaydecode.com/api/n8n/ingest/",
                "sendHeaders": True,
                "headerParameters": {
                    "parameters": [
                        {"name": "x-n8n-secret", "value": "0f9308d261f24fd5bf75c3f2859cd9c1d0fe9a1a9baf459994d3405084695fe7"},
                        {"name": "Content-Type", "value": "application/json"}
                    ]
                },
                "sendBody": True,
                "specifyBody": "json",
                "jsonBody": "={{ JSON.stringify($json) }}"
            },
            "id": "ingest-node",
            "name": "POST to TodayDecode API",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4.2,
            "position": [1280, 300]
        },
        {
            "parameters": {
                "jsCode": "const r=$input.first().json;if(!r.success)throw new Error('API failed: '+(r.error||JSON.stringify(r)));return [{json:{status:'SUCCESS',action:r.action,articleId:r.articleId,slug:r.slug,adminUrl:r.adminUrl,reviewLink:'https://todaydecode.com/admin/articles/edit/'+r.articleId}}];"
            },
            "id": "result-node",
            "name": "Format Result",
            "type": "n8n-nodes-base.code",
            "typeVersion": 2,
            "position": [1540, 300]
        }
    ],
    "connections": {
        "Form Trigger": {
            "main": [
                [
                    {"node": "Build Prompt", "type": "main", "index": 0}
                ]
            ]
        },
        "Build Prompt": {
            "main": [
                [
                    {"node": "Gemini AI with Grounding", "type": "main", "index": 0}
                ]
            ]
        },
        "Gemini AI with Grounding": {
            "main": [
                [
                    {"node": "Parse & Validate", "type": "main", "index": 0}
                ]
            ]
        },
        "Parse & Validate": {
            "main": [
                [
                    {"node": "POST to TodayDecode API", "type": "main", "index": 0}
                ]
            ]
        },
        "POST to TodayDecode API": {
            "main": [
                [
                    {"node": "Format Result", "type": "main", "index": 0}
                ]
            ]
        }
    },
    "settings": {"executionOrder": "v1"},
    "tags": [{"name": "todaydecode"}, {"name": "commentary"}, {"name": "ai-content"}]
}

output_path = r'f:\TodayDecode\docs\TodayDecode_Commentary_Workflow.json'
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(workflow, f, indent=2, ensure_ascii=False)

print('File written successfully')
