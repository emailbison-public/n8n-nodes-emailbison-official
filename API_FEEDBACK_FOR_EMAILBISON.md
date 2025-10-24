# EmailBison API Feedback & Feature Requests

**Date:** October 19, 2025  
**From:** n8n Integration Development Team  
**To:** EmailBison Founder/Product Team  
**Subject:** API Limitations & Feature Requests for Enhanced Integration

---

## Executive Summary

While developing the official n8n integration for EmailBison, we've identified several API limitations that impact the user experience and workflow automation capabilities. This document outlines these limitations and provides recommendations for API improvements that would significantly enhance the platform's automation potential.

---

## 🚨 Critical Issues

### 1. Missing DELETE Lead Endpoint

**Issue:**  
The EmailBison API does not provide a `DELETE /api/leads/{lead_id}` endpoint.

**Impact:**
- Users cannot programmatically remove leads from their database
- Workflow automation for lead cleanup is impossible
- Manual deletion through the dashboard is the only option
- GDPR/data privacy compliance workflows cannot be automated

**Use Cases Blocked:**
- Automated removal of bounced/invalid leads
- GDPR "right to be forgotten" automation
- Lead list cleanup workflows
- Duplicate lead removal automation
- Test lead cleanup in development environments

**Recommendation:**  
Add a `DELETE /api/leads/{lead_id}` endpoint that:
- Permanently removes a lead from the workspace
- Returns a success confirmation with the deleted lead ID
- Optionally supports bulk deletion via `DELETE /api/leads/bulk` with an array of lead IDs

**Example Implementation:**
```
DELETE /api/leads/{lead_id}
Authorization: Bearer YOUR_API_TOKEN

Response:
{
  "success": true,
  "message": "Lead successfully deleted",
  "data": {
    "id": 12345,
    "email": "deleted@example.com"
  }
}
```

**Priority:** HIGH - This is a fundamental CRUD operation that users expect

---

## ⚠️ Pagination Limitations

### 2. Hard Limit of 15 Leads Per Request (GET /api/leads)

**Issue:**  
The `GET /api/leads` endpoint returns a maximum of 15 leads per request with no pagination support.

**Current Behavior:**
- API returns exactly 15 leads regardless of query parameters
- No `limit`, `per_page`, or `page` parameters are supported
- Response includes pagination metadata (`meta.total`, `meta.last_page`, `links.next`) but no way to access additional pages
- Users with 4,000+ leads can only retrieve 15 at a time

**Impact:**
- Impossible to retrieve full lead lists for analysis
- Cannot sync all leads to external systems (CRM, data warehouse, etc.)
- Workflow automation limited to first 15 leads only
- Users must manually export data from dashboard instead of using API

**Example of Misleading Response:**
```json
{
  "data": [ /* 15 leads */ ],
  "meta": {
    "current_page": 1,
    "last_page": 269,
    "per_page": 15,
    "total": 4024
  },
  "links": {
    "next": "https://send.topoffunnel.com/api/leads?page=2"
  }
}
```
**Problem:** The `links.next` URL suggests pagination exists, but the `page` parameter is not documented and does not work.

**Workarounds Attempted:**
- ❌ Setting `limit=100` parameter - Ignored by API
- ❌ Setting `per_page=100` parameter - Not supported
- ❌ Using `page=2` parameter - Not documented, behavior unknown
- ✅ Using `search` and `filters` - Works but requires knowing specific criteria

**Recommendation:**  
Implement proper pagination support with one of these approaches:

**Option A: Cursor-Based Pagination (Recommended)**
```
GET /api/leads?limit=100&cursor=eyJpZCI6MTIzNDV9

Response:
{
  "data": [ /* up to 100 leads */ ],
  "pagination": {
    "next_cursor": "eyJpZCI6MTIzNDV9",
    "has_more": true
  }
}
```

**Option B: Page-Based Pagination**
```
GET /api/leads?page=2&per_page=100

Response:
{
  "data": [ /* up to 100 leads */ ],
  "meta": {
    "current_page": 2,
    "per_page": 100,
    "total": 4024,
    "last_page": 41
  }
}
```

