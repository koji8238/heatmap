window.onload = function() {
    const csvUrl = 'https://koji8238.github.io/heatmap/screener_result.csv'; 

    fetch(csvUrl)
        .then(response => response.text()) // CSVをテキストとして取得
        .then(csvText => {
            const data = parseCSV(csvText); // CSVをオブジェクトの配列に変換

            // 時価総額で降順にソート
            data.sort((a, b) => b.marketCap - a.marketCap);

            // Chart.jsのデータ形式に変換
            const labels = data.map(d => d.name);
            const marketCaps = data.map(d => d.marketCap);
            const backgroundColors = data.map(() => 
                `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`
            );

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
                        legend: { position: 'top' },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    const index = tooltipItem.dataIndex;
                                    return `${data[index].name}: ¥${data[index].marketCap.toLocaleString()}`;
                                }
                            }
                        }
                    }
                }
            };

            // グラフの描画
            const ctx = document.getElementById('marketCapChart').getContext('2d');
            new Chart(ctx, config);
        })
        .catch(error => console.error('CSVの読み込みエラー:', error));
    
};



// CSVをパースしてオブジェクトの配列に変換
function parseCSV(csvText) {
    const rows = csvText.trim().split('\n'); // 行ごとに分割
    const headers = rows.shift().split(',').map(h => h.replace(/"/g, '')); // ヘッダーのダブルクォートを削除

    return rows.map(row => {
        // 数字の間のカンマを削除
        row = row.replace(/(\d),(\d)/g, '$1$2');
        
        const values = row.split(',').map(v => v.replace(/"/g, '')); // 各値のダブルクォートを削除
        return {
            name: values[1], // 銘柄名
            marketCap: parseFloat(values[6].replace(/,/g, '')) * 1_000_000 // 時価総額(百万円)のカンマを除去し円単位に変換
        };
    });
}

