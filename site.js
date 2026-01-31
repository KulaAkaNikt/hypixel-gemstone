document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('gemBody');

    // Przykładowe dane do testów (zastępuje fetch, żeby działało od razu)
    const data = {
        success: true,
        products: {
            "FINE_RUBY_GEM": { sell_summary:[{pricePerUnit:1000}], quick_status:{sellPrice:1000}, buy_summary:[{pricePerUnit:1100}], quick_status:{buyPrice:1100} },
            "FLAWLESS_RUBY_GEM": { buy_summary:[{pricePerUnit:1200}], quick_status:{buyPrice:1200}, sell_summary:[{pricePerUnit:1150}], quick_status:{sellPrice:1150} },
            "FINE_AMETHYST_GEM": { sell_summary:[{pricePerUnit:800}], quick_status:{sellPrice:800}, buy_summary:[{pricePerUnit:900}], quick_status:{buyPrice:900} },
            "FLAWLESS_AMETHYST_GEM": { buy_summary:[{pricePerUnit:950}], quick_status:{buyPrice:950}, sell_summary:[{pricePerUnit:920}], quick_status:{sellPrice:920} },
            "FERMENTO": { sell_summary:[{pricePerUnit:50}], quick_status:{sellPrice:50}, buy_summary:[{pricePerUnit:60}], quick_status:{buyPrice:60} },
            "CONDENSED_FERMENTO": { buy_summary:[{pricePerUnit:500}], quick_status:{buyPrice:500}, sell_summary:[{pricePerUnit:480}], quick_status:{sellPrice:480} },
            "HELIANTHUS": { sell_summary:[{pricePerUnit:30}], quick_status:{sellPrice:30}, buy_summary:[{pricePerUnit:40}], quick_status:{buyPrice:40} },
            "CONDENSED_HELIANTHUS": { buy_summary:[{pricePerUnit:300}], quick_status:{buyPrice:300}, sell_summary:[{pricePerUnit:280}], quick_status:{sellPrice:280} }
        }
    };

    const products = data.products;
    const taxRate = 0.011;

    const format = num => num.toLocaleString('pl-PL', { minimumFractionDigits:1, maximumFractionDigits:1 });

    const getPriceFromSummary = (product, summaryType) => {
        if(summaryType === 'sell'){
            return product.sell_summary && product.sell_summary.length>0 ? product.sell_summary[0].pricePerUnit : product.quick_status.sellPrice;
        } else {
            return product.buy_summary && product.buy_summary.length>0 ? product.buy_summary[0].pricePerUnit : product.quick_status.buyPrice;
        }
    };

    // Wyświetlanie gemów
    const gemTypes = ["RUBY","AMETHYST"];
    gemTypes.forEach(type => {
        const fine = products[`FINE_${type}_GEM`];
        const flawless = products[`FLAWLESS_${type}_GEM`];
        if(fine && flawless){
            const priceFine = getPriceFromSummary(fine,'sell');
            const priceFlawless = getPriceFromSummary(flawless,'buy');
            const cost80 = priceFine*80;
            const netProfit = (priceFlawless*(1-taxRate))-cost80;

            tbody.innerHTML += `<tr>
                <td class="gem-cell gem-${type.toLowerCase()}">
                    <img src="icons/${type.toLowerCase()}.png" class="gem-icon">
                    <strong>${type}</strong>
                </td>
                <td style="color:#55cdff;">${format(priceFine)}</td>
                <td style="color:#aa00aa;">${format(priceFlawless)}</td>
                <td style="color:#ffac1c;">${format(cost80)}</td>
                <td style="color:${netProfit>=0?'#00ff00':'#ff4444'}; font-weight:bold;">
                    ${netProfit>=0?'+':''}${format(netProfit)}
                </td>
            </tr>`;
        }
    });

    // Fermento i Helianthus
    const farmItems = [
        { base:"FERMENTO", condensed:"CONDENSED_FERMENTO", label:"Fermento"},
        { base:"HELIANTHUS", condensed:"CONDENSED_HELIANTHUS", label:"Helianthus"}
    ];

    farmItems.forEach(item => {
        const baseProd = products[item.base];
        const condProd = products[item.condensed];

        if(!baseProd || !condProd){
            tbody.innerHTML += `<tr>
                <td><
