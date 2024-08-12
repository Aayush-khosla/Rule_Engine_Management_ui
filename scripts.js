function populateDropdown(url, dropdownId, valueField) {
    fetch(`https://aayush-khosla.github.io/Rule_Engine_Management_ui/${url}`)
        .then(response => response.json())
        .then(data => {
            const dropdown = document.getElementById(dropdownId);
            dropdown.innerHTML = '<option value="">--Select--</option>';
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item._id;
                option.textContent = item[valueField];
                dropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

function populateLists() {
    fetch('https://rule-engine-management-server-git-main-aayushkhoslas-projects.vercel.app/rules')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const rulesList = document.getElementById('rulesList');
            rulesList.innerHTML = '';
            data.forEach(rule => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item list-item';
                listItem.textContent = rule.string;
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn btn-danger btn-sm btn-delete';
                deleteBtn.textContent = 'Delete';
                deleteBtn.onclick = () => deleteItem('rule', rule._id, rulesList);
                listItem.appendChild(deleteBtn);
                rulesList.appendChild(listItem);
            });
            populateDropdown('rules', 'rule1', 'string');
            populateDropdown('rules', 'rule2', 'string');
            populateDropdown('rules', 'checkRuleRule', 'string');
        })
        .catch(error => {
            console.error('Error fetching rules:', error);
            toastr.error('Failed to load rules.');
        });

    fetch('https://rule-engine-management-server-git-main-aayushkhoslas-projects.vercel.app/data')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const dataList = document.getElementById('dataList');
            dataList.innerHTML = '';
            data.forEach(dataItem => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item list-item';
                listItem.textContent = dataItem.string;
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn btn-danger btn-sm btn-delete';
                deleteBtn.textContent = 'Delete';
                deleteBtn.onclick = () => deleteItem('data', dataItem._id, dataList);
                listItem.appendChild(deleteBtn);
                dataList.appendChild(listItem);
            });
            populateDropdown('data', 'checkRuleData', 'string');
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            toastr.error('Failed to load data.');
        });
}


function deleteItem(type, id, listElement) {
    fetch(`https://rule-engine-management-server-git-main-aayushkhoslas-projects.vercel.app/del${type}/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => {
        toastr.success(`${type.slice(0, -1)} deleted successfully!`);
        populateLists();
    })
    .catch(error => {
        toastr.error('Error deleting item.');
        console.error('Error:', error);
    });
}

function combineRules() {
    const rule1 = document.getElementById('rule1').value;
    const rule2 = document.getElementById('rule2').value;
    const operator = document.getElementById('operator').value;

    if (!rule1 || !rule2 || !operator) {
        toastr.error('Please select both rules and an operator.');
        return;
    }

    fetch('https://rule-engine-management-server-git-main-aayushkhoslas-projects.vercel.app/combineRules', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ruleIds: [rule1, rule2],
            operator: operator
        })
    })
    .then(response => response.json())
    .then(() => {
        toastr.success('Rules combined successfully!');
        populateLists();
    })
    .catch(error => {
        toastr.error('Error combining rules.');
        console.error('Error:', error);
    });
}

function checkRule() {
    const ruleId = document.getElementById('checkRuleRule').value;
    const dataId = document.getElementById('checkRuleData').value;

    if (!ruleId || !dataId) {
        toastr.error('Please select both a rule and data.');
        return;
    }

    fetch(`https://rule-engine-management-server-git-main-aayushkhoslas-projects.vercel.app/checkrule/${ruleId}/${dataId}`)
    .then(response => response.json())
    .then(data => {
        toastr.success(`Result: ${data.result}`);
    })
    .catch(error => {
        toastr.error('Error checking rule.');
        console.error('Error:', error);
    });
}

document.getElementById('addRuleBtn').addEventListener('click', function() {
    const ruleString = document.getElementById('ruleString').value;
    if (!ruleString) {
        toastr.error('Please enter a rule string.');
        return;
    }

    fetch('https://rule-engine-management-server-git-main-aayushkhoslas-projects.vercel.app/addrule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ string: ruleString })
    })
    .then(response => response.json())
    .then(() => {
        toastr.success('Rule added successfully!');
        populateLists();
    })
    .catch(error => {
        toastr.error('Error adding rule.');
        console.error('Error:', error);
    });
});

document.getElementById('addDataBtn').addEventListener('click', function() {
    const dataString = document.getElementById('dataString').value;
    if (!dataString) {
        toastr.error('Please enter data.');
        return;
    }

    fetch('https://rule-engine-management-server-git-main-aayushkhoslas-projects.vercel.app/adddata', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ string: dataString })
    })
    .then(response => response.json())
    .then(() => {
        toastr.success('Data added successfully!');
        populateLists();
    })
    .catch(error => {
        toastr.error('Error adding data.');
        console.error('Error:', error);
    });
});

document.getElementById('combineRuleBtn').addEventListener('click', combineRules);
document.getElementById('checkRuleBtn').addEventListener('click', checkRule);

populateLists();
