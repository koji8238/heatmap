// データの定義（例として上位3社のみ記載）
const data = [
    { name: '日本オラクル', marketCap: 1852641 },
    { name: '日本マクドナルドホールディングス', marketCap: 805738 },
    { name: '東映アニメーション', marketCap: 718200 },
    // 他の銘柄データを追加
];

// SVG要素の作成
const width = document.getElementById('chart').clientWidth;
const height = document.getElementById('chart').clientHeight;

const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// D3のpack()レイアウトを使用してカルトグラムを作成
const pack = d3.pack()
    .size([width, height])
    .padding(10);

// データを階層構造に変換
const root = d3.hierarchy({ children: data })
    .sum(d => d.marketCap);

// pack()レイアウトを適用
const nodes = pack(root).leaves();

// 円を描画
const circles = svg.selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => d.r)
    .attr("fill", "steelblue")
    .attr("opacity", 0.7)
    .attr("stroke", "white")
    .attr("stroke-width", 2);

// テキストを追加（企業名）
const labels = svg.selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("dy", "0.3em")
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", d => Math.max(d.r / 5, 12) + "px")
    .text(d => d.data.name);
