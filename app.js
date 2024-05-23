document.addEventListener('DOMContentLoaded', () => {
    const itemList = document.getElementById('itemList');
    const detailsContainer = document.getElementById('detailsContainer');
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
            renderList(sortAlphabetically(data));
            renderDetails(data);
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
        .catch(error => {
            console.error('Error fetching data:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Error fetching data: ' + error.message;
            itemList.appendChild(errorMessage);
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

    function renderList(data) {
        itemList.innerHTML = '';
        data.forEach(item => {
            const listItem = document.createElement('div');
            listItem.className = 'list-item';
            listItem.innerHTML = `<a href="#${item.name}">${item.name}</a>`;
            itemList.appendChild(listItem);
        });
    }

    function renderDetails(data) {
        detailsContainer.innerHTML = '';
        data.forEach(item => {
            const detailsBox = document.createElement('div');
            detailsBox.className = 'details-box';
            detailsBox.id = item.name;
            detailsBox.innerHTML = `<h3>${item.name}</h3><p>Category: ${item.category}</p>`;
            detailsContainer.appendChild(detailsBox);
        });
    }

    function setActiveTab(activeTab) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');
    }
});
