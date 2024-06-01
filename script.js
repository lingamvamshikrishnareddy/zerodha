'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'QRU15ILL9E9S9UXZ';

    const fetchStockData = (symbol, elementId) => {
        fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`)
            .then(response => {
                console.log(`Received response for ${symbol}`);
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(`Processed data for ${symbol}:`, data);

                if (data['Time Series (Daily)']) {
                    const timeSeries = data['Time Series (Daily)'];
                    const lastDate = Object.keys(timeSeries)[0];
                    const lastData = timeSeries[lastDate];
                    const lastUpdated = data['Meta Data']['3. Last Refreshed'];
                    const price = lastData['4. close'];
                    const element = document.getElementById(elementId);
                    if (element) {
                        element.innerText = `Last updated: ${lastUpdated}, Price: ${price}`;
                    } else {
                        console.error(`Element with ID ${elementId} not found in the DOM.`);
                    }
                } else {
                    console.error(`Unexpected data format for ${symbol}:`, data);
                    throw new Error('Invalid data format');
                }
            })
            .catch(error => {
                console.error(`Error fetching data for ${symbol}:`, error);
                const element = document.getElementById(elementId);
                if (element) {
                    element.innerText = `Error loading data for ${symbol}`;
                } else {
                    console.error(`Element with ID ${elementId} not found in the DOM.`);
                }
            });
    };

    fetchStockData('IBM', 'ibm'); // Test with a known symbol to verify the structure
    fetchStockData('^GSPC', 'sp-500'); // Updated symbol for S&P 500
    fetchStockData('^NSEI', 'nifty-50'); // Updated symbol for Nifty 50
});
