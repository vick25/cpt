<!DOCTYPE HTML>
<html>
<head>
<script type="text/javascript">
window.onload = function () {
	var chart = new CanvasJS.Chart("chartContainer",
	{
		title:{
			text: "Gaming Consoles Sold in 2012"
		},
		legend: {
			maxWidth: 350,
			itemWidth: 120
		},
		data: [
		{
			type: "pie",
			showInLegend: true,
			legendText: "{indexLabel}",
			dataPoints: [
				{ y: 4181563, indexLabel: "PlayStation 3" },
				{ y: 2175498, indexLabel: "Wii" },
				{ y: 3125844, indexLabel: "Xbox 360" },
				{ y: 1176121, indexLabel: "Nintendo DS"},
				{ y: 1727161, indexLabel: "PSP" },
				{ y: 4303364, indexLabel: "Nintendo 3DS"},
				{ y: 1717786, indexLabel: "PS Vita"}
			]
		}
		]
	});
	chart.render();
}
</script>
<script type="text/javascript" src="http://localhost:82/cpt/src/canvasjs/canvasjs.min.js" ></script>
</head>
<body>

<div id="chartContainer" style="height: 300px; width: 100%;"></div>
</body>
</html>
<?php
	$db = pg_connect("host=localhost port=5432 dbname=projects user=postgres password=admin");

	if ($db) {
		$query = $dbh->prepare("SELECT * FROM cnty_projects WHERE \"Status\" ='Ongoing' ");
        $query->execute();
        $count =$query->rowCount();
        echo $count;
	}else{
		echo "Not connected to database"
	}
 		
?>