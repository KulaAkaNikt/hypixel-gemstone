async function fetchBazaarData() {
    const status = document.getElementById('status');
    const tbody = document.getElementById('gemBody');
    
    if (status) status.innerHTML = "Aktualizacja...";

    const apiUrl = "https://api.hypixel.net/v2/skyblock/bazaar";
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(apiUrl)}`; // działający proxy

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`Błąd API: ${response.status}`);

        const data = await response.json();

        if (data.success && tbody) {
            tbody.innerHTML = ""; 
            const products = data.products;

            // debug - sprawdź co przyszło z API
            console.log(products);

            const format = num => num.toLocaleString('pl-PL', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            });

            const getPriceFromSummary = (product, summaryType) => {
                if (summaryType === 'sell') {
                    return product.sell_summary && product.sell_summary.length > 0 
                        ? product.sell_summary[0].pricePerUnit 
                        : product.quick_status.sellPrice;
                } else {
                    return product.buy_summary && product.buy_summary.length > 0 
                        ? product.buy_summary[0].pricePerUnit 
