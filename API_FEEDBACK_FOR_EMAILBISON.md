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

### 1. GET Tag (Single) Returns 403 Forbidden - Authorization Bug

**Issue:**
The `GET /api/tags/{id}` endpoint returns a 403 Forbidden error for ALL tag IDs, even tags that clearly belong to the authenticated user's workspace.

**Error Message:**
```json
{
  "data": {
    "success": false,
    "message": "This action is unauthorized. The api key does not match the workspace the record is on."
  }
}
```

**Proof of Bug:**
The error message claims the API key doesn't match the workspace, but this is contradicted by the fact that `GET /api/tags` (Get Many Tags) works perfectly and returns the same tag IDs.

**CLI Test Results:**

```bash
# Test 1: Get Many Tags - ✅ WORKS
curl -X GET "https://send.topoffunnel.com/api/tags" \
  -H "Authorization: Bearer YOUR_API_TOKEN"

Response: HTTP 200 OK
{
  "data": [
    {"id": 12, "name": "Meeting Booked", "default": true, ...},
    {"id": 61, "name": "Test Lead", "default": false, ...},
    ...17 tags total
  ]
}

# Test 2: Get Single Tag (ID 12) - ❌ FAILS
curl -X GET "https://send.topoffunnel.com/api/tags/12" \
  -H "Authorization: Bearer YOUR_API_TOKEN"

Response: HTTP 403 Forbidden
{
  "data": {
    "success": false,
    "message": "This action is unauthorized. The api key does not match the workspace the record is on."
  }
}

# Test 3: Get Single Tag (ID 61) - ❌ FAILS
curl -X GET "https://send.topoffunnel.com/api/tags/61" \
  -H "Authorization: Bearer YOUR_API_TOKEN"

Response: HTTP 403 Forbidden
{
  "data": {
    "success": false,
    "message": "This action is unauthorized. The api key does not match the workspace the record is on."
  }
}
```

**Impact:**
- Users cannot retrieve individual tag details via API
- Workflow automation requiring tag details is blocked
- Inconsistent API behavior creates confusion
- Forces users to use GET Many Tags and filter client-side

**Root Cause:**
The authorization check in the `GET /api/tags/{id}` endpoint appears to be incorrectly implemented. The endpoint is checking workspace ownership but failing even for tags that belong to the workspace.

**Recommendation:**
Fix the authorization logic in the `GET /api/tags/{id}` endpoint to match the behavior of `GET /api/tags`. The endpoint should:
- Accept the same API token that works for GET Many Tags
- Return tag details for tags belonging to the authenticated user's workspace
- Return 404 Not Found (not 403 Forbidden) if the tag doesn't exist
- Return 403 only if the tag exists but belongs to a different workspace

**Priority:** HIGH - This is a critical API bug affecting a core endpoint

**Testing Date:** 2025-10-27
**Documented In:** GET_OPERATIONS_TEST_RESULTS.md

---

### 2. GET Many Webhooks Endpoint Does Not Exist

**Issue:**
The `GET /api/webhooks` endpoint does not exist in the EmailBison API, returning a 404 "route not found" error.

**Error Message:**
```json
{
  "data": {
    "success": false,
    "message": "The route api/webhooks could not be found.",
    "record_not_found": null
  }
}
```

**CLI Test:**

```bash
curl -X GET "https://send.topoffunnel.com/api/webhooks" \
  -H "Authorization: Bearer YOUR_API_TOKEN"

Response: HTTP 404 Not Found
{
  "data": {
    "success": false,
    "message": "The route api/webhooks could not be found.",
    "record_not_found": null
  }
}
```

**Impact:**
- Users cannot list their configured webhooks via API
- Webhook management workflows are incomplete
- Users must manually check the dashboard to see what webhooks exist
- Cannot build webhook audit/monitoring automation

**Use Cases Blocked:**
- Listing all configured webhooks
- Webhook inventory/audit workflows
- Automated webhook configuration management
- Webhook health monitoring

**Recommendation:**
Implement the `GET /api/webhooks` endpoint to return a list of all webhooks for the authenticated user's workspace.

**Suggested Implementation:**
```
GET /api/webhooks
Authorization: Bearer YOUR_API_TOKEN

Response: HTTP 200 OK
{
  "data": [
    {
      "id": 1,
      "url": "https://example.com/webhook",
      "events": ["email.sent", "email.opened"],
      "name": "My Webhook",
      "created_at": "2025-01-15T10:30:00.000000Z",
      "updated_at": "2025-01-15T10:30:00.000000Z"
    }
  ]
}
```

**Priority:** MEDIUM - Webhook management is important but individual webhook operations may still work

**Testing Date:** 2025-10-27
**Documented In:** GET_OPERATIONS_TEST_RESULTS.md

---

### 3. GET Many Sequence Steps Returns "Record not found"

**Issue:**
The `GET /api/campaigns/sequence-steps` endpoint returns a "Record not found" error with a strange message suggesting it's looking for a campaign named "sequence-steps".

**Error Message:**
```json
{
  "data": {
    "success": false,
    "message": "Record not found.",
    "record_not_found": {
      "campaign": "sequence-steps"
    }
  }
}
```

**CLI Test Results:**

