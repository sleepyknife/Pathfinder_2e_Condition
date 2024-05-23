document.addEventListener('DOMContentLoaded', () => {
    const itemList = document.getElementById('itemList');
    const detailsContainer = document.getElementById('detailsContainer');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const resetSelectionBtn = document.getElementById('resetSelectionBtn');

    let dataCache = [];

    // Fetch the JSON data from the current directory
    fetch('Ref/zh-TW.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            dataCache = data;
            // Default sort by category on page load
            renderList(dataCache);
            renderDetails(dataCache);
            

            categoryTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    highlightCategoryItems(tab.dataset.category);
                    setActiveTab(tab);
                });
            });

            resetSelectionBtn.addEventListener('click', () => {
                resetHighlight();
                resetActiveTab();
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Error fetching data: ' + error.message;
            itemList.appendChild(errorMessage);
        });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function sortByCategory(data) {
        const categorizedData = data.reduce((acc, item) => {
            acc[item.類別] = acc[item.類別] || [];
            acc[item.類別].push(item);
            return acc;
        }, {});

        const sortedCategories = Object.keys(categorizedData).sort();
        return sortedCategories.flatMap(category => categorizedData[category].sort((a, b) => a.狀態.localeCompare(b.狀態)));
    }

    function renderList(data) {
        itemList.innerHTML = '';
        data.forEach(item => {
            const listItem = document.createElement('div');
            listItem.className = 'list-item';
            listItem.innerHTML = `<a href="#${item.狀態}">${item.英語名} ${item.狀態}</a>`;
            itemList.appendChild(listItem);
        });
    }

    function renderDetails(data) {
        detailsContainer.innerHTML = '';
        data.forEach(item => {
            const detailsBox = document.createElement('div');
            detailsBox.className = 'details-box';
            detailsBox.id = item.狀態;
            detailsBox.innerHTML = `
                <table>
                    <tr>
                        <th colspan="2">${item.狀態} (${item.英語名})</th>
                    </tr>
                    <tr>
                        <td>數值影響</td>
                        <td>${item.數值影響}</td>
                    </tr>
                    <tr>
                        <td>效果描述</td>
                        <td>${item.效果描述.replace(/\n/g, '<br>')}</td>
                    </tr>
                </table>`;
            detailsContainer.appendChild(detailsBox);
        });
    }

    function highlightCategoryItems(category) {
        document.querySelectorAll('.list-item').forEach(item => {
            item.classList.remove('highlight');
        });
        dataCache.forEach(item => {
            if (item.類別.includes(category)) {
                document.querySelector(`.list-item a[href="#${item.狀態}"]`).parentElement.classList.add('highlight');
            }
        });
    }

    function resetHighlight() {
        document.querySelectorAll('.list-item').forEach(item => {
            item.classList.remove('highlight');
        });
    }

    function resetActiveTab() {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
		resetSelectionBtn.style.display = 'none';
    }

    function setActiveTab(activeTab) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');
		resetSelectionBtn.style.display = 'block';
    }
});
