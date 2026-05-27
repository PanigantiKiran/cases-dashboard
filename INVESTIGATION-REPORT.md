# Deep Investigation: Opening Specific Cases in Salesforce

## 🔍 Problem Statement

**Issue:** Clicking a case number opens GSI but doesn't open the specific case.

**Current Behavior:** All cases link to GSI home page.

**Desired Behavior:** Click case number → Specific case opens in GSI.

---

## 📊 Data Analysis

### Available Case Data:
```json
{
  "caseOwner": "Akiko Inoue",
  "caseNumber": "23758649",
  "account": "Ernst & Young Tax Co.",
  "product": "DataFlow",
  "subject": "WebRequest??????????",
  "status": "Open",
  "openedDate": "5/25/2026",
  "priority": "Medium",
  "age": 1
}
```

### ❌ Missing Data:
- **Salesforce Record ID** (15 or 18-char ID like "500xx0000000001AAA")
- **Case ID** (Internal Salesforce ID)

**Conclusion:** We only have the Case Number, not the Salesforce Record ID.

---

## 🎯 Salesforce URL Format Options

### Option 1: Direct Record URL (❌ Not Possible)
**Format:** `/lightning/r/Case/{RecordId}/view`
**Example:** `https://[instance].lightning.force.com/lightning/r/Case/500xx0000000001AAA/view`
**Status:** ❌ **Requires Salesforce Record ID** (not available in our data)

---

### Option 2: Global Search (⚠️ Requires User to Click)
**Format:** `/one/one.app#/search?term={caseNumber}`
**Example:** `https://thomsonreutersglis2e.lightning.force.com/one/one.app#/search?term=23758649`
**Behavior:** 
- Opens GSI
- Pre-fills search with case number
- Shows search results
- **User must click the case from results**
**Status:** ⚠️ **Not fully automated** (requires one more click)

---

### Option 3: Case List View with Filter (🔍 Testing Needed)
**Format:** `/lightning/o/Case/list?filterName=Recent`
**Possible Enhancement:** Add case number filter parameter
**Status:** 🔍 **Need to test if filtering by case number is supported**

---

### Option 4: Custom Lightning URL (🔍 Testing Needed)
**Format:** `/lightning/cmp/c__CustomCaseViewer?caseNumber={number}`
**Requirement:** Custom Lightning component must exist in GSI
**Status:** 🔍 **Unknown if custom component exists**

---

### Option 5: Visualforce Page (🔍 Legacy Option)
**Format:** `/apex/CaseViewer?caseNum={number}`
**Requirement:** Custom Visualforce page must exist
**Status:** 🔍 **Legacy approach, unlikely in Lightning**

---

### Option 6: Navigation API with Query (⚠️ Requires JavaScript)
**Method:** Use Salesforce Navigation API within GSI
**Limitation:** Cannot be done via external link
**Status:** ❌ **Not possible from external dashboard**

---

## 🤔 The Core Problem

### Why Direct Case Opening is Difficult:

1. **Salesforce Uses Record IDs, Not Case Numbers**
   - Record IDs are unique 18-character identifiers
   - Case Numbers are user-friendly but not used in URLs
   - Our data has Case Numbers but not Record IDs

2. **No API Available from Static HTML**
   - Our dashboard is static HTML (GitHub Pages)
   - Cannot make Salesforce API calls to look up Record IDs
   - Cannot query Salesforce to get Record ID from Case Number

3. **Cross-Domain Restrictions**
   - Cannot inject JavaScript into GSI from external site
   - Security policies prevent automated navigation

---

## 💡 Possible Solutions

### Solution A: Get Salesforce Record IDs ✅ **BEST**
**How:**
1. Export case data from Salesforce including Record IDs
2. Add `caseId` field to cases-data-embedded.js
3. Use direct URL: `/lightning/r/Case/{caseId}/view`

**Pros:**
- ✅ Direct case opening (one click)
- ✅ No intermediate steps
- ✅ Best user experience

**Cons:**
- ⚠️ Requires data re-export with Record IDs
- ⚠️ Need to update data regularly

