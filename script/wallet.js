
      // Use local CORS proxy for development
      const proxyUrl = 'http://localhost:8080/';
      const apiUrl = `${proxyUrl}https://api.coingecko.com/api/v3/coins/markets`;

      // DOM Elements
      const coinSelect = document.getElementById('coin-select');
      const coinQuantity = document.getElementById('coin-quantity');
      const addCoinBtn = document.getElementById('add-coin-btn');
      const walletTableBody = document.getElementById('wallet-table-body');
      const totalValueElement = document.getElementById('total-value');
      const errorDiv = document.getElementById('error');

      // Store coin data and wallet
      let allCoins = []; // All coins fetched from CoinGecko
      let wallet = JSON.parse(localStorage.getItem('wallet')) || []; // User's wallet stored in localStorage

      // Fetch coin data to populate the dropdown
      async function fetchCoins() {
        try {
          const params = {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 250,
            page: 1,
            price_change_percentage: '24h'
          };
          const queryString = new URLSearchParams(params).toString();
          const response = await fetch(`${apiUrl}?${queryString}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          if (!data || data.length === 0) {
            throw new Error('No data returned from API');
          }

          allCoins = data;
          populateCoinDropdown();
          displayWallet();
        } catch (error) {
          errorDiv.style.display = 'block';
          errorDiv.textContent = `Error: ${error.message}`;
        }
      }

      // Populate the coin dropdown
      function populateCoinDropdown() {
        allCoins.forEach(coin => {
          const option = document.createElement('option');
          option.value = coin.id;
          option.textContent = coin.name;
          coinSelect.appendChild(option);
        });
      }

      // Display the wallet in the table
      function displayWallet() {
        walletTableBody.innerHTML = ''; // Clear previous data
        let totalValue = 0;

        wallet.forEach((holding, index) => {
          const coin = allCoins.find(c => c.id === holding.id);
          if (!coin) {
            console.warn(`Coin not found: ${holding.id}`);
            return;
          }

          const price = coin.current_price;
          const value = holding.quantity * price;
          totalValue += value;

          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td class="coin-cell">
              <img src="${coin.image}" alt="${coin.name}">
              <span>${coin.name}</span>
            </td>
            <td>${holding.quantity.toFixed(4)}</td>
            <td>$${price.toFixed(2)}</td>
            <td>$${value.toFixed(2)}</td>
            <td><button class="remove-btn" data-index="${index}">Remove</button></td>
          `;
          walletTableBody.appendChild(tr);
        });

        // Update total portfolio value
        totalValueElement.textContent = `$${totalValue.toFixed(2)}`;

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-btn').forEach(button => {
          button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            removeCoin(index);
          });
        });
      }

      // Add a coin to the wallet
      function addCoin(event) {
        event.preventDefault();

        const coinId = coinSelect.value;
        const quantity = parseFloat(coinQuantity.value);

        if (!coinId || isNaN(quantity) || quantity <= 0) {
          errorDiv.style.display = 'block';
          errorDiv.textContent = 'Please select a coin and enter a valid quantity.';
          return;
        }

        errorDiv.style.display = 'none';

        // Check if the coin is already in the wallet
        const existingHolding = wallet.find(holding => holding.id === coinId);
        if (existingHolding) {
          existingHolding.quantity += quantity;
        } else {
          wallet.push({ id: coinId, quantity: quantity });
        }

        // Save to localStorage
        localStorage.setItem('wallet', JSON.stringify(wallet));

        // Reset form
        coinSelect.value = '';
        coinQuantity.value = '';

        // Refresh the table
        displayWallet();
      }

      // Remove a coin from the wallet
      function removeCoin(index) {
        wallet.splice(index, 1);
        localStorage.setItem('wallet', JSON.stringify(wallet));
        displayWallet();
      }

      // Event Listener for adding a coin
      addCoinBtn.addEventListener('click', addCoin);

      // Fetch coins on page load
      fetchCoins();