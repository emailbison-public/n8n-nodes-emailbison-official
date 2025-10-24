# Tag Endpoints Specification - EmailBison API

**Date:** 2025-10-19  
**Source:** https://send.topoffunnel.com/api/reference#tag/custom-tags  
**Purpose:** Complete specification of all Tag endpoints for n8n node implementation

---

## 📊 **Summary**

**Total Tag Endpoints:** 10  
**Implementation Status:** ❌ **0 of 10 implemented** (0%)

---

## 🔍 **All Tag Endpoints**

| # | Operation | Method | Endpoint | Status |
|---|-----------|--------|----------|--------|
| 1 | Get All Tags | GET | `/api/tags` | ❌ Not Implemented |
| 2 | Create Tag | POST | `/api/tags` | ❌ Not Implemented |
| 3 | View Tag | GET | `/api/tags/{id}` | ❌ Not Implemented |
| 4 | Remove Tag | DELETE | `/api/tags/{tag_id}` | ❌ Not Implemented |
| 5 | Attach Tags to Campaigns | POST | `/api/tags/attach-to-campaigns` | ❌ Not Implemented |
| 6 | Remove Tags from Campaigns | POST | `/api/tags/remove-from-campaigns` | ❌ Not Implemented |
| 7 | Attach Tags to Leads | POST | `/api/tags/attach-to-leads` | ❌ Not Implemented |
| 8 | Remove Tags from Leads | POST | `/api/tags/remove-from-leads` | ❌ Not Implemented |
| 9 | Attach Tags to Email Accounts | POST | `/api/tags/attach-to-sender-emails` | ❌ Not Implemented |
| 10 | Remove Tags from Email Accounts | POST | `/api/tags/remove-from-sender-emails` | ❌ Not Implemented |

---

## 📋 **Detailed Endpoint Specifications**

### **1. Get All Tags for Workspace**

**Operation:** Get Many Tags  
**Method:** GET  
**Endpoint:** `/api/tags`  
**Description:** Retrieve a list of all tags for the authenticated user's workspace.

