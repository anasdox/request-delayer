function updateRulesList() {
    const rulesList = document.getElementById('rulesList');
    rulesList.innerHTML = ''; // Clear current list

    // Load and display rules
    browser.storage.local.get({rules: []}).then((data) => {
        data.rules.forEach((rule, index) => {
            const ruleElement = document.createElement('div');
            ruleElement.className = 'rule';
            ruleElement.textContent = `URL Pattern = ${rule.urlPattern}, Delay = ${rule.delayTime}ms `;

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
            deleteButton.onclick = function() {
                data.rules.splice(index, 1); // Remove the rule
                browser.storage.local.set({rules: data.rules}).then(updateRulesList);
            };

            ruleElement.appendChild(deleteButton);
            rulesList.appendChild(ruleElement);
        });
    });
}

document.getElementById('save').addEventListener('click', () => {
    const urlPattern = document.getElementById('urlPattern').value.trim();
    const delayTime = document.getElementById('delayTime').value.trim();

    if (urlPattern && delayTime) {
        const newRule = { urlPattern, delayTime: parseInt(delayTime, 10) };

        // Save the new rule
        browser.storage.local.get({rules: []}).then((data) => {
            data.rules.push(newRule);
            browser.storage.local.set({rules: data.rules}).then(() => {
                updateRulesList(); // Refresh the list
                document.getElementById('urlPattern').value = ''; // Reset input fields
                document.getElementById('delayTime').value = '';
            });
        });
    }
});

// Initial load of rules
updateRulesList();