```bash
# Test 1: Without campaign_id parameter
curl -X GET "https://send.topoffunnel.com/api/campaigns/sequence-steps" \
  -H "Authorization: Bearer YOUR_API_TOKEN"

Response:
{
  "data": {
    "success": false,
    "message": "Record not found.",
    "record_not_found": {"campaign": "sequence-steps"}
  }
}

# Test 2: With valid campaign_id parameter (campaign ID 4 exists)
curl -X GET "https://send.topoffunnel.com/api/campaigns/sequence-steps?campaign_id=4" \
  -H "Authorization: Bearer YOUR_API_TOKEN"

Response:
{
  "data": {
    "success": false,
    "message": "Record not found.",
    "record_not_found": {"campaign": "sequence-steps"}
  }
}
```

**Analysis:**
- The endpoint exists (different error than webhooks)
- Returns "Record not found" even with valid campaign IDs
- Error structure `{"campaign": "sequence-steps"}` suggests the API is treating "sequence-steps" as a campaign ID
- This appears to be an API routing bug where the route is incorrectly parsing the URL

**Impact:**
- Users cannot list sequence steps for campaigns via API
- Campaign automation workflows are incomplete
- Cannot build sequence step management automation

**Possible Root Causes:**
1. The route is incorrectly configured and treating "sequence-steps" as a campaign ID
2. The endpoint structure is different than expected (e.g., `/api/campaigns/{id}/sequence-steps`)
3. The endpoint requires different parameters or authentication

**Recommendation:**
Clarify the correct endpoint structure for retrieving sequence steps. Options:

**Option A: Fix Current Endpoint**
```
GET /api/campaigns/sequence-steps?campaign_id=4
```

**Option B: Use Campaign-Specific Endpoint**
```
GET /api/campaigns/{campaign_id}/sequence-steps
```

**Option C: Separate Sequence Steps Resource**
```
GET /api/sequence-steps?campaign_id=4
```

Please confirm which approach is correct and fix the routing/authorization accordingly.

**Priority:** MEDIUM - Sequence step management is important for campaign automation

**Testing Date:** 2025-10-27
**Documented In:** GET_OPERATIONS_TEST_RESULTS.md

---

### 4. Missing DELETE Lead Endpoint

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

### 5. Hard Limit of 15 Leads Per Request (GET /api/leads)

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

1. **GET Tag (Single):**
   - Commented out the GET operation in the n8n node (2025-10-27)
   - Added detailed code comments explaining the API bug
   - Preserved code structure for easy re-enablement when API is fixed
   - Users must use GET Many Tags and filter client-side

2. **GET Many Webhooks:**
   - Commented out the GET Many operation in the n8n node (2025-10-27)
   - Added code comments indicating the endpoint doesn't exist
   - Individual webhook operations (Get, Create, Update, Delete) may still work
   - Preserved code structure for easy re-enablement when endpoint is added

3. **GET Many Sequence Steps:**
   - Commented out the GET Many operation in the n8n node (2025-10-27)
   - Added code comments explaining the "Record not found" error
   - Changed default operation from 'getMany' to 'sendTest'
   - Preserved code structure for easy re-enablement when API is fixed

4. **DELETE Lead:**
   - Commented out the DELETE operation in the n8n node
   - Added code comments indicating the endpoint doesn't exist
   - Preserved code structure for easy re-enablement when endpoint is added

5. **GET MANY Leads:**
   - Added warning messages in field descriptions:
     - "⚠️ WARNING: The EmailBison API ignores this parameter and always returns a maximum of 15 leads per request."
   - Documented all available filter options to help users narrow results
   - Cannot implement "Return All" functionality due to API limitation

### User Experience Impact:

**Without GET Tag (Single):**
- Users cannot retrieve individual tag details
- Must use GET Many Tags and filter client-side (inefficient)
- Inconsistent API behavior creates confusion
- Reduces trust in API reliability

**Without GET Many Webhooks:**
- Users cannot list configured webhooks
- Webhook management workflows are incomplete
- Must manually check dashboard to see what webhooks exist
- Cannot build webhook audit/monitoring automation

**Without GET Many Sequence Steps:**
- Users cannot list sequence steps for campaigns
- Campaign automation workflows are incomplete
- Cannot build sequence step management automation
- Unclear what the correct endpoint structure should be

**Without DELETE Lead endpoint:**
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
| Fix GET Tag Authorization Bug | CRITICAL | Low | High | Immediate |
| Implement GET Many Webhooks | HIGH | Low | Medium | Next Sprint |
| Fix/Clarify Sequence Steps Endpoint | MEDIUM | Low-Medium | Medium | Next Sprint |
| DELETE Lead Endpoint | HIGH | Low | High | Next Sprint |
| Pagination Support | HIGH | Medium | Very High | Q1 2026 |
| Increase Hard Limit (stopgap) | MEDIUM | Very Low | Medium | Immediate |

---

## 💡 Additional Suggestions

### 6. Bulk Operations
Consider adding bulk endpoints for common operations:
- `POST /api/leads/bulk/delete` - Delete multiple leads at once
- `GET /api/leads/export` - Export all leads as CSV/JSON (async job)

### 7. Webhooks for Lead Events
Add webhook events for:
- `lead.created`
- `lead.updated`
- `lead.deleted` (when endpoint is added)

This would enable real-time synchronization without polling.

### 8. API Documentation Improvements
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

