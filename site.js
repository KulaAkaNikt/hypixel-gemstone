async function fetchBazaarData() {
    const status = document.getElementById('status');
    const tbody = document.getElementById('gemBody');
    
    if (status) status.innerText = "Pobieranie cen z Bazaar...";
    if (tbody) tbody.innerHTML = ""; 

    const apiUrl = "https://api.hypixel.net/v2/skyblock/bazaar";
    
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            // Fallback na proxy jeśli bezpośrednie API nie działa
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
            const proxyResponse = await fetch(proxyUrl);
            if (!proxyResponse.ok) throw new Error(`Błąd sieci: ${response.status}`);
            var data = await proxyResponse.json();
        } else {
            var data = await response.json();
        }

        if (data.success && tbody) {
            const products = data.products;
            const gemTypes = [
                "RUBY", "AMETHYST", "JADE", "AMBER", "TOPAZ", "SAPPHIRE", 
                "JASPER", "OPAL", "AQUAMARINE", "ONYX", "CITRINE", "PERIDOT"
            ];
            
            // Pobierz aktualny timestamp dla porównania
            const lastUpdated = data.lastUpdated || Date.now();
            
            gemTypes.forEach(type => {
                const fineKey = `FINE_${type}_GEM`;
                const flawlessKey = `FLAWLESS_${type}_GEM`;

                if (products[fineKey] && products[flawlessKey]) {
                    // PRAWIDŁOWE ceny z Bazaar API:
                    // buyPrice - aktualna cena kupna (najwyższy buy order)
                    // sellPrice - aktualna cena sprzedaży (najniższy sell offer)
                    
                    const fineProduct = products[fineKey];
                    const flawlessProduct = products[flawlessKey];
                    
                    // Cena Fine Gem: cena SPRZEDAŻY (bo chcesz KUPIĆ Fine Gems)
                    const fineBuyPrice = fineProduct.quick_status?.sellPrice || 0;
                    
                    // Cena Flawless Gem: cena KUPNA (bo chcesz SPRZEDAĆ Flawless Gems)
                    const flawlessSellPrice = flawlessProduct.quick_status?.buyPrice || 0;
                    
                    // Alternatywnie, można użyć pól ze szczegółowych danych
                    const finePrice = fineProduct.buy_summary?.[0]?.pricePerUnit || fineBuyPrice;
                    const flawlessPrice = flawlessProduct.sell_summary?.[0]?.pricePerUnit || flawlessSellPrice;
                    
                    // Sprawdź też sell_summary dla Fine i buy_summary dla Flawless dla porównania
                    const fineSellOffer = fineProduct.sell_summary?.[0]?.pricePerUnit || 0;
                    const flawlessBuyOrder = flawlessProduct.buy_summary?.[0]?.pricePerUnit || 0;
                    
                    // Użyj najbardziej odpowiednich cen
                    const fineCost = finePrice > 0 ? Math.round(finePrice) : Math.round(fineBuyPrice);
                    const flawlessRevenue = flawlessPrice > 0 ? Math.round(flawlessPrice) : Math.round(flawlessSellPrice);
                    
                    // Koszt 80 Fine Gems (do craftu Flawless)
                    const fineX80 = fineCost * 80;
                    const diff = flawlessRevenue - fineX80;
                    
                    // Formatowanie liczb
                    const formatNumber = (num) => Math.round(num).toLocaleString('pl-PL');
                    
                    const row = `<tr>
                        <td class="gem-${type.toLowerCase()}"><strong>${type}</strong></td>
                        <td style="color: #55cdff;">${formatNumber(fineCost)}</td>
                        <td style="color: #aa00aa;">${formatNumber(flawlessRevenue)}</td>
                        <td style="color: #ffac1c;">${formatNumber(fineX80)}</td>
                        <td style="color: ${diff > 0 ? '#00ff00' : '#ff4444'}; font-weight: bold;">
                            ${diff > 0 ? "ZYSK: " : "STRATA: "}${formatNumber(Math.abs(diff))}
                        </td>
                    </tr>`;
                    tbody.innerHTML += row;
                }
            });

            if (status) {
                const updateTime = new Date(lastUpdated).toLocaleTimeString('pl-PL');
                status.innerText = `Dane zaktualizowane: ${updateTime}`;
            }
        }
    } catch (error) {
        console.error('Błąd pobierania danych:', error);
        if (status) {
            status.innerHTML = `<span style="color: red;">BŁĄD: ${error.message}</span>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', fetchBazaarData);
