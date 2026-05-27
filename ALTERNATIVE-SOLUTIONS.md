# Alternative Creative Solutions for Case Auto-Search

## 🎯 Objective
Find workarounds to auto-search cases in GSI from external dashboard

---

## 💡 Creative Solution 1: localStorage Bridge

### How It Works:
1. Dashboard stores case number in browser's localStorage
2. Opens GSI in same window (not new tab)
3. Custom script on GSI side reads localStorage
4. Auto-populates search with stored case number

### Implementation:
```javascript
// On Dashboard:
localStorage.setItem('searchCaseNumber', caseNumber);
window.location.href = gsiUrl + '/lightning/page/home';

// On GSI (need to add script):
window.addEventListener('load', () => {
    const caseNum = localStorage.getItem('searchCaseNumber');
    if (caseNum) {
        // Auto-fill search box
        document.querySelector('[placeholder*="Search"]').value = caseNum;
        localStorage.removeItem('searchCaseNumber');
    }
});
```

**Pros:**
- ✅ Can pass data between pages
- ✅ Works across domains

**Cons:**
- ❌ Requires script injection on GSI side
- ❌ Needs Salesforce admin access
- ❌ Same-window navigation (loses dashboard)

---

## 💡 Creative Solution 2: URL Fragment Data

### How It Works:
Use URL hash to pass case number, custom landing page reads it

### Implementation:
```
https://thomsonreutersglis2e.lightning.force.com/lightning/page/home#case=23758649
                                                                    ↑
                                                           Data in hash fragment
```

**Pros:**
- ✅ Data preserved in URL
- ✅ Can be read by JavaScript

**Cons:**
- ❌ Still needs custom script on GSI
- ❌ Salesforce might not allow custom scripts

---

## 💡 Creative Solution 3: Salesforce Classic URL

### How It Works:
Try legacy Salesforce Classic search URLs (pre-Lightning)

### URLs to Test:
```javascript
// Classic Global Search
https://thomsonreutersglis2e.lightning.force.com/_ui/search/ui/UnifiedSearchResults?str={caseNumber}

// Classic Case Search
https://thomsonreutersglis2e.lightning.force.com/search/SearchResults?searchType=Case&str={caseNumber}

// Classic Simple Search
https://thomsonreutersglis2e.lightning.force.com/_ui/search/ui/UnifiedSearchResults?searchType=2&sen=500&sen=001&str={caseNumber}
```

**Why It Might Work:**
- Classic URLs have different security model
- May not be blocked like Lightning URLs
- Legacy compatibility

---

## 💡 Creative Solution 4: Salesforce Mobile URLs

### How It Works:
Use Salesforce mobile app URL schemes

### URLs to Test:
```javascript
// Salesforce1 Mobile
salesforce1://search?searchTerm={caseNumber}

// Mobile Web
https://thomsonreutersglis2e.lightning.force.com/one/one.app?source=aloha#search/term={caseNumber}
```

**Pros:**
- ✅ Different URL patterns
- ✅ May bypass restrictions

**Cons:**
- ⚠️ Might only work on mobile
- ⚠️ May redirect to mobile view

---

## 💡 Creative Solution 5: Custom Visualforce Page

### How It Works:
Create a simple Visualforce page that accepts case number parameter

### Salesforce Admin Creates:
```apex
<apex:page>
    <script>
        var caseNum = '{!$CurrentPage.parameters.casenum}';
        if (caseNum) {
            // Redirect to search or case
            window.location.href = '/lightning/r/Case/list?search=' + caseNum;
        }
    </script>
</apex:page>
```

**Dashboard Links To:**
```
https://thomsonreutersglis2e.lightning.force.com/apex/CaseSearchRedirect?casenum=23758649
```

**Pros:**
- ✅ Full control over redirect logic
- ✅ Can accept parameters
- ✅ Works with Lightning

**Cons:**
- ❌ Requires Salesforce development
- ❌ Admin access needed

---

## 💡 Creative Solution 6: Lightning Web Component URL

### How It Works:
Create a simple LWC that accepts case number and redirects

### Component URL:
```
https://thomsonreutersglis2e.lightning.force.com/lightning/cmp/c__caseSearcher?caseNumber=23758649
```

**Pros:**
- ✅ Modern Lightning approach
- ✅ Can use NavigationMixin
- ✅ Clean integration

**Cons:**
- ❌ Requires LWC development
- ❌ Admin/developer access

---

## 💡 Creative Solution 7: Browser Bookmarklet

### How It Works:
User installs a bookmarklet that enhances the dashboard

### Bookmarklet Code:
```javascript
javascript:(function(){
    document.querySelectorAll('.case-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const caseNum = this.textContent;
            window.open('https://thomsonreutersglis2e.lightning.force.com/lightning/page/home', '_blank');
            prompt('Copy this case number and search in GSI:', caseNum);
        });
    });
})();
```

**Pros:**
- ✅ User-controlled
- ✅ No server changes needed
- ✅ Can inject functionality

**Cons:**
- ⚠️ Requires user action (install bookmarklet)
- ⚠️ Not automatic

---

## 💡 Creative Solution 8: SOQL Query URL

### How It Works:
Use Salesforce SOQL query URLs (if available)