**Option C: Increase Hard Limit**
- If pagination is not feasible, increase the hard limit from 15 to at least 100 or 500
- Add a `limit` parameter that actually works (e.g., `limit=100`)

**Priority:** HIGH - This severely limits API usability for users with large lead databases

---

## 📊 Impact on n8n Integration

### Current Workarounds Implemented:

1. **DELETE Lead:**
   - Commented out the DELETE operation in the n8n node
   - Added code comments indicating the endpoint doesn't exist
   - Preserved code structure for easy re-enablement when endpoint is added

2. **GET MANY Leads:**
   - Added warning messages in field descriptions:
     - "⚠️ WARNING: The EmailBison API ignores this parameter and always returns a maximum of 15 leads per request."
   - Documented all available filter options to help users narrow results
   - Cannot implement "Return All" functionality due to API limitation

### User Experience Impact:

**Without DELETE endpoint:**
- Users must switch between n8n and EmailBison dashboard for lead management
- Breaks automation workflows that require lead cleanup
- Reduces trust in API completeness

**Without Pagination:**
- Users cannot build comprehensive reporting workflows
- Lead synchronization to external systems is incomplete
- Data analysis workflows are limited to 15-lead samples
- Users frustrated by seeing "269 pages" but unable to access them

---

## 🎯 Recommended Priority

| Feature | Priority | Effort | Impact | Timeline Suggestion |
|---------|----------|--------|--------|---------------------|
| DELETE Lead Endpoint | HIGH | Low | High | Next Sprint |
| Pagination Support | HIGH | Medium | Very High | Q1 2026 |
| Increase Hard Limit (stopgap) | MEDIUM | Very Low | Medium | Immediate |

---

## 💡 Additional Suggestions

### 3. Bulk Operations
Consider adding bulk endpoints for common operations:
- `POST /api/leads/bulk/delete` - Delete multiple leads at once
- `GET /api/leads/export` - Export all leads as CSV/JSON (async job)

### 4. Webhooks for Lead Events
Add webhook events for:
- `lead.created`
- `lead.updated`
- `lead.deleted` (when endpoint is added)

This would enable real-time synchronization without polling.

### 5. API Documentation Improvements
- Remove pagination metadata from responses if pagination isn't supported
- Clearly document the 15-lead limit in the API reference
- Add examples showing how to use filters effectively to work around the limit

---

## 📞 Contact & Follow-Up

We're happy to discuss these recommendations in detail and provide technical guidance on implementation. Our team has extensive experience building API integrations and can offer insights on best practices.

**Questions or want to discuss?**
- We can provide code examples for suggested implementations
- We can test beta endpoints before public release
- We can update the n8n integration immediately when new endpoints are available

---

## Appendix: API Documentation Review

**Endpoint Analyzed:** `GET /api/leads`  
**Documentation URL:** https://send.topoffunnel.com/api/reference#tag/leads/get/api/leads

**Documented Query Parameters:**
- ✅ `search` (string)
- ✅ `filters.lead_campaign_status` (string)
- ✅ `filters.verification_statuses` (array)
- ✅ `filters.tag_ids` (array)
- ✅ `filters.excluded_tag_ids` (array)
- ✅ `filters.without_tags` (boolean)
- ✅ `filters.emails_sent` (object with criteria/value)
- ✅ `filters.opens` (object with criteria/value)
- ✅ `filters.replies` (object with criteria/value)
- ✅ `filters.created_at` (object with criteria/value)
- ✅ `filters.updated_at` (object with criteria/value)

**Missing Parameters:**
- ❌ `limit` or `per_page`
- ❌ `page` or `cursor`
- ❌ Any pagination mechanism

**Actual API Behavior:**
- Returns exactly 15 leads per request
- Includes pagination metadata in response
- Metadata suggests 269 pages exist but no way to access them

---

**Thank you for building EmailBison!** We're excited to bring your platform to the n8n community and look forward to these enhancements.

