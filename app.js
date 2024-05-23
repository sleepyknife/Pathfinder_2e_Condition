document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('listContainer');
    const sortAlphabeticallyTab = document.getElementById('sortAlphabetically');
    const sortByCategoryTab = document.getElementById('sortByCategory');

    // Fetch the JSON data from the server
    fetch('/Ref/zh-TW.json')
        .then(response => response.json())
        .then(data => {
            // Default sort by alphabetically on page load
            renderList(sortAlphabetically(data));
            setActiveTab(sortAlphabeticallyTab);

            sortAlphabeticallyTab.addEventListener('click', () => {
                renderList(sortAlphabetically(data));
                setActiveTab(sortAlphabeticallyTab);
            });

            sortByCategoryTab.addEventListener('click', () => {
                renderList(sortByCategory(data));
                setActiveTab(sortByCategoryTab);
            });
        })
        .catch(error => console.error('Error fetching data:', error));

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

    function renderList(data) {
        listContainer.innerHTML = '';
        data.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} (${item.category})`;
            listContainer.appendChild(listItem);
        });
    }

    function setActiveTab(activeTab) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');
    }
});
