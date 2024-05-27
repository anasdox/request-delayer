function updateRulesList() {
    const rulesList = document.getElementById('rulesList');
    rulesList.innerHTML = ''; // Clear current list
  
    // Load and display rules
    browser.storage.local.get({ rules: [] }).then((data) => {
      data.rules.forEach((rule, index) => {
        const ruleElement = document.createElement('div');
        ruleElement.className = 'rule';
        ruleElement.textContent = `URL Pattern = ${rule.urlPattern}, Delay = ${
          rule.delayTime
        }ms, Overwrite Response Body = ${
          rule.overrideResponseBody || ''
        }, Overwrite Status Code = ${rule.overrideStatusCode || 200}`;
  
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
        deleteButton.onclick = function () {
          data.rules.splice(index, 1); // Remove the rule
          browser.storage.local.set({ rules: data.rules }).then(updateRulesList);
        };
  
        ruleElement.appendChild(deleteButton);
        rulesList.appendChild(ruleElement);
      });
    });
  }
  
  document.getElementById('addRuleForm').addEventListener('submit', (e) => {
    e.preventDefault();
  
    const urlPattern = document.getElementById('urlPatternInput').value.trim();
    const delayTime = document.getElementById('delayTimeInput').value.trim();
    const responseBody = document.getElementById('responseBodyInput').value.trim();
    const statusCode = document.getElementById('statusCodeInput').value.trim();
  
    if (urlPattern && delayTime) {
      const newRule = {
        urlPattern,
        delayTime: parseInt(delayTime, 10),
        overrideResponseBody: responseBody,
        overrideStatusCode: parseInt(statusCode, 10),
      };
  
      // Save the new rule
      browser.storage.local.get({ rules: [] }).then((data) => {
        data.rules.push(newRule);
        browser.storage.local.set({ rules: data.rules }).then(() => {
          updateRulesList(); // Refresh the list
          document.getElementById('urlPatternInput').value = ''; // Reset input fields
          document.getElementById('delayTimeInput').value = '';
          document.getElementById('responseBodyInput').value = '';
          document.getElementById('statusCodeInput').value = '';
        });
      });
    }
  });
  
  // Initial load of rules
  updateRulesList();
  