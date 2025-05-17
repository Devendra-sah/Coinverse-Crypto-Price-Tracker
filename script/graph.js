const urlParams = new URLSearchParams(window.location.search);
const coinId = urlParams.get("coinId");
const errorDiv = document.getElementById("error");
const coinNameElement = document.getElementById("coin-name");
const coinLogoElement = document.getElementById("coin-logo");
const currentPriceElement = document.getElementById("current-price");
const rangeButtons = document.querySelectorAll(".range-btn");

let chartInstance = null; // To store the Chart.js instance

if (!coinId) {
  errorDiv.style.display = "block";
  errorDiv.textContent = "Error: No coin ID provided.";
  throw new Error("No coin ID provided in URL");
}

// API endpoint for historical price data
// Use CORS proxy for development
const proxyUrl = 'http://localhost:8080/';
// Use a CORS proxy for development
const apiBaseUrl = 'https://api.coingecko.com/api/v3';
const marketChartUrl = `${proxyUrl}${apiBaseUrl}/coins/${coinId}/market_chart`;
const coinDetailsUrl = `${proxyUrl}${apiBaseUrl}/coins/${coinId}`;

// Fetch coin details (name, logo, current price)
async function fetchCoinDetails() {
  try {
    const response = await fetch(coinDetailsUrl);
    if (!response.ok) {
      throw new Error(
        `HTTP error fetching coin details! Status: ${response.status}`
      );
    }
    const data = await response.json();
    coinNameElement.textContent = data.name;
    coinLogoElement.src = data.image.small;
    currentPriceElement.textContent = `$${data.market_data.current_price.usd.toFixed(2)}`;
  } catch (error) {
    errorDiv.style.display = "block";
    errorDiv.textContent = `Error fetching coin details: ${error.message}`;
  }
}

// Fetch historical price data
async function fetchPriceData(days, interval) {
  const params = {
    vs_currency: "usd",
    days: days,
    interval: interval,
  };

  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${marketChartUrl}?${queryString}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.prices || data.prices.length === 0) {
      throw new Error("No price data returned from API");
    }

    // Prepare data for Chart.js
    const labels = data.prices.map((price) => {
      const date = new Date(price[0]);
      if (days === "1") {
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
        });
      }
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric" });
    });
    const prices = data.prices.map((price) => price[1]);

    // Destroy existing chart if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Render the chart
    const ctx = document.getElementById("price-chart").getContext("2d");
    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Price (USD)",
            data: prices,
            borderColor: "#7927ff",
            backgroundColor: "rgba(121, 39, 255, 0.1)",
            fill: true,
            tension: 0.3,
            pointRadius: 0,
          }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: days === "1" ? "Time" : "Date",
              color: "white",
              font: { size: 14 },
            },
            ticks: { color: "white" },
            grid: { color: "rgba(255, 255, 255, 0.1)" },
          },
          y: {
            title: {
              display: true,
              text: "Price (USD)",
              color: "white",
              font: { size: 14 },
            },
            ticks: {
              color: "white",
              callback: function (value) {
                return `$${value.toFixed(2)}`;
              }
            },
            grid: { color: "rgba(255, 255, 255, 0.1)" }
          }
        },
        plugins: {
          legend: {
            labels: { color: "white" },
          },
          tooltip: {
            enabled: true,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "white",
            bodyColor: "white",
            callbacks: {
              label: function (context) {
                return `Price: $${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        }
      }
    });
  } catch (error) {
    errorDiv.style.display = "block";
    errorDiv.textContent = `Error: ${error.message}`;
  }
}

// Handle range button clicks
rangeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    rangeButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const days = button.getAttribute("data-days");
    const interval = days === "1" ? "hourly" : "daily";
    fetchPriceData(days, interval);
  });
});

// Fetch coin details and initial price data on page load
fetchCoinDetails();
fetchPriceData("30", "daily"); // Default to 30 days
