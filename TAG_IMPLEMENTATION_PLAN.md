# Tag Resource Implementation Plan - EmailBison n8n Node

**Date:** 2025-10-19  
**Purpose:** Step-by-step implementation plan for Tag resource with all 10 operations

---

## 📊 **Implementation Overview**

### **What We're Building:**
- **New Resource:** `tag` (Custom Tags)
- **Total Operations:** 10
- **Priority:** HIGH (User's primary request)
- **Estimated Files:** 3 new files + 2 modified files

---

## 🎯 **Implementation Phases**

### **Phase 1: Core Tag Management** ⭐ **START HERE**

**Operations to Implement:**
1. Get Many Tags (GET `/api/tags`)
2. Create Tag (POST `/api/tags`)
3. Get Tag (GET `/api/tags/{id}`)
4. Delete Tag (DELETE `/api/tags/{tag_id}`)

**Why First:**
- Get Many Tags is **REQUIRED** for `loadOptionsMethod` (populates dropdowns in all other operations)
- Core CRUD operations establish the foundation
- Enables testing before moving to complex operations

---

### **Phase 2: Lead Tag Operations** ⭐ **USER'S PRIMARY REQUEST**

**Operations to Implement:**
5. Attach Tags to Leads (POST `/api/tags/attach-to-leads`)
6. Remove Tags from Leads (POST `/api/tags/remove-from-leads`)

**Why Second:**
- **This is what the user explicitly requested**
- Most common use case for automation
- Depends on Phase 1 for tag dropdown population

---

### **Phase 3: Campaign Tag Operations**

**Operations to Implement:**
7. Attach Tags to Campaigns (POST `/api/tags/attach-to-campaigns`)
8. Remove Tags from Campaigns (POST `/api/tags/remove-from-campaigns`)

**Why Third:**
- Similar pattern to Lead operations
- Medium priority for automation workflows

---

### **Phase 4: Email Account Tag Operations**

**Operations to Implement:**
9. Attach Tags to Email Accounts (POST `/api/tags/attach-to-sender-emails`)
10. Remove Tags from Email Accounts (POST `/api/tags/remove-from-sender-emails`)

**Why Last:**
- Lower priority use case
- Same pattern as Phases 2 & 3

---

## 📁 **File Structure**

### **New Files to Create:**

```
nodes/EmailBison/operations/tags/
├── index.ts          # Tag resource definition and field configurations
├── execute.ts        # Tag operation execution logic
└── README.md         # Documentation for tag operations
```

### **Files to Modify:**

```
nodes/EmailBison/
├── EmailBison.node.ts           # Add 'tag' to resources array
└── methods/loadOptions.ts       # Add getTagsForWorkspace() method
```

---

## 🔧 **Implementation Steps**

### **Step 1: Create Tag Resource Structure**

**File:** `nodes/EmailBison/operations/tags/index.ts`

**Contents:**
- Resource definition: `{ name: 'Tag', value: 'tag' }`
- 10 operation definitions (getMany, create, get, delete, attachToLeads, etc.)
- Field definitions for each operation
- `loadOptionsMethod` references for tag dropdowns

**Key Fields:**
- **Tag Selector** (for get/delete operations):
  - Type: `options`
  - `typeOptions.loadOptionsMethod: 'getTagsForWorkspace'`
  - Allow expression input

- **Tag Multi-Select** (for attach/remove operations):
  - Type: `multiOptions`
  - `typeOptions.loadOptionsMethod: 'getTagsForWorkspace'`
  - Allow expression input

- **Lead IDs / Campaign IDs / Email Account IDs**:
  - Type: `string`
  - Description: "Comma-separated IDs or use expression"
  - Allow expression input

- **Skip Webhooks**:
  - Type: `boolean`
  - Default: `false`
  - Optional

---

### **Step 2: Implement Tag Execution Logic**

**File:** `nodes/EmailBison/operations/tags/execute.ts`

**Function:** `export async function executeTagOperations(...)`

**Implementation Pattern:**
```typescript
if (operation === 'getMany') {
	// GET /api/tags
	const returnAll = this.getNodeParameter('returnAll', index, false);
	const qs: IDataObject = {};
	
	if (!returnAll) {
		const limit = this.getNodeParameter('limit', index, 50);
		qs.limit = limit;
	}
	
	const responseData = await this.helpers.httpRequestWithAuthentication.call(
		this, 'emailBisonApi',
		{ method: 'GET', baseURL: `${credentials.serverUrl}/api`, url: '/tags', qs }
	);
	
	return responseData.data.map((tag: IDataObject) => ({ json: tag }));
}

if (operation === 'create') {
	// POST /api/tags
	const name = this.getNodeParameter('name', index) as string;
	const defaultTag = this.getNodeParameter('default', index, false) as boolean;
	
	const body: IDataObject = { name };
	if (defaultTag !== undefined) {
		body.default = defaultTag;
	}
	
	const responseData = await this.helpers.httpRequestWithAuthentication.call(
		this, 'emailBisonApi',
		{ method: 'POST', baseURL: `${credentials.serverUrl}/api`, url: '/tags', body }
	);
	
	return [{ json: responseData.data }];
}

if (operation === 'get') {
	// GET /api/tags/{id}
	const tagId = this.getNodeParameter('tagId', index) as string;
	
	const responseData = await this.helpers.httpRequestWithAuthentication.call(
		this, 'emailBisonApi',
		{ method: 'GET', baseURL: `${credentials.serverUrl}/api`, url: `/tags/${tagId}` }
	);
	
	return [{ json: responseData.data }];
}

if (operation === 'delete') {
	// DELETE /api/tags/{tag_id}
	const tagId = this.getNodeParameter('tagId', index) as string;
	
	const responseData = await this.helpers.httpRequestWithAuthentication.call(
		this, 'emailBisonApi',
		{ method: 'DELETE', baseURL: `${credentials.serverUrl}/api`, url: `/tags/${tagId}` }
	);
	
	return [{ json: responseData.data }];
}

if (operation === 'attachToLeads') {
	// POST /api/tags/attach-to-leads
	const leadIds = this.getNodeParameter('leadIds', index) as string;
	const tagIds = this.getNodeParameter('tagIds', index) as string[];
	const skipWebhooks = this.getNodeParameter('skipWebhooks', index, false) as boolean;
	
	// Parse lead IDs (comma-separated string to array of integers)
	const leadIdsArray = leadIds.split(',').map(id => parseInt(id.trim(), 10));
	
	const body: IDataObject = {
		lead_ids: leadIdsArray,
		tag_ids: tagIds.map(id => parseInt(id, 10)),
	};
	
	if (skipWebhooks) {
		body.skip_webhooks = true;
	}
	
	const responseData = await this.helpers.httpRequestWithAuthentication.call(
		this, 'emailBisonApi',
		{ method: 'POST', baseURL: `${credentials.serverUrl}/api`, url: '/tags/attach-to-leads', body }
	);
	
	return [{ json: responseData.data }];
}

// Similar patterns for:
// - removeFromLeads
// - attachToCampaigns
// - removeFromCampaigns
// - attachToEmailAccounts
// - removeFromEmailAccounts
```

---

### **Step 3: Add loadOptionsMethod for Tags**

**File:** `nodes/EmailBison/methods/loadOptions.ts`

**Add Function:**
```typescript
async getTagsForWorkspace(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const credentials = await this.getCredentials('emailBisonApi');
	
	const responseData = await this.helpers.httpRequestWithAuthentication.call(
		this, 'emailBisonApi',
		{
			method: 'GET',
			baseURL: `${credentials.serverUrl}/api`,
			url: '/tags',
		}
	);
	
	const tags = responseData.data || responseData;
	
	return tags.map((tag: any) => ({
		name: tag.name,
		value: tag.id.toString(),
	}));
}
```

**Register in loadOptions object:**
```typescript
loadOptions: {
	// ... existing methods
	getTagsForWorkspace,
}
```

---

### **Step 4: Register Tag Resource**

**File:** `nodes/EmailBison/EmailBison.node.ts`

**Add to resources array:**
```typescript
{
	name: 'Tag',
	value: 'tag',
},
```

**Add to execute() method:**
```typescript
if (resource === 'tag') {
	return await executeTagOperations.call(this, items, credentials);
}
```

**Add import:**
```typescript
import { executeTagOperations } from './operations/tags/execute';
```

---

## ✅ **Testing Checklist**

### **Phase 1 Tests:**
- [ ] Get Many Tags - Returns all tags
- [ ] Get Many Tags - Respects limit parameter
- [ ] Create Tag - Creates tag with name only
- [ ] Create Tag - Creates tag with name and default=true
- [ ] Get Tag - Returns single tag by ID
- [ ] Delete Tag - Deletes tag successfully
- [ ] loadOptionsMethod - Populates tag dropdowns correctly

### **Phase 2 Tests (User's Request):**
- [ ] Attach Tags to Leads - Single tag, single lead
- [ ] Attach Tags to Leads - Multiple tags, multiple leads
- [ ] Attach Tags to Leads - With skip_webhooks=true
- [ ] Remove Tags from Leads - Single tag, single lead
- [ ] Remove Tags from Leads - Multiple tags, multiple leads

### **Phase 3 Tests:**
- [ ] Attach Tags to Campaigns - Works correctly
- [ ] Remove Tags from Campaigns - Works correctly

### **Phase 4 Tests:**
- [ ] Attach Tags to Email Accounts - Works correctly
- [ ] Remove Tags from Email Accounts - Works correctly

---

## 🚀 **Deployment Steps**

1. **Build the node:** `npm run build`
2. **Restart n8n:** Kill existing instance, start new one
3. **Test in n8n UI:** Verify all operations appear correctly
4. **Test with real data:** Use your EmailBison account
5. **Update documentation:** Add to V1_RELEASE_CHECKLIST.md

---

## 📝 **Notes**

### **Important Considerations:**

1. **Array Handling:**
   - API expects arrays of integers for IDs
   - n8n multi-select returns array of strings
   - Must convert: `tagIds.map(id => parseInt(id, 10))`

2. **Lead/Campaign/Email Account IDs:**
   - Accept comma-separated string for flexibility
   - Parse to array: `leadIds.split(',').map(id => parseInt(id.trim(), 10))`
   - Allows expression input for dynamic workflows

3. **Skip Webhooks:**
   - Optional parameter
   - Only include in body if `true` (API default is `false`)

4. **Error Handling:**
   - Wrap API calls in try-catch
   - Provide clear error messages
   - Log full error for debugging

---

## 🎯 **Success Criteria**

✅ All 10 tag operations implemented  
✅ Tag dropdown populates in all operations  
✅ User can attach tags to leads (primary request)  
✅ All tests pass  
✅ Documentation updated  
✅ Code follows existing patterns  

---

**Ready to implement? Let me know and I'll start with Phase 1!** 🚀

