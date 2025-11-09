# EmailBison n8n Node - V1 Release Checklist

## 🎯 Goal
Verify all implemented operations work correctly with the EmailBison API before v1 release.

---

## ✅ Critical Tests for V1 Release (Complete These First!)

### Test 1: Create a Lead
**Status:** ✅ TESTED & WORKING
**Priority:** CRITICAL

**Steps:**
1. Add EmailBison node to workflow
2. Select Resource: **Lead**
3. Select Operation: **Create**
4. Fill in:
   - Email: `test@testexample.com`
   - First Name: `Test`
   - Last Name: `Testing`
   - Company: `Test Company`
   - Tags: Select from dropdown
5. Execute node

**Expected Result:**
- ✅ No errors
- ✅ Returns lead object with ID
- ✅ Lead appears in EmailBison dashboard
- ✅ Tags properly attached via two-step process

**Actual Result:** ✅ **PASS** - Lead created successfully with ID 33500. Two-step process working perfectly (create lead → attach tags). Tags dropdown working correctly. Lead appears in EmailBison UI with all data populated.

---

### Test 2: Get Many Leads
**Status:** ⏳ NOT TESTED
**Priority:** CRITICAL

**Steps:**
1. Add EmailBison node
2. Select Resource: **Lead**
3. Select Operation: **Get Many**
4. Set Return All: **OFF**
5. Set Limit: **10**
6. Execute node

**Expected Result:**
- ✅ No errors
- ✅ Returns array of leads (15 due to API pagination)
- ✅ Each lead has id, email, first_name, last_name

**Actual Result:** _[Fill in after testing]_

---

### Test 3: Update a Lead
**Status:** ⏳ NOT TESTED
**Priority:** CRITICAL (Field ordering fix verification)

**Steps:**
1. Add EmailBison node
2. Select Resource: **Lead**
3. Select Operation: **Update**
4. **VERIFY:** Lead dropdown appears FIRST (before other fields)
5. Select a lead from dropdown
6. Update First Name: `Updated Test`
7. Execute node

**Expected Result:**
- ✅ Lead dropdown appears FIRST (at top)
- ✅ No errors
- ✅ Returns updated lead object
- ✅ Changes reflected in EmailBison dashboard

**Actual Result:** _[Fill in after testing]_

---

### Test 4: Create a Campaign
**Status:** ✅ TESTED & WORKING
**Priority:** CRITICAL

**Steps:**
1. Add EmailBison node
2. Select Resource: **Campaign**
3. Select Operation: **Create**
4. Fill in required fields:
   - Name: `Test Campaign n8n`
   - Subject: `Test Subject`
   - Email Content: `<p>Test email content</p>`
   - Sender Emails: Select from dropdown
5. Execute node

**Expected Result:**
- ✅ No errors
- ✅ Returns campaign ID
- ✅ Campaign appears in EmailBison dashboard
- ✅ Sender emails attached correctly
- ✅ First sequence step created with subject and content

**Actual Result:** ✅ **PASS** - Campaign created successfully with all data populated. Three-step process (create campaign → attach sender emails → create sequence step) working perfectly. Campaign appears in EmailBison UI with STEP 1 showing correct subject and email content.

---

### Test 5: Get Many Campaigns
**Status:** ⏳ NOT TESTED
**Priority:** CRITICAL

**Steps:**
1. Add EmailBison node
2. Select Resource: **Campaign**
3. Select Operation: **Get Many**
4. Execute node

**Expected Result:**
- ✅ No errors
- ✅ Returns array of campaigns
- ✅ Campaign dropdown works in other operations

**Actual Result:** _[Fill in after testing]_

---

### Test 6: Compose Email (Send One-off Email)
**Status:** ⏳ NOT TESTED
**Priority:** HIGH

**Steps:**
1. Add EmailBison node
2. Select Resource: **Reply**
3. Select Operation: **Compose Email**
4. Fill in:
   - Sender Email ID: `[your-email-account-id]`
   - Recipient Email: `test@example.com`
   - Subject: `Test from n8n`
   - Body: `This is a test email sent via n8n`
5. Execute node

**Expected Result:**
- ✅ No errors
- ✅ Email sent successfully
- ✅ Recipient receives email

**Actual Result:** _[Fill in after testing]_

---

## 📊 Test Results Summary

