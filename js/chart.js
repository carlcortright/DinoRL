google.charts.load('current', {'packages':['corechart']});

var data = null;
var chart = null;
google.charts.setOnLoadCallback(function () {
    data = new google.visualization.DataTable();
    data.addColumn('number', 'Trial');
    data.addColumn('number', 'Successful Jumps');
    data.addRows([[0, 0]]);
    chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    var options = {
          title: 'Successful Jumps',
          curveType: 'function',
          legend: { position: 'bottom' }
        };
    chart.draw(data, options)
  });

function updateChart(row){
  data.addRows([row]);
  chart.draw(data);
}
