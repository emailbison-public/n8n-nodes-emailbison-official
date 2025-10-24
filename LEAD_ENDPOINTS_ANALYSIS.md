# Lead Endpoints Analysis - EmailBison API

**Date:** 2025-10-19  
**Purpose:** Comprehensive analysis of Lead endpoints in EmailBison API vs. our n8n node implementation

---

## 📊 **Executive Summary**

### **Current Implementation Status:**
- ✅ **4 of 16 endpoints implemented** (25% coverage)
- ✅ **Using PATCH method** for updates (correct choice)
- ❌ **Missing 12 critical endpoints** including tag management
- ❌ **No "Attach Tags to Leads" operation** (user's primary request)

---

## 🔍 **API Documentation Review**

### **Source:** https://send.topoffunnel.com/api/reference#tag/leads

### **All Available Lead Endpoints (16 total):**

| # | Endpoint | Method | Status | Priority |
|---|----------|--------|--------|----------|
| 1 | `/api/leads` | GET | ✅ **Implemented** | HIGH |
| 2 | `/api/leads` | POST | ✅ **Implemented** | HIGH |
| 3 | `/api/leads/{lead_id}` | GET | ✅ **Implemented** | HIGH |
| 4 | `/api/leads/{lead_id}` | PUT | ❌ Not Implemented | LOW |
| 5 | `/api/leads/{lead_id}` | PATCH | ✅ **Implemented** | HIGH |
| 6 | `/api/leads/{lead_id}/replies` | GET | ❌ Not Implemented | MEDIUM |
| 7 | `/api/leads/multiple` | POST | ❌ Not Implemented | MEDIUM |
| 8 | `/api/leads/create-or-update/multiple` | POST | ❌ Not Implemented | MEDIUM |
| 9 | `/api/leads/create-or-update/{lead_id}` | POST | ❌ Not Implemented | LOW |
| 10 | `/api/leads/{lead_id}/unsubscribe` | PATCH | ❌ Not Implemented | MEDIUM |
| 11 | `/api/leads/{lead_id}/blacklist` | POST | ❌ Not Implemented | MEDIUM |
| 12 | `/api/leads/bulk/csv` | POST | ❌ Not Implemented | LOW |
| 13 | `/api/leads/{lead_id}/scheduled-emails` | GET | ❌ Not Implemented | LOW |
| 14 | `/api/leads/{lead_id}/sent-emails` | GET | ❌ Not Implemented | MEDIUM |
| 15 | `/api/leads/{lead_id}/update-status` | PATCH | ❌ Not Implemented | MEDIUM |
| 16 | `/api/leads/bulk-update-status` | PATCH | ❌ Not Implemented | MEDIUM |

---

## 🎯 **PUT vs PATCH - Which One to Use?**

### **API Offers Both:**
- **PUT** `/api/leads/{lead_id}` - Full replacement
- **PATCH** `/api/leads/{lead_id}` - Partial update

### **Key Differences:**

| Aspect | PUT | PATCH |
|--------|-----|-------|
| **Fields Behavior** | Fields NOT passed are **CLEARED** | Fields NOT passed **REMAIN UNCHANGED** |
| **Required Fields** | email, first_name, last_name (all required) | All fields optional |
| **Use Case** | Complete replacement of lead data | Update specific fields only |
| **Risk Level** | HIGH (can accidentally clear data) | LOW (safe partial updates) |
| **Best Practice** | ❌ Avoid for user-facing updates | ✅ **Recommended** |

### **Our Implementation:**
✅ **We use PATCH** (line 208 in `execute.ts`)
```typescript
method: 'PATCH',
```

### **Recommendation:**
✅ **KEEP USING PATCH** - This is the correct choice because:
1. Users typically want to update specific fields, not replace entire records
2. Safer - won't accidentally clear fields the user didn't intend to change
3. More flexible - all fields are optional
4. Industry standard for partial updates

---

## 🚨 **CRITICAL MISSING FEATURE: Attach Tags to Leads**

### **User's Request:**
> "I need to know how I can use this to attach tags to leads"

### **API Endpoint:**
- **URL:** `POST /api/tags/attach-to-leads`
- **Location:** Custom Tags resource (NOT in Leads resource)
- **Documentation:** https://send.topoffunnel.com/api/reference#tag/custom-tags/post/api/tags/attach-to-leads

### **Required Parameters:**
```json
{
  "lead_ids": [3, 4],        // array of integers (required)
  "tag_ids": [1, 2],         // array of integers (required)
  "skip_webhooks": true      // boolean (optional)
}
```

### **Response:**
```json
{
  "data": {
    "success": true,
    "message": "Successfully attached tags to leads"
  }
}
```

### **Implementation Status:**
❌ **NOT IMPLEMENTED** - This operation does NOT exist in our node

### **Impact:**
- **HIGH** - User explicitly requested this feature
- **BLOCKER** - Cannot attach tags to leads via n8n automation
- **Workaround:** None - must use EmailBison UI manually

---

## 📋 **Recommended Implementation Plan**

### **Phase 1: Critical Tag Operations (HIGH Priority)**

#### **1. Attach Tags to Leads**
- **Resource:** Tag (new resource or add to Lead)
- **Operation:** Attach Tags to Leads
- **Method:** POST
- **Endpoint:** `/api/tags/attach-to-leads`
- **Fields:**
  - Lead IDs (multi-select or comma-separated)
  - Tag IDs (multi-select or comma-separated)
  - Skip Webhooks (boolean, optional)

#### **2. Remove Tags from Leads**
- **Resource:** Tag
- **Operation:** Remove Tags from Leads
- **Method:** POST
- **Endpoint:** `/api/tags/remove-from-leads`
- **Fields:** Same as attach

### **Phase 2: Lead Status Management (MEDIUM Priority)**

#### **3. Update Lead Status**
- **Resource:** Lead
- **Operation:** Update Status
- **Method:** PATCH
- **Endpoint:** `/api/leads/{lead_id}/update-status`
- **Fields:**
  - Lead ID (dropdown)
  - Status (dropdown: verified, unverified, unknown, risky, inactive)

#### **4. Bulk Update Lead Status**
- **Resource:** Lead
- **Operation:** Bulk Update Status
- **Method:** PATCH
- **Endpoint:** `/api/leads/bulk-update-status`
- **Fields:**
  - Lead IDs (multi-select)
  - Status (dropdown)

### **Phase 3: Lead Engagement Data (MEDIUM Priority)**

#### **5. Get Sent Emails for Lead**
- **Resource:** Lead
- **Operation:** Get Sent Emails
- **Method:** GET
- **Endpoint:** `/api/leads/{lead_id}/sent-emails`

#### **6. Get Replies for Lead**
- **Resource:** Lead
- **Operation:** Get Replies
- **Method:** GET
- **Endpoint:** `/api/leads/{lead_id}/replies`

### **Phase 4: Bulk Operations (MEDIUM Priority)**

#### **7. Bulk Create Leads**
- **Resource:** Lead
- **Operation:** Bulk Create
- **Method:** POST
- **Endpoint:** `/api/leads/multiple`

#### **8. Unsubscribe Lead**
- **Resource:** Lead
- **Operation:** Unsubscribe
- **Method:** PATCH
- **Endpoint:** `/api/leads/{lead_id}/unsubscribe`

#### **9. Add Lead to Blacklist**
- **Resource:** Lead
- **Operation:** Add to Blacklist
- **Method:** POST
- **Endpoint:** `/api/leads/{lead_id}/blacklist`

---

## ✅ **Current Implementation - What We Have**

### **Implemented Operations (4):**

1. **Get Many Leads** ✅
   - Method: GET
   - Endpoint: `/api/leads`
   - Status: Working (with 15-lead limit documented)

2. **Create Lead** ✅
   - Method: POST
   - Endpoint: `/api/leads`
   - Status: Working

3. **Get Lead** ✅
   - Method: GET
   - Endpoint: `/api/leads/{lead_id}`
   - Status: Working

4. **Update Lead** ✅
   - Method: PATCH (correct choice!)
   - Endpoint: `/api/leads/{lead_id}`
   - Status: Working

### **Commented Out (1):**

5. **Delete Lead** ❌
   - Status: Commented out (endpoint doesn't exist in API)
   - Note: Kept in code for future implementation

---

## 🎯 **Immediate Action Items**

### **For User's Current Request:**

1. ✅ **Confirm PATCH is correct** - YES, we're using the right method
2. ❌ **Implement "Attach Tags to Leads"** - REQUIRED for user's workflow
3. ❌ **Implement "Remove Tags from Leads"** - Complementary operation
4. ✅ **Update testing checklist** - Add tag operations to test plan

### **Testing Checklist Updates:**

Add to `V1_RELEASE_CHECKLIST.md`:
- [ ] Test 7: Attach Tags to Leads
- [ ] Test 8: Remove Tags from Leads
- [ ] Test 9: Update Lead Status
- [ ] Test 10: Get Sent Emails for Lead

---

## 📝 **Notes**

### **PUT vs PATCH Decision:**
- ✅ **We correctly use PATCH**
- ✅ **No changes needed**
- ✅ **This is the industry best practice**

### **Tag Operations:**
- ⚠️ **Tags are in a separate resource** (Custom Tags, not Leads)
- ⚠️ **May need to create new Tag resource** or add to Lead resource
- ⚠️ **Tag IDs must be obtained from `/api/tags` endpoint first**

### **API Limitations:**
- ⚠️ **15-lead limit on GET MANY** (already documented)
- ⚠️ **No DELETE endpoint** (already handled)
- ⚠️ **No pagination support** (already documented)

---

## 🚀 **Next Steps**

1. **Implement Attach Tags to Leads operation** (user's primary request)
2. **Implement Remove Tags from Leads operation** (complementary)
3. **Test both tag operations** with real data
4. **Update V1_RELEASE_CHECKLIST.md** with new tests
5. **Consider implementing remaining MEDIUM priority endpoints**

---

**End of Analysis**