| Test | Status | Pass/Fail | Notes |
|------|--------|-----------|-------|
| 1. Create Lead | ✅ | PASS | Two-step process working (create → attach tags) |
| 1b. Get Lead | ✅ | PASS | Lead dropdown working, returns full lead data |
| 2. Get Many Leads | ✅ | PASS ⚠️ | **API Limitation**: Always returns 15 items max (API ignores limit param) |
| 3. Update Lead | ✅ | PASS ⚠️ | ✅ first_name, last_name, company confirmed<br>❓ phone, email not in response (can't verify)<br>❌ custom_fields not appearing in response |
| 3b. Attach Tags to Leads | ✅ | PASS | Bulk operation with dynamic dropdowns - UI validation fixed |
| 4. Create Campaign | ✅ | PASS | Three-step process working perfectly - UI validation fixed |
| 4b. Add Sequence Step | ✅ | PASS | Campaign dropdown working, steps added correctly |
| 4c. Delete Sequence Step | ✅ | PASS | Sequence steps deleted successfully |
| 5. Get Campaign | ✅ | PASS | Campaign dropdown working, returns full campaign data - UI validation fixed |
| 6. Get Many Campaigns | ✅ | PASS | Returns list of campaigns successfully |
| 6b. Update Campaign | ✅ | PASS | Name and sender emails update working - verified in platform |
| 6c. Add Leads to Campaign | ✅ | PASS | Bulk operation working - processes all input items correctly with "Execute Once" mode |
| 6d. Start/Resume Campaign | ✅ | PASS | Starts or resumes campaigns successfully using PATCH /campaigns/{id}/resume |
| 6e. Stop/Pause Campaign | ✅ | PASS | Pauses campaigns successfully using PATCH /campaigns/{id}/pause |
| 7. Get Many Email Accounts | ✅ | PASS | Returns list of email accounts successfully |
| 7b. Create Email Account | ✅ | VERIFIED | API endpoint verified correct, field validation fixed (cannot fully test without email credentials) |
| 8. Compose Email | ⏳ | - | |

**Overall Status:** ⏳ TESTING IN PROGRESS

---

## 📋 Resources & Operations Summary

### ✅ 1. LEADS (5 operations - ALL TESTED ✅)
**Endpoint:** `/api/leads`

| Operation | Method | Endpoint | Status | Priority | Notes |
|-----------|--------|----------|--------|----------|-------|
| Create | POST | `/leads` | ✅ | HIGH | Tested - two-step process with tags |
| Get | GET | `/leads/{id}` | ✅ | HIGH | Tested - dropdown working |
| Get Many | GET | `/leads` | ✅ | HIGH | **API Limitation**: Hard limit of 15 items (no pagination) |
| Update | PATCH | `/leads/{id}` | ✅ | HIGH | Tested - name/company work; phone/email/custom_fields unverified |
| Attach Tags | POST | `/tags/attach-to-leads` | ✅ | MEDIUM | Tested - Bulk operation with dynamic dropdowns |
| ~~Delete~~ | ~~DELETE~~ | ~~`/leads/{id}`~~ | ❌ | N/A | **NOT IMPLEMENTED** - Commented out in code (endpoint may not exist) |

**Known Issues:**
- **Pagination**: API returns 15 leads per page (ignores limit parameter)
- **Total leads**: 4,024 across 269 pages
- **Update Lead Response**: API response doesn't include all updated fields
  - ✅ Confirmed working: `first_name`, `last_name`, `company`
  - ❓ Unverified (not in response): `phone`, `email`
  - ❌ Not appearing in response: `custom_fields`
  - **Recommendation**: Add follow-up GET request to verify all fields updated

---

### ✅ 2. CAMPAIGNS (9 operations - 8 TESTED ✅, 0 UNTESTED ⏳, 1 NOT SUPPORTED ❌)
**Endpoint:** `/api/campaigns`

| Operation | Method | Endpoint | Status | Priority | Notes |
|-----------|--------|----------|--------|----------|-------|
| Create | POST | `/campaigns` | ✅ | HIGH | Tested - three-step process working perfectly |
| Get | GET | `/campaigns/{id}` | ✅ | HIGH | Tested - working perfectly, UI validation fixed |
| Get Many | GET | `/campaigns` | ✅ | HIGH | Tested - working perfectly, returns campaign list |
| Update | PATCH | `/campaigns/{id}/update` | ✅ | HIGH | Tested - name & sender emails update working (verified in platform) |
| Add Sequence Step | POST | `/campaigns/v1.1/{id}/sequence-steps` | ✅ | HIGH | Tested - working perfectly |
| Add Leads | POST | `/campaigns/{id}/leads/attach-leads` | ✅ | HIGH | Tested - bulk operation working with "Execute Once" mode |
| Start/Resume | PATCH | `/campaigns/{id}/resume` | ✅ | HIGH | Tested - starts or resumes campaigns successfully |
| Stop/Pause | PATCH | `/campaigns/{id}/pause` | ✅ | HIGH | Tested - pauses campaigns successfully, returns full campaign data |
| ~~Delete~~ | ~~DELETE~~ | ~~`/campaigns/{id}`~~ | ❌ | N/A | **NOT SUPPORTED BY API** - Endpoint does not exist |
- **Stop/Pause Campaign**: Likely have same issue as Start operation
- **Delete Campaign**: Confirmed NOT supported by API

---

### ✅ 3. TAGS (6 operations)
**Endpoint:** `/api/tags`

| Operation | Method | Endpoint | Status | Priority | Notes |
|-----------|--------|----------|--------|----------|-------|
| Create | POST | `/tags` | ⏳ | HIGH | Core functionality |
| Get | GET | `/tags/{id}` | ⏳ | MEDIUM | |
| Get Many | GET | `/tags` | ⏳ | HIGH | For dropdown |
| Update | PATCH | `/tags/{id}` | ⏳ | MEDIUM | |
| Delete | DELETE | `/tags/{id}` | ⏳ | LOW | |
| Attach to Leads | POST | `/tags/attach-to-leads` | ⏳ | MEDIUM | Bulk operation |

---

### ✅ 4. EMAIL ACCOUNTS (5 operations - 1 TESTED ✅, 1 VERIFIED ✅, 3 UNTESTED ⏳)
**Endpoint:** `/api/sender-emails`

| Operation | Method | Endpoint | Status | Priority | Notes |
|-----------|--------|----------|--------|----------|-------|
| Create | POST | `/sender-emails` | ✅ | HIGH | Verified - API endpoint correct, field validation fixed |
| Get | GET | `/sender-emails/{id}` | ⏳ | MEDIUM | |
| Get Many | GET | `/sender-emails` | ✅ | HIGH | Tested - working perfectly, returns email account list |
| Update | PATCH | `/sender-emails/{id}` | ⏳ | MEDIUM | |
| Delete | DELETE | `/sender-emails/{id}` | ⏳ | LOW | |

---

### ✅ 5. WORKSPACES (13 operations)
**Endpoint:** `/api/workspaces/v1.1`

| Operation | Method | Endpoint | Status | Priority | Notes |
|-----------|--------|----------|--------|----------|-------|
| Get | GET | `/workspaces/v1.1` | ✅ | HIGH | Tested - working |
| Create | POST | `/workspaces/v1.1` | ⏳ | MEDIUM | |
| Delete | DELETE | `/workspaces/v1.1/{id}` | ⏳ | LOW | |
| Create User | POST | `/workspaces/v1.1/users` | ⏳ | MEDIUM | |
| Delete Member | DELETE | `/workspaces/v1.1/members/{id}` | ⏳ | LOW | |
| Create API Token | POST | `/workspaces/v1.1/api-tokens` | ⏳ | MEDIUM | |
| Accept Invitation | POST | `/workspaces/v1.1/invitations/accept` | ⏳ | LOW | |
| Get Stats | GET | `/workspaces/v1.1/stats` | ⏳ | LOW | Analytics |
| Get Line/Area Chart | GET | `/workspaces/v1.1/line-area-chart-stats` | ⏳ | LOW | Analytics |
| Get Pie Chart | GET | `/workspaces/v1.1/pie-chart-stats` | ⏳ | LOW | Analytics |
| Get Sent Emails | GET | `/workspaces/v1.1/sent-emails` | ⏳ | LOW | Analytics |
| Invite User | POST | `/workspaces/v1.1/invite` | ⏳ | LOW | |
| Update Member Role | PATCH | `/workspaces/v1.1/members/{id}` | ⏳ | LOW | |

---

### ✅ 6. REPLIES (4 operations)
**Endpoint:** `/api/replies`

| Operation | Method | Endpoint | Status | Priority | Notes |
|-----------|--------|----------|--------|----------|-------|
| Compose Email | POST | `/replies/compose` | ⏳ | HIGH | Send one-off emails |
| Get Many | GET | `/replies` | ⏳ | HIGH | View responses |
| Mark as Interested | POST | `/replies/{id}/mark-interested` | ⏳ | MEDIUM | Lead qualification |
| Push to Follow-up | POST | `/replies/{id}/push-to-followup` | ⏳ | MEDIUM | Campaign automation |

---

### ✅ 7. SEQUENCE STEPS (3 operations)
**Endpoint:** `/api/sequence-steps`

| Operation | Method | Endpoint | Status | Priority | Notes |
|-----------|--------|----------|--------|----------|-------|
| Get Many | GET | `/sequence-steps` | ⏳ | MEDIUM | View campaign steps |
| Send Test Email | POST | `/sequence-steps/{id}/send-test` | ⏳ | HIGH | Testing before launch |
| Delete | DELETE | `/sequence-steps/{id}` | ✅ | LOW | Tested - working |

---

### ✅ 8. WEBHOOKS (5 operations)
**Endpoint:** `/api/webhooks`

| Operation | Method | Endpoint | Status | Priority | Notes |
|-----------|--------|----------|--------|----------|-------|
| Create | POST | `/webhooks` | ⏳ | HIGH | n8n integration |
| Get | GET | `/webhooks/{id}` | ⏳ | MEDIUM | |
| Get Many | GET | `/webhooks` | ⏳ | MEDIUM | |
| Update | PATCH | `/webhooks/{id}` | ⏳ | MEDIUM | |
| Delete | DELETE | `/webhooks/{id}` | ⏳ | LOW | |

---

## 🚀 V1 Release Priorities

### MUST HAVE (Critical for v1)
1. **Leads:** Create, Get, Get Many, Update
2. **Campaigns:** Create, Get, Get Many, Start, Stop
3. **Tags:** Create, Get Many
4. **Email Accounts:** Create, Get Many
5. **Replies:** Compose Email, Get Many
6. **Sequence Steps:** Send Test Email

### SHOULD HAVE (Important but not blocking)
1. **Leads:** Delete, Attach Tags
2. **Campaigns:** Update, Pause (Delete not supported by API)
3. **Tags:** Update, Attach to Leads
4. **Webhooks:** Create, Get Many, Delete

### NICE TO HAVE (Can defer to v1.1)
1. **Workspaces:** All analytics operations
2. **Workspaces:** User management operations
3. **Tags:** Delete
4. **Email Accounts:** Update, Delete

---

## 📝 Testing Plan

### Phase 1: Core CRUD Operations (HIGH PRIORITY)
Test basic Create, Read, Update, Delete for:
- [ ] Leads
- [ ] Campaigns
- [ ] Tags
- [ ] Email Accounts

### Phase 2: Campaign Automation (HIGH PRIORITY)
- [ ] Start Campaign
- [ ] Stop Campaign
- [ ] Send Test Email
- [ ] Compose Email

### Phase 3: Integration Features (MEDIUM PRIORITY)
- [ ] Attach Tags to Leads
- [ ] Mark Reply as Interested
- [ ] Push to Follow-up Campaign
- [ ] Webhooks

### Phase 4: Analytics & Management (LOW PRIORITY)
- [ ] Workspace Stats
- [ ] Sent Emails
- [ ] User Management

---

## 🐛 Known Issues to Address

1. **Pagination Limitation**
   - API returns 15 items per page
   - `limit` parameter is ignored
   - Need to implement pagination for dropdowns or accept 15-item limit

2. **Field Ordering**
   - ✅ FIXED: Lead selector now appears first in Update operation

3. **API Documentation**
   - No public API docs found
   - Relying on reverse engineering from existing code

---

## ✅ Next Steps

1. **Test all HIGH PRIORITY operations** in n8n
2. **Document any API errors or unexpected responses**
3. **Fix critical bugs**
4. **Create simple test workflow** for each resource
5. **Update README** with usage examples
6. **Tag v1.0.0 release**

