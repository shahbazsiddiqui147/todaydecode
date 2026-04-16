# Checklist for Next Claude Instance

## 🎯 START HERE (First 5 Minutes)

1. **Read these files:**
   - `/opt/apps/todaydecode/code/docs/N8N_PROJECT_SUMMARY.md`
   - `/opt/apps/todaydecode/code/docs/N8N_QUICK_REFERENCE.md`

2. **Run quick test:**
```bash
curl -X POST http://localhost:3001/api/n8n/ingest/ \
  -H "Content-Type: application/json" \
  -H "x-n8n-secret: 0f9308d261f24fd5bf75c3f2859cd9c1d0fe9a1a9baf459994d3405084695fe7" \
  -d '{"title":"Claude Test","summary":"Test","content":"Test","format":"COMMENTARY","categoryId":"cmnw30ddz0001kisz5twwny30","authorId":"cmnzrwf6c000aki0f8ssj29vz"}'
```

**Expected:** `{"action":"created",...}`

3. **Ask user:** "Which phase do you want to work on?"

---

## 📋 WHAT'S COMPLETE

✅ **Phase 1: API Upsert Working**
- CREATE functionality tested ✅
- UPDATE functionality tested ✅
- Authentication working ✅
- Database integration complete ✅
- Upsert logic deployed ✅

---

## 🚀 NEXT OPTIONS

### A. N8N Workflow Setup
**Ask:** "Do you have N8N installed?"  
**Tasks:** Import workflow, configure nodes, test

### B. Google AI Integration
**Ask:** "Do you have Google AI Studio API key?"  
**Tasks:** Configure AI node, test generation

### C. Documentation & Testing
**Tasks:** Update docs, create runbook, test all formats

---

## 🔑 CRITICAL VALUES (Quick Copy-Paste)

API: http://localhost:3001/api/n8n/ingest/
Secret: 0f9308d261f24fd5bf75c3f2859cd9c1d0fe9a1a9baf459994d3405084695fe7
Category: cmnw30ddz0001kisz5twwny30
Author: cmnzrwf6c000aki0f8ssj29vz
Database: todaydecode_prod
Port: 5433

---

## ⚠️ COMMON MISTAKES TO AVOID

❌ **DON'T:**
- Use literal "ARTICLE_ID_HERE" in tests
- Skip `npm run build` after code changes
- Forget trailing slash: `/api/n8n/ingest/`
- Assume Antigravity changes are deployed

✅ **DO:**
- Test CREATE/UPDATE before starting
- Verify code changes are actually in file
- Use real article IDs from CREATE response
- Check `pm2 logs` if 500 error

---

## 📞 IF SOMETHING BREAKS

### API returns 403
```bash
cat /opt/apps/todaydecode/code/.env | grep N8N_INGEST_SECRET
```

### API returns 500
```bash
pm2 logs todaydecode --err --lines 30
```

### Database fails
```bash
PGPASSWORD=TdSecure2026Prod psql -h 127.0.0.1 -p 5433 -U td_user -d todaydecode_prod -c "SELECT 1;"
```

### Article not updating
- Verify `id` field is in request body
- Use a real article ID from previous CREATE
- Don't use the literal text "ARTICLE_ID_HERE"

---

## ✅ SESSION COMPLETE CHECKLIST

Before ending session:
- [ ] User knows what was accomplished
- [ ] All changes documented
- [ ] Tests recorded
- [ ] Next steps clear
- [ ] Blockers identified

---

**Created:** April 16, 2026  
**Purpose:** Ensure smooth handoff to next Claude instance