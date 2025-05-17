// Use CORS proxy for development
const proxyUrl = 'http://localhost:8080/'; // Use a local CORS proxy for development
// Use a CORS proxy for development
const apiUrl = `${proxyUrl}https://api.coingecko.com/api/v3/coins/markets`;

let params = {
    vs_currency: 'usd', // Default currency
    order: 'market_cap_desc',
    per_page: 250, // Fetch 250 coins to allow broader search
    page: 1,
    price_change_percentage: '24h'
};

// DOM Elements
const tableBody = document.getElementById('crypto-table-body');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const errorDiv = document.getElementById('error');
const currencySelect = document.getElementById('currency-select');
const searchForm = document.getElementById('search-form');

// Store the fetched data for search filtering
let allCoins = [];

// Function to fetch  crypto data from the API
async function fetchCryptoData() {
    try {
        // Construct the query String
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${apiUrl}?${queryString}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            throw new Error('No data returned from API');
        }
        allCoins = data; // Store the fetched data
        displayCoins(allCoins.slice(0, 10)); // Display the first 10 coins initially
    } catch (error) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = `Error: ${error.message}`;
    }
}

// Function to display coins in the table
function displayCoins(coins) {
    tableBody.innerHTML = ''; // Clear previous data

    coins.forEach((coin, index) => {
        if (!coin.image || !coin.current_price || !coin.price_change_percentage_24h || !coin.market_cap) {
            console.warn(`Incomplete data for coin: ${coin.name || 'Unknown'}`);
            return; // Skip coins with missing data
          }

        const tr = document.createElement('tr');
        const changeClass = coin.price_change_percentage_24h < 0 ? 'change-negative' : 'change-positive';
        const currencySymbol = params.vs_currency === 'usd' ? '$' : params.vs_currency === 'eur' ? '€' : '₹';
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td class="coin-cell">
                <img src="${coin.image}" alt="${coin.name}">
                <span>${coin.name}</span>
            </td>
            <td>${currencySymbol}${coin.current_price.toFixed(2)}</td>
            <td class="${changeClass}">${coin.price_change_percentage_24h.toFixed(2)}%</td>
            <td>${currencySymbol}${coin.market_cap.toLocaleString()}</td>
        `;

        // Add click event to open graph page with coin ID
        tr.onclick = () => {
            window.open(`graph.html?coinId=${coin.id}`, '_blank');
        };
        tableBody.appendChild(tr);
    });
}

// Function to handle search
function searchCoins(event) {
    if (event) {
        event.preventDefault(); // Prevent form submission
    }

    const searchTerm = searchInput.value.trim().toLowerCase();
    let filteredCoins = [];

    if (searchTerm) {
        filteredCoins = allCoins.filter(coin => 
            coin.name && coin.name.toLowerCase().includes(searchTerm)).slice(0, 10); // Limit to 10 coins after filtering
    } else {
        filteredCoins = allCoins.slice(0, 10); // Show top 10 if search is empty
    }

    if (filteredCoins.length === 0) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'No coins found matching your search.';   
    }
    else {
        errorDiv.style.display = 'none';
    }

    displayCoins(filteredCoins);
}

// Function to handle currency change
function handleCurrencyChange() {
    const selectedCurrency = currencySelect.value;
    params.vs_currency = selectedCurrency; // Update the currency parameter
    fetchCryptoData(); // Fetch data again with the new currency
}

// Event Listeners
searchBtn.addEventListener('click', searchCoins);
searchForm.addEventListener('submit', searchCoins);
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchCoins(event);
    }
});

currencySelect.addEventListener('change', handleCurrencyChange);

// Fetch data on page load
fetchCryptoData();