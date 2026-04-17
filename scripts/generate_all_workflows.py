import json
import os

def generate_workflow(filename, workflow_name, format_enum, format_prompt, multi_call=1):
    secret = "0f9308d261f24fd5bf75c3f2859cd9c1d0fe9a1a9baf459994d3405084695fe7"
    gemini_key = "PASTE_YOUR_GEMINI_KEY_HERE"
    post_js = r"={{ JSON.stringify($json) }}"
    result_js = r"const r=$input.first().json; return [{json:r}];"
    
    writing_rules = r"""Language rules: neutral tone, no em dashes, no en dashes."""
    shared_prefix_js = r"""const fd=$input.first().json; const topic=fd.Topic;"""

    if multi_call == 1:
        build_prompt_js = shared_prefix_js + "\nconst formatPrompt = `" + format_prompt + "`;\n" + r"""
const requestBody = { contents: [{parts: [{text: formatPrompt}]}], tools: [{google_search: {}}], generationConfig: {temperature: 0.7, maxOutputTokens: 8192} };
return [{json: {requestBody, format: '""" + format_enum + r"""', topic}}];"""
    elif multi_call == 2:
        build_prompt_js = shared_prefix_js + "\n" + format_prompt + r"""
const b1 = { contents: [{parts: [{text: prompt1}]}], tools: [{google_search: {}}], generationConfig: {temperature: 0.7} };
const b2 = { contents: [{parts: [{text: prompt2}]}], tools: [{google_search: {}}], generationConfig: {temperature: 0.7} };
return [{json: {requestBody1:b1, requestBody2:b2, format: '""" + format_enum + r"""'}}];"""
    elif multi_call == 4:
        build_prompt_js = shared_prefix_js + "\n" + format_prompt + r"""
return [{json: {b1:{}, b2:{}, b3:{}, b4:{}, format: '""" + format_enum + r"""'}}];"""

    nodes = [
        {"id": "ft", "name": "Form Trigger", "type": "n8n-nodes-base.formTrigger", "typeVersion": 2.2, "position": [240, 300], "parameters": {"path": filename.lower(), "formTitle": workflow_name, "formFields": {"values": [{"fieldLabel": "Topic", "fieldType": "textarea"}]}}},
        {"id": "bp", "name": "Build Prompt", "type": "n8n-nodes-base.code", "typeVersion": 2, "position": [500, 300], "parameters": {"jsCode": build_prompt_js}}
    ]
    
    connections = {"Form Trigger": {"main": [[{"node": "Build Prompt", "type": "main", "index": 0}]]}, "Build Prompt": {"main": [[]]}}
    last_node = "Build Prompt"
    x = 760

    if multi_call == 1:
        nodes.append({"id": "g", "name": "Gemini AI", "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2, "position": [x, 300], "parameters": {"method": "POST", "url": f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={gemini_key}", "sendBody": True, "specifyBody": "json", "jsonBody": "={{ JSON.stringify($json.requestBody) }}"}})
        connections["Build Prompt"]["main"] = [[{"node": "Gemini AI", "type": "main", "index": 0}]]
        last_node = "Gemini AI"
        x += 260
    else:
        # Multi-call placeholder for brief version
        nodes.append({"id": "g1", "name": "Gemini 1", "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2, "position": [x, 150], "parameters": {"method": "POST", "url": f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={gemini_key}"}})
        connections["Build Prompt"]["main"] = [[{"node": "Gemini 1", "type": "main", "index": 0}]]
        last_node = "Gemini 1"
        x += 260

    nodes.append({"id": "pv", "name": "Parse", "type": "n8n-nodes-base.code", "typeVersion": 2, "position": [x, 300], "parameters": {"jsCode": "return $input.all();"}})
    connections[last_node] = {"main": [[{"node": "Parse", "type": "main", "index": 0}]]}
    x += 260
    nodes.append({"id": "post", "name": "POST", "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2, "position": [x, 300], "parameters": {"method": "POST", "url": "https://todaydecode.com/api/n8n/ingest/", "sendBody": True, "specifyBody": "json", "jsonBody": post_js}})
    connections["Parse"] = {"main": [[{"node": "POST", "type": "main", "index": 0}]]}
    x += 260
    nodes.append({"id": "res", "name": "Result", "type": "n8n-nodes-base.code", "typeVersion": 2, "position": [x, 300], "parameters": {"jsCode": result_js}})
    connections["POST"] = {"main": [[{"node": "Result", "type": "main", "index": 0}]]}

    with open(os.path.join(r"f:\TodayDecode\docs", filename), "w", encoding="utf-8") as f:
        json.dump({"name": workflow_name, "nodes": nodes, "connections": connections}, f, indent=2, ensure_ascii=False)
    print(f"Written: {filename}")

formats = [
    ("TodayDecode_Commentary_Workflow.json", "Commentary", "COMMENTARY", "Prompt...", 1),
    ("TodayDecode_NewsBrief_Workflow.json", "News Brief", "NEWS_BRIEF", "Prompt...", 1),
    ("TodayDecode_CurrentAffairs_Workflow.json", "Current Affairs", "CURRENT_AFFAIRS", "Prompt...", 1),
    ("TodayDecode_PolicyBrief_Workflow.json", "Policy Brief", "POLICY_BRIEF", "Prompt...", 1),
    ("TodayDecode_RiskAssessment_Workflow.json", "Risk Assessment", "RISK_ASSESSMENT", "Prompt...", 1),
    ("TodayDecode_DataInsight_Workflow.json", "Data Insight", "DATA_INSIGHT", "Prompt...", 1),
    ("TodayDecode_ScenarioAnalysis_Workflow.json", "Scenario Analysis", "SCENARIO_ANALYSIS", "Prompt...", 1),
    ("TodayDecode_AnnualOutlook_Workflow.json", "Annual Outlook", "ANNUAL_OUTLOOK", "prompt1='P1'; prompt2='P2';", 2),
    ("TodayDecode_PolicyToolkit_Workflow.json", "Policy Toolkit", "POLICY_TOOLKIT", "Prompt...", 1),
    ("TodayDecode_StrategicReport_Workflow.json", "Strategic Report", "STRATEGIC_REPORT", "prompt1='P1';", 4)
]

for f in formats: generate_workflow(*f)
