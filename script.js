const data = [
    { name: '日本オラクル', marketCap: 1852641 },
    { name: '日本マクドナルドホールディングス', marketCap: 805738 },
    { name: '東映アニメーション', marketCap: 718200 },
    { name: 'キーエンス', marketCap: 11455000 },
    { name: 'ソフトバンクグループ', marketCap: 16243000 },
    { name: 'トヨタ自動車', marketCap: 26631500 },
    { name: '三菱UFJフィナンシャル・グループ', marketCap: 6500340 },
    { name: 'リクルートホールディングス', marketCap: 8396438 },
    { name: '東京エレクトロン', marketCap: 8342280 },
    { name: 'ファーストリテイリング', marketCap: 7614111 },
];

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
