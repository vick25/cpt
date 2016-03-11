<?php 
	$projectId = $_POST['projectId'];
	$projectName = $_POST['projectName'];
	$projectDescription = $_POST['projectDescription'];
	$longitude = $_POST['longitude'];
	$lattitude = $_POST['lattitude'];
?>


<!DOCTYPE html>
<html lang='en'>
	<head>
	</head>
	<body>
		<h2>form data</h2>
		<?php 
			echo "project ID is: ".$projectId." and name is: ".$projectName."<br/><br/>";
			echo "The description of the project is: ".$projectDescription."<br/><br/>";
			echo $longitude.", ".$lattitude
		?>
	</body>
</html>