**Query Parameters:** None

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Important",
      "default": false,
      "created_at": "2025-04-14T16:59:21.000000Z",
      "updated_at": "2025-05-18T12:53:32.000000Z"
    },
    {
      "id": 2,
      "name": "Urgent",
      "default": true,
      "created_at": "2025-04-14T16:59:21.000000Z",
      "updated_at": "2025-05-18T12:53:32.000000Z"
    }
  ]
}
```

**n8n Implementation:**
- Operation: `getMany`
- Fields: Return All (boolean), Limit (number)
- Also used for `loadOptionsMethod` to populate tag dropdowns

---

### **2. Create Tag**

**Operation:** Create Tag  
**Method:** POST  
**Endpoint:** `/api/tags`  
**Description:** Add a new tag.

**Body Parameters (application/json):**
- `name` (string, **required**) - The name of the tag
- `default` (boolean | null, optional) - Whether the tag should be default or not

**Example Request:**
```json
{
  "name": "Important",
  "default": false
}
```

**Response (201):**
```json
{
  "data": {
    "id": 1,
    "name": "Important",
    "default": false,
    "created_at": "2025-04-14T16:59:21.000000Z",
    "updated_at": "2025-05-18T12:53:32.000000Z"
  }
}
```

**n8n Implementation:**
- Operation: `create`
- Fields: Name (string, required), Default (boolean, optional)

---

### **3. View Tag**

**Operation:** Get Tag  
**Method:** GET  
**Endpoint:** `/api/tags/{id}`  
**Description:** Retrieve details of a specific tag.

**Path Parameters:**
- `id` (integer, **required**) - The ID of the tag

**Response (200):**
```json
{
  "data": {
    "id": 1,
    "name": "Important",
    "default": false,
    "created_at": "2025-04-14T16:59:21.000000Z",
    "updated_at": "2025-05-18T12:53:32.000000Z"
  }
}
```

**n8n Implementation:**
- Operation: `get`
- Fields: Tag (dropdown with loadOptionsMethod)

---

### **4. Remove Tag**

**Operation:** Delete Tag  
**Method:** DELETE  
**Endpoint:** `/api/tags/{tag_id}`  
**Description:** Delete a tag.

**Path Parameters:**
- `tag_id` (integer, **required**) - The ID of the tag to delete

**Response (200):**
```json
{
  "data": {
    "success": true,
    "message": "Tag deleted successfully"
  }
}
```

**n8n Implementation:**
- Operation: `delete`
- Fields: Tag (dropdown with loadOptionsMethod)

---

### **5. Attach Tags to Campaigns**

**Operation:** Attach Tags to Campaigns  
**Method:** POST  
**Endpoint:** `/api/tags/attach-to-campaigns`  
**Description:** Attach multiple tags to campaigns.

**Body Parameters (application/json):**
- `campaign_ids` (array of integers, **required**) - An array of campaign IDs to which the tags will be attached
- `tag_ids` (array of integers, **required**) - An array of tag IDs to be attached
- `skip_webhooks` (boolean, optional) - If set to true, no webhooks will be fired for this action

**Example Request:**
```json
{
  "tag_ids": [1, 2],
  "campaign_ids": [3, 4],
  "skip_webhooks": true
}
```

**Response (200):**
```json
{
  "data": {
    "success": true,
    "message": "Successfully attached tags to campaigns"
  }
}
```

**n8n Implementation:**
- Operation: `attachToCampaigns`
- Fields: Campaign IDs (string/multi-select), Tag IDs (dropdown multi-select with loadOptionsMethod), Skip Webhooks (boolean)

---

### **6. Remove Tags from Campaigns**

**Operation:** Remove Tags from Campaigns  
**Method:** POST  
**Endpoint:** `/api/tags/remove-from-campaigns`  
**Description:** Detach multiple tags from campaigns.

**Body Parameters (application/json):**
- `campaign_ids` (array of integers, **required**) - An array of campaign IDs from which the tags will be detached
- `tag_ids` (array of integers, **required**) - An array of tag IDs to be detached
- `skip_webhooks` (boolean, optional) - If set to true, no webhooks will be fired for this action

**Example Request:**
```json
{
  "tag_ids": [1, 2],
  "campaign_ids": [3, 4],
  "skip_webhooks": false
}
```

**Response (200):**
```json
{
  "data": {
    "success": true,
    "message": "Successfully removed tags from campaigns"
  }
}
```

**n8n Implementation:**
- Operation: `removeFromCampaigns`
- Fields: Campaign IDs (string/multi-select), Tag IDs (dropdown multi-select with loadOptionsMethod), Skip Webhooks (boolean)

---

### **7. Attach Tags to Leads** ⭐ **USER'S PRIMARY REQUEST**

**Operation:** Attach Tags to Leads  
**Method:** POST  
**Endpoint:** `/api/tags/attach-to-leads`  
**Description:** Attach multiple tags to leads.

**Body Parameters (application/json):**
- `lead_ids` (array of integers, **required**) - An array of lead IDs to which the tags will be attached
- `tag_ids` (array of integers, **required**) - An array of tag IDs to be attached
- `skip_webhooks` (boolean, optional) - If set to true, no webhooks will be fired for this action

**Example Request:**
```json
{
  "tag_ids": [1, 2],
  "lead_ids": [3, 4],
  "skip_webhooks": true
}
```

**Response (200):**
```json
{
  "data": {
    "success": true,
    "message": "Successfully attached tags to leads"
  }
}
```

**n8n Implementation:**
- Operation: `attachToLeads`
- Fields: Lead IDs (string/multi-select), Tag IDs (dropdown multi-select with loadOptionsMethod), Skip Webhooks (boolean)

---

### **8. Remove Tags from Leads**

**Operation:** Remove Tags from Leads  
**Method:** POST  
**Endpoint:** `/api/tags/remove-from-leads`  
**Description:** Detach multiple tags from leads.

**Body Parameters (application/json):**
- `lead_ids` (array of integers, **required**) - An array of lead IDs from which the tags will be detached
- `tag_ids` (array of integers, **required**) - An array of tag IDs to be detached
- `skip_webhooks` (boolean, optional) - If set to true, no webhooks will be fired for this action

**Example Request:**
```json
{
  "tag_ids": [1, 2],
  "lead_ids": [3, 4],
  "skip_webhooks": false
}
```

**Response (200):**
```json
{
  "data": {
    "success": true,
    "message": "Successfully removed tags from leads"
  }
}
```

**n8n Implementation:**
- Operation: `removeFromLeads`
- Fields: Lead IDs (string/multi-select), Tag IDs (dropdown multi-select with loadOptionsMethod), Skip Webhooks (boolean)

---

### **9. Attach Tags to Email Accounts**

**Operation:** Attach Tags to Email Accounts  
**Method:** POST  
**Endpoint:** `/api/tags/attach-to-sender-emails`  
**Description:** Attach multiple tags to email accounts (sender emails).

**Body Parameters (application/json):**
- `sender_email_ids` (array of integers, **required**) - An array of sender email IDs to which the tags will be attached
- `tag_ids` (array of integers, **required**) - An array of tag IDs to be attached
- `skip_webhooks` (boolean, optional) - If set to true, no webhooks will be fired for this action

**n8n Implementation:**
- Operation: `attachToEmailAccounts`
- Fields: Email Account IDs (string/multi-select), Tag IDs (dropdown multi-select with loadOptionsMethod), Skip Webhooks (boolean)

---

### **10. Remove Tags from Email Accounts**

**Operation:** Remove Tags from Email Accounts  
**Method:** POST  
**Endpoint:** `/api/tags/remove-from-sender-emails`  
**Description:** Detach multiple tags from email accounts (sender emails).

**Body Parameters (application/json):**
- `sender_email_ids` (array of integers, **required**) - An array of sender email IDs from which the tags will be detached
- `tag_ids` (array of integers, **required**) - An array of tag IDs to be detached
- `skip_webhooks` (boolean, optional) - If set to true, no webhooks will be fired for this action

**n8n Implementation:**
- Operation: `removeFromEmailAccounts`
- Fields: Email Account IDs (string/multi-select), Tag IDs (dropdown multi-select with loadOptionsMethod), Skip Webhooks (boolean)

---

## 🎯 **Implementation Priority**

### **Phase 1: Core Tag Management (HIGH Priority)**
1. ✅ Get All Tags - **REQUIRED** for loadOptionsMethod
2. ✅ Create Tag
3. ✅ Get Tag
4. ✅ Delete Tag

### **Phase 2: Lead Tag Operations (HIGH Priority - User Request)**
5. ✅ Attach Tags to Leads - **USER'S PRIMARY REQUEST**
6. ✅ Remove Tags from Leads

### **Phase 3: Campaign Tag Operations (MEDIUM Priority)**
7. ⚠️ Attach Tags to Campaigns
8. ⚠️ Remove Tags from Campaigns

### **Phase 4: Email Account Tag Operations (LOW Priority)**
9. ⚠️ Attach Tags to Email Accounts
10. ⚠️ Remove Tags from Email Accounts

---

**End of Specification**

