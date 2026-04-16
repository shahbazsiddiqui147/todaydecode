# TodayDecode N8N API Integration - Complete Project Documentation

**Last Updated:** April 16, 2026  
**Status:** Phase 1 Complete - API Upsert Fully Working ✅

---

## 📋 WHAT WE ACCOMPLISHED

### ✅ Phase 1: API Upsert Implementation (COMPLETE)

**File Modified:** `/opt/apps/todaydecode/code/src/app/api/n8n/ingest/route.ts`

**Features:**
- **CREATE:** No `id` in request → creates new article
- **UPDATE:** Include `id` in request → updates existing article
- **Auth:** Header-based using `x-n8n-secret`
- **Response:** Returns `action` field ("created" or "updated")

**Core Logic:**
```typescript
if (id) {
  article = await prisma.article.update({ where: { id }, data: articleData });
  action = 'updated';
} else {
  article = await prisma.article.create({ data: articleData });
  action = 'created';
}
```

---

## 📁 FILES MODIFIED

1. **`/opt/apps/todaydecode/code/src/app/api/n8n/ingest/route.ts`**
   - Added `id` and `status` to request destructuring
   - Created reusable `articleData` object
   - Added conditional upsert logic (if/else)
   - Added `action` field to response
   - Fixed TypeScript type: `status: (status || 'DRAFT') as any`

2. **`/opt/apps/todaydecode/code/.env`**
   - Verified `N8N_INGEST_SECRET` exists
   - Verified `DATABASE_URL` configuration
   - Removed duplicate entries

---

## 🧪 TESTING RESULTS

### CREATE Test ✅
```bash
curl -X POST http://localhost:3001/api/n8n/ingest/ \
  -H "Content-Type: application/json" \
  -H "x-n8n-secret: 0f9308d261f24fd5bf75c3f2859cd9c1d0fe9a1a9baf459994d3405084695fe7" \
  -d '{
    "title": "New Article",
    "summary": "Summary",
    "content": "Content",
    "format": "COMMENTARY",
    "categoryId": "cmnw30ddz0001kisz5twwny30",
    "authorId": "cmnzrwf6c000aki0f8ssj29vz"
  }'
```

**Result:** `{"action":"created","articleId":"cmo18w10t0001ki79kdzv8426",...}`

### UPDATE Test ✅
```bash
curl -X POST http://localhost:3001/api/n8n/ingest/ \
  -H "Content-Type: application/json" \
  -H "x-n8n-secret: 0f9308d261f24fd5bf75c3f2859cd9c1d0fe9a1a9baf459994d3405084695fe7" \
  -d '{
    "id": "cmo18w10t0001ki79kdzv8426",
    "title": "Updated Title",
    "summary": "Updated",
    "content": "Updated",
    "format": "COMMENTARY",
    "categoryId": "cmnw30ddz0001kisz5twwny30",
    "authorId": "cmnzrwf6c000aki0f8ssj29vz"
  }'
```

**Result:** `{"action":"updated","articleId":"cmo18w10t0001ki79kdzv8426",...}` (SAME ID)

---

## 🐛 ISSUES RESOLVED

1. **Wrong Database** - Fixed: `todaydecode_prod` on port `5433`
2. **Auth Failed** - Fixed: Added `x-n8n-secret` header
3. **Foreign Key Error** - Fixed: Used `Author` table ID not `User` table ID
4. **URL Redirect** - Fixed: Added trailing slash `/api/n8n/ingest/`
5. **Duplicate .env** - Fixed: Removed duplicate entry
6. **Upsert Not Working** - Fixed: Manually added logic, rebuilt app
7. **TypeScript Error** - Fixed: Cast status as `any`

---

## 🔑 CONFIGURATION

### Database

Name: todaydecode_prod
Port: 5433
User: td_user
Password: TdSecure2026Prod

### API
URL: http://localhost:3001/api/n8n/ingest/
Header: x-n8n-secret
Secret: 0f9308d261f24fd5bf75c3f2859cd9c1d0fe9a1a9baf459994d3405084695fe7

### IDs
Author (Desk): cmnzrwf6c000aki0f8ssj29vz
Category (Geopolitics): cmnw30ddz0001kisz5twwny30

### Valid Values
Formats: POLICY_BRIEF, STRATEGIC_REPORT, COMMENTARY, SCENARIO_ANALYSIS,
RISK_ASSESSMENT, DATA_INSIGHT, ANNUAL_OUTLOOK, POLICY_TOOLKIT
Status: DRAFT, PUBLISHED, ARCHIVED

---

## 🚀 NEXT STEPS

### Phase 2: N8N Workflow Setup
- Import workflow JSON
- Configure HTTP node to call API
- Set up Google AI node
- Test end-to-end

### Phase 3: Google AI Integration
- Get API key from Google AI Studio
- Test article generation
- Use prompts from `/opt/apps/todaydecode/code/docs/N8N_ARTICLE_PROMPTS_ALL_TYPES.md`

---

## 🛠️ USEFUL COMMANDS

```bash
# Restart app
pm2 restart todaydecode --update-env

# Check logs
pm2 logs todaydecode --lines 30

# Database query
PGPASSWORD=TdSecure2026Prod psql -h 127.0.0.1 -p 5433 -U td_user -d todaydecode_prod

# Rebuild after changes
cd /opt/apps/todaydecode/code && npm run build
```

---

## 📞 TROUBLESHOOTING

**403 Error:** Check `x-n8n-secret` header matches .env  
**500 Error:** Check `pm2 logs todaydecode --err`  
**DB Error:** Verify port 5433 and database name  
**No Update:** Ensure `id` field is in request body

---

**Document Created:** April 16, 2026  
**Session Duration:** ~2 hours  
**Achievement:** Full API upsert deployed and tested ✅