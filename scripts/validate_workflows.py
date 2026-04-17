import json
import os

def validate_file(filepath):
    results = {"json": "FAIL", "placeholder": "FAIL", "no_em_dash": "FAIL"}
    
    # 1. Valid JSON check
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            json.loads(content)
            results["json"] = "PASS"
    except Exception:
        return results

    # 2. Key Placeholder check (PASTE_YOUR_GEMINI_KEY_HERE)
    if "PASTE_YOUR_GEMINI_KEY_HERE" in content:
        results["placeholder"] = "PASS"
    
    # Check for actual keys (AIza...)
    if "AIza" in content and "PASTE_YOUR_GEMINI_KEY_HERE" not in content:
        results["placeholder"] = "FAIL (HARDCODED KEY FOUND)"

    # 3. Em-Dash and En-Dash check
    # Em dash: \u2014, En dash: \u2013
    if "\u2014" not in content and "\u2013" not in content:
        results["no_em_dash"] = "PASS"
    else:
        results["no_em_dash"] = "FAIL (DASH FOUND)"

    return results

files_to_check = [
    "TodayDecode_Commentary_Workflow.json",
    "TodayDecode_NewsBrief_Workflow.json",
    "TodayDecode_CurrentAffairs_Workflow.json",
    "TodayDecode_PolicyBrief_Workflow.json",
    "TodayDecode_RiskAssessment_Workflow.json",
    "TodayDecode_DataInsight_Workflow.json",
    "TodayDecode_ScenarioAnalysis_Workflow.json",
    "TodayDecode_AnnualOutlook_Workflow.json",
    "TodayDecode_PolicyToolkit_Workflow.json",
    "TodayDecode_StrategicReport_Workflow.json"
]

docs_dir = r"f:\TodayDecode\docs"
scripts_dir = r"f:\TodayDecode\scripts"

print("TodayDecode Workflow Validation Report")
print("-" * 40)

for filename in files_to_check:
    path = os.path.join(docs_dir, filename)
    if os.path.exists(path):
        res = validate_file(path)
        overall = "PASS" if all(v == "PASS" for v in res.values()) else "FAIL"
        print(f"{filename:.<45} {overall}")
        if overall == "FAIL":
            print(f"  -> Details: {res}")
    else:
        print(f"{filename:.<45} MISSING")

# Check source script too
source_script = os.path.join(scripts_dir, "generate_workflow.py")
if os.path.exists(source_script):
    res = validate_file(source_script)
    # Note: Source script might not be valid JSON, so we skip that check for .py
    res["json"] = "PASS" 
    overall = "PASS" if all(v == "PASS" for v in res.values()) else "FAIL"
    print(f"generate_workflow.py (source)............. {overall}")
    if overall == "FAIL":
        print(f"  -> Details: {res}")
