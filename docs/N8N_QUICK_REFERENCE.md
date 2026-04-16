# TodayDecode N8N API - Quick Reference

## 🚀 INSTANT TEST

```bash
curl -X POST http://localhost:3001/api/n8n/ingest/ \
  -H "Content-Type: application/json" \
  -H "x-n8n-secret: 0f9308d261f24fd5bf75c3f2859cd9c1d0fe9a1a9baf459994d3405084695fe7" \
  -d '{"title":"Test","summary":"Summary","content":"Content","format":"COMMENTARY","categoryId":"cmnw30ddz0001kisz5twwny30","authorId":"cmnzrwf6c000aki0f8ssj29vz"}'
```

## 🔑 CRITICAL VALUES


API Endpoint: http://localhost:3001/api/n8n/ingest/
Secret: 0f9308d261f24fd5bf75c3f2859cd9c1d0fe9a1a9baf459994d3405084695fe7
Category ID: cmnw30ddz0001kisz5twwny30
Author ID: cmnzrwf6c000aki0f8ssj29vz
Database: todaydecode_prod:5433

## 📁 KEY FILES
API Route: /opt/apps/todaydecode/code/src/app/api/n8n/ingest/route.ts
Environment: /opt/apps/todaydecode/code/.env
Documentation: /opt/apps/todaydecode/code/docs/

## 🛠️ ESSENTIAL COMMANDS

```bash
# Restart
pm2 restart todaydecode --update-env

# Logs
pm2 logs todaydecode --lines 20

# Database
PGPASSWORD=TdSecure2026Prod psql -h 127.0.0.1 -p 5433 -U td_user -d todaydecode_prod

# Rebuild
cd /opt/apps/todaydecode/code && npm run build
```

## ✅ STATUS

**Phase 1:** COMPLETE ✅  
- CREATE works
- UPDATE works
- Upsert deployed

**Next:** N8N Workflow or Google AI Integration

