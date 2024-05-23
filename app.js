document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('tableBody');
    const sortAlphabeticallyTab = document.getElementById('sortAlphabetically');
    const sortByCategoryTab = document.getElementById('sortByCategory');

    // Fetch the JSON data from the current directory
    fetch('Ref/zh-TW.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Default sort by alphabetically on page load
            renderTable(sortAlphabetically(data));
            setActiveTab(sortAlphabeticallyTab);

            sortAlphabeticallyTab.addEventListener('click', () => {
                renderTable(sortAlphabetically(data));
                setActiveTab(sortAlphabeticallyTab);
            });

            sortByCategoryTab.addEventListener('click', () => {
                renderTable(sortByCategory(data));
                setActiveTab(sortByCategoryTab);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            const errorMessage = document.createElement('tr');
            const errorCell = document.createElement('td');
            errorCell.colSpan = 2;
            errorCell.textContent = 'Error fetching data: ' + error.message;
            errorMessage.appendChild(errorCell);
            tableBody.appendChild(errorMessage);
        });

    function sortAlphabetically(data) {
        return data.sort((a, b) => a.name.localeCompare(b.name));
    }

    function sortByCategory(data) {
        const categorizedData = data.reduce((acc, item) => {
            acc[item.category] = acc[item.category] || [];
            acc[item.category].push(item);
            return acc;
        }, {});

        const sortedCategories = Object.keys(categorizedData).sort();
        return sortedCategories.flatMap(category => categorizedData[category].sort((a, b) => a.name.localeCompare(b.name)));
    }

    function renderTable(data) {
        tableBody.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            nameCell.textContent = item.name;
            const categoryCell = document.createElement('td');
            categoryCell.textContent = item.category;
            row.appendChild(nameCell);
            row.appendChild(categoryCell);
            tableBody.appendChild(row);
        });
    }

    function setActiveTab(activeTab) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');
    }
});