### URL Format:
```
https://thomsonreutersglis2e.lightning.force.com/services/data/v60.0/query?q=SELECT+Id+FROM+Case+WHERE+CaseNumber='23758649'
```

**Pros:**
- ✅ Direct API query
- ✅ Returns Case ID

**Cons:**
- ❌ Returns JSON, not page
- ❌ Requires authentication
- ❌ API access needed

---

## 💡 Creative Solution 9: Email-to-Case URL

### How It Works:
Use Web-to-Case or Email-to-Case URL patterns

### URL Format:
```
https://thomsonreutersglis2e.lightning.force.com/email?case={caseNumber}
```

**Why Try:**
- Different endpoint
- May have different security

**Likelihood:**
- ⚠️ Probably won't work for viewing

---

## 💡 Creative Solution 10: Smart Notification System

### How It Works:
Enhanced UX that makes manual search faster

### Features:
1. Large modal with case number
2. Countdown timer (3 seconds)
3. Click to copy button
4. Visual highlight of case number
5. Keyboard shortcut (Ctrl+F) hint

### Implementation:
```javascript
function smartCaseLink(caseNumber) {
    // Show modal
    showModal({
        title: 'Opening Case in GSI',
        caseNumber: caseNumber,
        instructions: 'Press Ctrl+V to paste in GSI search',
        countdown: 3
    });
    
    // Copy to clipboard
    navigator.clipboard.writeText(caseNumber);
    
    // Open GSI after countdown
    setTimeout(() => {
        window.open(gsiUrl, '_blank');
    }, 3000);
}
```

**Pros:**
- ✅ Better UX than current
- ✅ No Salesforce changes needed
- ✅ Clear instructions

**Cons:**
- ⚠️ Still requires paste action
- ⚠️ Not fully automatic

---

## 💡 Creative Solution 11: Background API Query

### How It Works:
Dashboard queries Salesforce API to get Record ID, then opens direct URL

### Process:
1. Click case number
2. JavaScript calls backend service
3. Backend queries Salesforce API: `SELECT Id FROM Case WHERE CaseNumber = 'X'`
4. Returns Record ID
5. Opens direct case URL

### URL After Lookup:
```
https://thomsonreutersglis2e.lightning.force.com/lightning/r/Case/500PA00000kEEQSYA4/view
```

**Pros:**
- ✅ Direct case opening
- ✅ Works with case numbers only
- ✅ One-click experience

**Cons:**
- ❌ Requires backend server
- ❌ Salesforce API credentials
- ❌ More complex architecture

---

## 💡 Creative Solution 12: Browser Extension

### How It Works:
Lightweight Chrome/Edge extension enhances dashboard

### What It Does:
1. Detects clicks on case numbers
2. Intercepts navigation
3. Opens GSI
4. Injects search command into page

### Installation:
```
1. Install "GSI Case Helper" extension
2. One-time setup
3. Works automatically forever
```

**Pros:**
- ✅ Can inject scripts into GSI
- ✅ Full automation possible
- ✅ One-time setup

**Cons:**
- ❌ Requires installation
- ❌ Maintenance needed
- ❌ Not for all users

---

## 🎯 Most Practical Solutions to Implement Now

### Tier 1: No Salesforce Changes Required

1. **Smart Notification System** ⭐
   - Time: 20 minutes to implement
   - Result: Better UX, clear instructions
   - User experience: Good

2. **Enhanced Clipboard with Modal**
   - Time: 15 minutes to implement
   - Result: Copy + clear notification
   - User experience: Good

### Tier 2: Requires Salesforce Admin

3. **Custom Visualforce Page**
   - Time: 1 hour (admin creates page)
   - Result: Direct parameter support
   - User experience: Excellent

4. **Lightning Web Component**
   - Time: 2 hours (developer creates)
   - Result: Modern solution
   - User experience: Excellent

### Tier 3: Requires Backend Service

5. **API Lookup Service**
   - Time: 4 hours (backend development)
   - Result: Case Number → Record ID conversion
   - User experience: Perfect

---

## 🔬 Additional Tests to Try

Let me create another test page with these alternative approaches:

### Test URLs:
1. Classic Salesforce URLs
2. Mobile URLs
3. Different parameter combinations
4. Legacy endpoints

---

## 📝 My Recommendations

### **Immediate (Next 30 minutes):**
**Implement Smart Notification System**
- Enhanced modal with case number
- Auto-copy to clipboard
- Clear visual instructions
- Countdown before GSI opens

### **Short-term (Need Salesforce Admin):**
**Create Custom Visualforce Redirect Page**
- Admin creates simple VF page
- Accepts case number parameter
- Redirects to search or case
- Works immediately

### **Long-term (Best Solution):**
**Export Data with Record IDs**
- Direct case URLs
- One-click opening
- Zero technical complexity

---

## 🎯 Next Steps

I can:

1. **Test Classic/Mobile URLs** (5 min)
   - Create new test page
   - Try legacy endpoints

2. **Implement Smart Notification** (20 min)
   - Better UX right now
   - No Salesforce changes

3. **Create VF Page Template** (10 min)
   - Give you code for admin
   - If they can add it

**Which would you like me to do first?**

---

**Status:** Ready to implement alternatives  
**Options:** Multiple creative solutions available  
**Best:** Smart notification (immediate) + VF page (if possible)
