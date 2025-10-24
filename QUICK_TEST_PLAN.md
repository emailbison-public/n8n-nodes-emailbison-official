# EmailBison n8n Node - Quick Test Plan for V1 Release

## 🎯 Objective
Test the 6 most critical operations to verify the node is ready for v1 release.

---

## ⚡ Quick Test Workflow (15 minutes)

### Test 1: Create a Lead ✅
**Priority:** CRITICAL

1. Add EmailBison node to workflow
2. Select Resource: **Lead**
3. Select Operation: **Create**
4. Fill in:
   - Email: `test-n8n@example.com`
   - First Name: `Test`
   - Last Name: `User`
   - Company: `n8n Testing`
5. Execute node
6. **Expected:** Lead created successfully, returns lead object with ID

**Success Criteria:**
- ✅ No errors
- ✅ Returns lead ID
- ✅ Lead appears in EmailBison dashboard

---

### Test 2: Get Many Leads ✅
**Priority:** CRITICAL

1. Add EmailBison node
2. Select Resource: **Lead**
3. Select Operation: **Get Many**
4. Set Return All: **OFF**
5. Set Limit: **10**
6. Execute node
7. **Expected:** Returns array of 10 leads (or 15 if API ignores limit)

**Success Criteria:**
- ✅ No errors
- ✅ Returns array of leads
- ✅ Each lead has id, email, first_name, last_name

---

### Test 3: Update a Lead ✅
**Priority:** CRITICAL

1. Add EmailBison node
2. Select Resource: **Lead**
3. Select Operation: **Update**
4. **Verify:** Lead dropdown appears FIRST (before other fields)
5. Select a lead from dropdown
6. Update First Name: `Updated Test`
7. Execute node
8. **Expected:** Lead updated successfully

**Success Criteria:**
- ✅ Lead dropdown appears first
- ✅ No errors
- ✅ Returns updated lead object
- ✅ Changes reflected in EmailBison dashboard

---

### Test 4: Create a Campaign ✅
**Priority:** CRITICAL

1. Add EmailBison node
2. Select Resource: **Campaign**
3. Select Operation: **Create**
4. Fill in required fields:
   - Name: `Test Campaign n8n`
   - (Check what other fields are required)
5. Execute node
6. **Expected:** Campaign created successfully

**Success Criteria:**
- ✅ No errors
- ✅ Returns campaign ID
- ✅ Campaign appears in EmailBison dashboard

---

### Test 5: Get Many Campaigns ✅
**Priority:** CRITICAL

1. Add EmailBison node
2. Select Resource: **Campaign**
3. Select Operation: **Get Many**
4. Execute node
5. **Expected:** Returns array of campaigns

**Success Criteria:**
- ✅ No errors
- ✅ Returns array of campaigns
- ✅ Campaign dropdown works in other operations

---

### Test 6: Compose Email (Send One-off Email) ✅
**Priority:** HIGH

1. Add EmailBison node
2. Select Resource: **Reply**
3. Select Operation: **Compose Email**
4. Fill in:
   - Sender Email ID: (from email accounts)
   - Recipient Email: `test@example.com`
   - Subject: `Test from n8n`
   - Body: `This is a test email sent via n8n`
5. Execute node
6. **Expected:** Email sent successfully

**Success Criteria:**
- ✅ No errors
- ✅ Email sent
- ✅ Recipient receives email

---

## 🔍 What to Check During Testing

### 1. Console Logs
Open browser DevTools (F12) → Console tab
Look for:
- `🔍 CREATE LEAD - Request body:` (shows what's being sent)
- `✅ Successfully created lead` (success messages)
- `❌ Error` (any errors)

### 2. n8n Execution Output
Check the node output for:
- Proper JSON structure
- All expected fields present
- No error messages

### 3. EmailBison Dashboard
Verify changes appear in:
- Leads list
- Campaign list
- Sent emails

---

## 🐛 Common Issues to Watch For

### Issue 1: Dropdown Not Loading
**Symptom:** Lead/Campaign/Tag dropdown shows "No options"
**Check:**
- Browser console for API errors
- n8n server logs for authentication errors
- Credentials are correct

### Issue 2: Pagination Limit
**Symptom:** Only 15 items in dropdown
**Expected:** This is normal - API returns 15 per page
**Workaround:** Use expression mode for IDs beyond first 15

### Issue 3: Field Order Wrong
**Symptom:** Lead dropdown appears at bottom in Update operation
**Status:** Should be FIXED - dropdown should appear first
**Action:** If still wrong, report immediately

### Issue 4: Custom Fields Not Working
**Symptom:** Custom fields not saving
**Check:**
- Format of custom fields in request
- API response for errors

---

## ✅ Sign-off Checklist

Before releasing v1.0.0:

- [ ] All 6 critical tests pass
- [ ] No console errors during normal operation
- [ ] Dropdowns load correctly (even if limited to 15 items)
- [ ] Field ordering is correct (Lead selector first in Update)
- [ ] Created items appear in EmailBison dashboard
- [ ] Updated items reflect changes in dashboard
- [ ] Error messages are clear and helpful
- [ ] README has basic usage examples

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

Test 1 - Create Lead: ☐ PASS ☐ FAIL
Notes: ___________

Test 2 - Get Many Leads: ☐ PASS ☐ FAIL
Notes: ___________

Test 3 - Update Lead: ☐ PASS ☐ FAIL
Notes: ___________

Test 4 - Create Campaign: ☐ PASS ☐ FAIL
Notes: ___________

Test 5 - Get Many Campaigns: ☐ PASS ☐ FAIL
Notes: ___________

Test 6 - Compose Email: ☐ PASS ☐ FAIL
Notes: ___________

Overall Status: ☐ READY FOR RELEASE ☐ NEEDS FIXES

Critical Issues Found:
1. ___________
2. ___________
3. ___________
```

---

## 🚀 After Testing

If all tests pass:
1. Update version to 1.0.0 in package.json
2. Create git tag: `git tag v1.0.0`
3. Push to GitHub: `git push origin v1.0.0`
4. Publish to npm (if applicable)
5. Update README with "Tested and working" badge

If tests fail:
1. Document all failures
2. Fix critical issues
3. Re-test
4. Repeat until all pass

