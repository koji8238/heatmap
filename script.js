window.onload = function() {
    const data = [
        { name: 'ソニーグループ', marketCap: 211553 },
        { name: '任天堂', marketCap: 132855 },
        { name: '日立製作所', marketCap: 182959 },
        { name: 'キーエンス', marketCap: 163557 },
        { name: 'ソフトバンクグループ', marketCap: 138341 },
        { name: 'トヨタ自動車', marketCap:  469663 },
        { name: '三菱UFJフィナンシャル・グループ', marketCap: 238759 },
        { name: 'リクルートホールディングス', marketCap: 180327 },
        { name: '三井住友フィナンシャルグループ', marketCap: 151800 },
        { name: 'ファーストリテイリング', marketCap: 162388 },
    ];

    // 時価総額で降順にソート
    data.sort((a, b) => b.marketCap - a.marketCap);

    // Chart.jsのデータ形式に変換
    const labels = data.map(d => d.name);
    const marketCaps = data.map(d => d.marketCap);
    const backgroundColors = data.map(() => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`);

    const config = {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: marketCaps,
                backgroundColor: backgroundColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const index = tooltipItem.dataIndex;
                            const name = data[index].name;
                            const marketCap = data[index].marketCap;
                            return `${name}: ¥${marketCap.toLocaleString()}`;
                        }
                    }
                }
            }
        }
    };

    // グラフの描画
    const ctx = document.getElementById('marketCapChart').getContext('2d');
    new Chart(ctx, config);
};
