import { TimeScale } from "./timeScale_bkp.js";

const timeScale = new TimeScale();
const fetch = await timeScale.fetch();
let data = [];
for (let f of fetch) {
    data = [...data,
        {
            Date: new Date(f.dt ?? f.bucket).getTime(),
            Open: f.open,
            High: f.high,
            Low: f.low, 
            Close: f.close,
            Volume: f.volume
        }
    ]
}

// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element
var root = am5.Root.new("chartdiv");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
    am5themes_Animated.new(root)
]);

// Create a stock chart
// https://www.amcharts.com/docs/v5/charts/stock-chart/#Instantiating_the_chart
var stockChart = root.container.children.push(am5stock.StockChart.new(root, {
    paddingLeft: 22
}));

// Set global number format
// https://www.amcharts.com/docs/v5/concepts/formatters/formatting-numbers/
root.numberFormatter.set("numberFormat", "#.###,00");

//
//  Main (value) panel
//

// Create a main stock panel (chart)
// https://www.amcharts.com/docs/v5/charts/stock-chart/#Adding_panels
var mainPanel = stockChart.panels.push(am5stock.StockPanel.new(root, {
    wheelY: "zoomX",
    panX: true,
    panY: true,
    height: am5.percent(70)
}));

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
var valueAxis = mainPanel.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {
        pan: "zoom"
    }),
    tooltip: am5.Tooltip.new(root, {
        animationDuration: 200
    }),
    numberFormat: "#,###.00",
    extraTooltipPrecision: 2
}));

var dateAxis = mainPanel.xAxes.push(am5xy.GaplessDateAxis.new(root, {
    baseInterval: {
        timeUnit: "day",
        count: 1
    },
    renderer: am5xy.AxisRendererX.new(root, {}),
    tooltip: am5.Tooltip.new(root, {
        animationDuration: 200
    })
}));

// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
var valueSeries = mainPanel.series.push(am5xy.LineSeries.new(root, {
    name: "STCK",
    valueXField: "Date",
    valueYField: "Close",
    xAxis: dateAxis,
    yAxis: valueAxis,
    legendValueText: "{valueY}"
}));

valueSeries.data.setAll(data);

// Set main value series
// https://www.amcharts.com/docs/v5/charts/stock-chart/#Setting_main_series
stockChart.set("stockSeries", valueSeries);

// Add a stock legend
// https://www.amcharts.com/docs/v5/charts/stock-chart/stock-legend/
var valueLegend = mainPanel.topPlotContainer.children.push(am5stock.StockLegend.new(root, {
    stockChart: stockChart
}));
valueLegend.data.setAll([valueSeries]);

/**
 * Secondary (volume) panel
 */

// Create a main stock panel (chart)
// https://www.amcharts.com/docs/v5/charts/stock-chart/#Adding_panels
var volumePanel = stockChart.panels.push(am5stock.StockPanel.new(root, {
    wheelY: "zoomX",
    panX: true,
    panY: true,
    height: am5.percent(30)
}));

// Create axes
// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
var volumeValueAxis = volumePanel.yAxes.push(am5xy.ValueAxis.new(root, {
    numberFormat: "#.#a",
    renderer: am5xy.AxisRendererY.new(root, {
        pan: "zoom"
    })
}));

var volumeAxisRenderer = am5xy.AxisRendererX.new(root, {});
var volumeDateAxis = volumePanel.xAxes.push(am5xy.GaplessDateAxis.new(root, {
    baseInterval: {
        timeUnit: "day",
        count: 1
    },
    renderer: volumeAxisRenderer,
    tooltip: am5.Tooltip.new(root, {
        forceHidden: true,
        animationDuration: 200
    })
}));

// hide labels
// volumeAxisRenderer.labels.template.set("forceHidden", true);

// Add series
// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
var volumeSeries = volumePanel.series.push(am5xy.ColumnSeries.new(root, {
    name: "STCK",
    valueXField: "Date",
    valueYField: "Volume",
    xAxis: volumeDateAxis,
    yAxis: volumeValueAxis,
    legendValueText: "{valueY.formatNumber('#,###')}"
}));

volumeSeries.data.setAll(data);

// Set main value series
// https://www.amcharts.com/docs/v5/charts/stock-chart/#Setting_main_series
stockChart.set("volumeSeries", volumeSeries);


// Add a stock legend
// https://www.amcharts.com/docs/v5/charts/stock-chart/stock-legend/
var volumeLegend = volumePanel.topPlotContainer.children.push(am5stock.StockLegend.new(root, {
    stockChart: stockChart
}));
volumeLegend.data.setAll([volumeSeries]);


// Add cursor(s)
// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
mainPanel.set("cursor", am5xy.XYCursor.new(root, {
    yAxis: valueAxis,
    xAxis: dateAxis,
    snapToSeries: [valueSeries],
    snapToSeriesBy: "y!"
}));

var volumeCursor = volumePanel.set("cursor", am5xy.XYCursor.new(root, {
    yAxis: volumeValueAxis,
    xAxis: volumeDateAxis,
    snapToSeries: [volumeSeries],
    snapToSeriesBy: "y!"
}));

// hide y line on volume panel
volumeCursor.lineY.set("forceHidden", true);


// Add scrollbar
// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
var scrollbar = mainPanel.set("scrollbarX", am5xy.XYChartScrollbar.new(root, {
    orientation: "horizontal",
    height: 50
}));
stockChart.toolsContainer.children.push(scrollbar);

var sbDateAxis = scrollbar.chart.xAxes.push(am5xy.GaplessDateAxis.new(root, {
    baseInterval: {
        timeUnit: "day",
        count: 1
    },
    renderer: am5xy.AxisRendererX.new(root, {})
}));

var sbValueAxis = scrollbar.chart.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {})
}));

var sbSeries = scrollbar.chart.series.push(am5xy.LineSeries.new(root, {
    valueYField: "Close",
    valueXField: "Date",
    xAxis: sbDateAxis,
    yAxis: sbValueAxis
}));

sbSeries.fills.template.setAll({
    visible: true,
    fillOpacity: 0.3
});

sbSeries.data.setAll(data);