**Implementation:**
```javascript
// Updated data structure needed:
{
  "caseId": "500xx0000000001AAA",  // Add this!
  "caseNumber": "23758649",
  "caseOwner": "Akiko Inoue",
  ...
}

// URL format:
const caseUrl = `https://thomsonreutersglis2e.lightning.force.com/lightning/r/Case/${c.caseId}/view`;
```

---

### Solution B: Use Search URL ⚠️ **CURRENT WORKAROUND**
**How:**
Use global search with case number pre-filled

**Pros:**
- ✅ Works with existing data
- ✅ No data changes needed

**Cons:**
- ⚠️ Requires user to click case from search results
- ⚠️ Two-step process

**Implementation:**
```javascript
const searchUrl = `https://thomsonreutersglis2e.lightning.force.com/one/one.app#/search?term=${c.caseNumber}`;
```

---

### Solution C: Custom Salesforce Web Component 🔧 **ADVANCED**
**How:**
Create a custom Lightning Web Component in Salesforce that accepts case number as URL parameter

**Pros:**
- ✅ Direct case opening
- ✅ Works with case numbers

**Cons:**
- ⚠️ Requires Salesforce development
- ⚠️ Admin access needed
- ⚠️ Custom code to maintain

---

### Solution D: Middleware API 🔧 **COMPLEX**
**How:**
Create a backend service that:
1. Receives case number
2. Queries Salesforce API for Record ID
3. Redirects to case URL

**Pros:**
- ✅ Direct case opening
- ✅ Works with case numbers

**Cons:**
- ⚠️ Requires backend server
- ⚠️ API authentication needed
- ⚠️ More infrastructure to maintain

---

## 🎯 Recommended Approach

### **Recommended: Solution A (Get Record IDs)**

**Why:**
- Simplest for end users (one click to case)
- No additional infrastructure
- Standard Salesforce approach
- Most reliable

**Steps to Implement:**

1. **Export Case Data with Record IDs**
   ```sql
   -- Salesforce SOQL Query:
   SELECT Id, CaseNumber, CaseOwner.Name, Account.Name, 
          Product__c, Subject, Status, CreatedDate, Priority
   FROM Case
   WHERE CreatedDate = THIS_MONTH
   ```

2. **Update cases-data-embedded.js**
   ```javascript
   const casesData = [
     {
       "caseId": "500Dn00000ABC123",  // ← Add this field
       "caseNumber": "23758649",
       "caseOwner": "Akiko Inoue",
       ...
     }
   ];
   ```

3. **Update Dashboard Code**
   ```javascript
   const caseUrl = `https://thomsonreutersglis2e.lightning.force.com/lightning/r/Case/${c.caseId}/view`;
   row.innerHTML = `
     <td><a href="${caseUrl}" target="_blank" class="case-link">${c.caseNumber}</a></td>
     ...
   `;
   ```

---

## ❓ Questions for User

1. **Do you have access to export Salesforce data with Record IDs?**
   - If yes → Solution A is best
   - If no → Need alternative approach

2. **How is the current case data being exported?**
   - Salesforce Report?
   - Data Loader?
   - API integration?

3. **Can you share a case URL when you manually open a case in GSI?**
   - This will show us the exact URL format GSI uses
   - Example: Copy URL from browser when viewing a case

4. **Are there any custom Lightning components in your GSI instance?**
   - Might enable other URL patterns

---

## 🔬 Testing Recommendations

To find the right URL format:

1. **Manually open a case in GSI**
2. **Copy the full URL from browser**
3. **Share the URL** (we can analyze the pattern)
4. **Test URL patterns:**
   - Try replacing the Record ID with case number
   - Try different URL formats
   - Check what parameters GSI accepts

---

## 📝 Next Steps

**Option 1: Get Record IDs (Recommended)**
- User exports data with Salesforce Record IDs
- Update cases-data-embedded.js
- Update dashboard to use direct URLs
- ✅ Cases open directly with one click

**Option 2: Use Search (Temporary)**
- Implement search URL (already tested)
- Cases appear in search results
- ⚠️ User clicks case from results (2 steps)

**Option 3: Custom Solution**
- Develop Salesforce component or middleware
- More complex but possible if needed

---

## 📞 Action Required

**Please provide:**
1. ✅ Can you export case data with Salesforce Record IDs?
2. ✅ URL example: Open any case in GSI and share the URL
3. ✅ How are you currently exporting the case data?

**This information will help determine the best solution!**

---

Status: 🔍 **Awaiting User Input**
Date: 2026-05-27
Updated: Investigation Complete
