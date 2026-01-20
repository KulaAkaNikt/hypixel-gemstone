async function fetchBazaarData() {
    const status = document.getElementById('status');
    const tbody = document.getElementById('gemBody');
    
    if (status) status.innerHTML = "Pobieranie danych i obliczanie podatku...";
    
    const apiUrl = "https://api.hypixel.net/v2/skyblock/bazaar";
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(apiUrl)}`;

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`Błąd API: ${response.status}`);

        const data = await response.json();

        if (data.success && tbody) {
            tbody.innerHTML = ""; 
            const products = data.products;
            
            const gemTypes = [
                "RUBY", "AMETHYST", "JADE", "AMBER", "TOPAZ", "SAPPHIRE", "JASPER", "OPAL",
                "AQUAMARINE", "ONYX", "CITRINE", "PERIDOT"
            ];
            
            gemTypes.forEach(type => {
                const fineKey = `FINE_${type}_GEM`;
                const flawlessKey = `FLAWLESS_${type}_GEM`;

                if (products[fineKey] && products[flawlessKey]) {
                    // 1. CENA KUPNA FINE (Twoje zlecenie kupna - Buy Order)
                    const fineBuyOrderPrice = products[fineKey].quick_status.buyPrice;
                    
                    // 2. CENA SPRZEDAŻY FLAWLESS (Twoja oferta sprzedaży - Sell Offer)
                    const flawlessSellOfferPrice = products[flawlessKey].quick_status.sellPrice;
                    
                    // 3. OBLICZENIA
                    const cost80xFine = fineBuyOrderPrice * 80;
                    
                    // Podatek Bazaru wynosi zazwyczaj 1% przy sprzedaży przez Sell Offer
                    const tax = 0.01; 
                    const revenueAfterTax = flawlessSellOfferPrice * (1 - tax);
                    
                    const netProfit = revenueAfterTax - cost80xFine;

                    const row = `<tr>
                        <td class="gem-${type.toLowerCase()}"><strong>${type}</strong></td>
                        <td style="color: #55cdff;">${Math.round(fineBuyOrderPrice).toLocaleString()}</td>
                        <td style="color: #aa00aa;">${Math.round(flawlessSellOfferPrice).toLocaleString()}</td>
                        <td style="color: #ffac1c;">${Math.round(cost80xFine).toLocaleString()}</td>
                        <td style="color: ${netProfit > 0 ? '#00ff00' : '#ff4444'}; font-weight: bold;">
                            ${netProfit > 0 ? "ZYSK NETTO: +" : "STRATA: "}${Math.abs(Math.round(netProfit)).toLocaleString()}
                        </td>
                    </tr>`;
                    tbody.innerHTML += row;
                }
            });

            status.innerHTML = `Zaktualizowano: ${new Date().toLocaleTimeString()}<br>
                               <small>Metoda: Fine (Buy Order) | Flawless (Sell Offer) | Podatek: 1%</small>`;
        }
    } catch (error) {
        if (status) status.innerHTML = `<span style="color: red;">Błąd: ${error.message}</span>`;
    }
}

document.addEventListener('DOMContentLoaded', fetchBazaarData);
