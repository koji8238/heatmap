window.onload = function() {
    const marketCapCSVUrl = 'https://koji8238.github.io/heatmap/screener_result.csv'; 
    const industryCSVUrl = 'https://koji8238.github.io/heatmap/data_j.csv'; // 33業種のデータファイルのURL


  // 両方のCSVを取得
  Promise.all([
    fetch(marketCapCSVUrl).then(response => response.text()),
    fetch(industryCSVUrl).then(response => response.text())
  ])
  .then(([marketCapCSVText, industryCSVText]) => {
    // CSVをパースしてオブジェクト配列に変換
    const marketData = parseMarketCSV(marketCapCSVText);
    const industryData = parseIndustryCSV(industryCSVText);

    // 銘柄コードで両データを結合（※industryData側の「コード」列と比較）
    marketData.forEach(item => {
      // industryData内で銘柄コードがmarketData(プライムのみ)と一致するレコードを検索、その配列に業種を追加
      const match = industryData.find(ind => ind['コード'] === item.code);//item.codeはmarketDataをparseMarketCSVで取り出した際に名付けた
      //console.log(match)

      if(match) {
        // 33業種区分の列（例："33業種区分"）を利用
        item.industry = match['33業種区分'];
      } else {
        item.industry = 'その他';
      }
      //console.log(item.industry)
    });

    // 業種ごとにグループ分け//33業種分
    const industryGroups = {}; //業種の空配列を作成
    marketData.forEach(item => {
      if(!industryGroups[item.industry]) {
        industryGroups[item.industry] = []; //もし industryGroups にその業種のキー（例えば "水産・農林業"）がまだなければ、新しく空の配列を作成
      }
      industryGroups[item.industry].push(item); //その後、その業種に属するレコードを全て配列に追加
    });

    // HTML側のグラフ配置用コンテナを取得（ここでは<div id="chartsContainer"></div>）
    const container = document.getElementById('chartsContainer');


    // 各業種ごとに円グラフを作成
    Object.entries(industryGroups).forEach(([industry, companies]) => {
      // 時価総額で降順にソート
      companies.sort((a, b) => b.marketCap - a.marketCap);

      // 各業種ごとにセクションを作成（タイトルとキャンバス要素）
      const section = document.createElement('section');
      section.style.marginBottom = "40px";

      const title = document.createElement('h3');
      title.textContent = industry;
      section.appendChild(title);

      const canvas = document.createElement('canvas');
      // 業種名がIDに使えるように加工（空白や記号を除去）
      canvas.id = `chart_${industry.replace(/\W/g, '')}`;
      section.appendChild(canvas);

      container.appendChild(section);

      // Chart.js用のデータ作成
      const labels = companies.map(c => c.name);
      const marketCaps = companies.map(c => c.marketCap);
      const backgroundColors = companies.map(() => 
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
                  return `${labels[index]}: ¥${marketCaps[index].toLocaleString()}`;
                }
              }
            }
          }
        }
      };


      const ctx = canvas.getContext('2d');
      new Chart(ctx, config);

      console.log("業種「${industry}」のグラフを作成しました")
    });
  })
  .catch(error => console.error('CSVの読み込みエラー:', error));
};






// CSVをパースしてオブジェクトの配列に変換
function parseMarketCSV(csvText) {
    const rows = csvText.trim().split('\n'); // 行ごとに分割
    const headers = rows.shift().split(',').map(h => h.replace(/"/g, '')); // ヘッダーのダブルクォートを削除

    return rows.map(row => {
        // 数字の間のカンマを削除
        row = row.replace(/(\d),(\d)/g, '$1$2');
        
        const values = row.split(',').map(v => v.replace(/"/g, '')); // 各値のダブルクォートを削除
        return {
            code: values[0],    // コード
            name: values[1], // 銘柄名
            marketCap: parseFloat(values[6].replace(/,/g, '')) * 1_000_000 // 時価総額(百万円)のカンマを除去し円単位に変換
        };
    });
}


// CSVをパースしてオブジェクトの配列に変換
function parseIndustryCSV(csvText) {
    const rows = csvText.trim().split('\n'); // 行ごとに分割
    const headers = rows.shift().split(','); // 最初の行をヘッダーとする

    return rows.map(row => {
        const values = row.split(',');
        const obj = {};
        headers.forEach((header, i) => {
            obj[header] = values[i];
        });
        return obj;
    });
}

