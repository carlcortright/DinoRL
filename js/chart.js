google.charts.load('current', {'packages':['corechart']});

var data = null;
var chart = null;
google.charts.setOnLoadCallback(function () {
    data = new google.visualization.DataTable();
    data.addColumn('number', 'Trial');
    data.addColumn('number', 'Average Successful Jumps per Play');
    data.addRows([[0, 0]]);
    chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    chart.draw(data)
  });

function updateChart(row){
  data.addRows([row]);
  chart.draw(data);
}
