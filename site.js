async function fetchBazaarData() {
    const status = document.getElementById('status');
    const tbody = document.getElementById('gemBody');
    
    // 1. Informacja dla użytkownika
    if (status) status.innerText = "Łączenie z serwerem Hypixel (może to potrwać 5s)...";
    if (tbody) tbody.innerHTML = ""; // Czyścimy tabelę

    const apiUrl = "https://api.hypixel.net/v2/skyblock/bazaar";
    // Używamy AllOrigins, bo jest darmowe i nie ma limitu 1MB jak corsproxy.io
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;

    try {
        // 2. Pobieranie danych
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
            throw new Error(`Błąd sieci: ${response.status}`);
        }

        const rawData = await response.json();
        
        // 3. Sprawdzanie czy proxy zwróciło dane
        if (!rawData.contents) {
            throw new Error("Proxy nie zwróciło zawartości.");
        }

        const data = JSON.parse(rawData.contents);

        // 4. Budowanie tabeli
        if (data.success && tbody) {
            const products = data.products;
            
            // Lista gemów
            const gemTypes = [
                "RUBY", "AMETHYST", "JADE", "AMBER", "TOPAZ", "SAPPHIRE", "JASPER", "OPAL",
                "AQUAMARINE", "ONYX", "CITRINE", "PERIDOT"
            ];
            
            let foundCount = 0;

            gemTypes.forEach(type => {
                const fineKey = `FINE_${type}_GEM`;
                const flawlessKey = `FLAWLESS_${type}_GEM`;

                if (products[fineKey] && products[flawlessKey]) {
                    foundCount++;
                    const finePrice = products[fineKey].quick_status.buyPrice;
                    const flawlessPrice = products[flawlessKey].quick_status.buyPrice;
                    const fineX80 = finePrice * 80;
                    const diff = flawlessPrice - fineX80;

                    const row = `<tr>
                        <td class="gem-${type.toLowerCase()}"><strong>${type}</strong></td>
                        <td style="color: #55cdff;">${Math.round(finePrice).toLocaleString()}</td>
                        <td style="color: #aa00aa;">${Math.round(flawlessPrice).toLocaleString()}</td>
                        <td style="color: #ffac1c;">${Math.round(fineX80).toLocaleString()}</td>
                        <td style="color: ${diff > 0 ? '#00ff00' : '#ff4444'}; font-weight: bold;">
                            ${diff > 0 ? "ZYSK: " : "STRATA: "}${Math.abs(Math.round(diff)).toLocaleString()}
                        </td>
                    </tr>`;
                    tbody.innerHTML += row;
                }
            });

            if (status) status.innerText = `Sukces! Zaktualizowano: ${new Date().toLocaleTimeString()} (Znaleziono: ${foundCount})`;
        } else {
            throw new Error("Hypixel API zwróciło success: false");
        }

    } catch (error) {
        // To pokaże błąd na ekranie, zamiast pustej tabeli
        console.error(error);
        if (status) {
            status.innerHTML = `<span style="color: red; font-weight: bold;">BŁĄD: ${error.message} <br> Spróbuj odświeżyć stronę za chwilę.</span>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', fetchBazaarData);
