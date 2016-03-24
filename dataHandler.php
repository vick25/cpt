<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='utf-8'>
    <link rel="shortcut icon" href="http://localhost:82/cpt/img/favicon.png">
    <title>data handler</title>
</head>   
<body>



</body>
</html>
<?php

    
    ini_set('display_errors', '1');
    error_reporting(E_ALL | E_STRICT);

    $db = pg_connect("host=localhost port=5432 dbname=projects user=postgres password=admin");

    if (!$db) {
        echo "NOT CONNECTED!";
    }else{echo "<h1>Your data has been submitted to the database!</h1>";}
 
       
         $projectId = pg_escape_string($_POST['project_id']);
         $project_location = pg_escape_string($_POST['location']);
         $project_description = pg_escape_string($_POST['project_description']);
         $financial_year = pg_escape_string($_POST['financial_year']);
         $sector = pg_escape_string($_POST['sector']);
         $estimated_cost = pg_escape_string($_POST['estimated_cost']);
         $funding = pg_escape_string($_POST['funding']);
         $status = pg_escape_string($_POST['status']);
         $lon = pg_escape_string($_POST['lon']);
         $lat = pg_escape_string($_POST['lat']);
        
      
        

        $query = "INSERT INTO cnty_projects(\"Project id\",\"Location\",\"Description\",\"Financial Year\",\"Department\",\"Estimated Cost\",\"Funding\",\"Status\") 
            
        VALUES('" . $projectId . "','" . $project_location . "','" . $project_description . "','" .  $financial_year . "',
        '" . $sector . "','" . $estimated_cost . "','" . $funding . "', '" . $status . "') ";


        $query2 = "INSERT INTO project_coords(\"Project id\",longitude,latittude) 
            
        VALUES('" . $projectId . "','" . $lon . "','" . $lat . "') ";

        $result = pg_query($query);
        $result2 = pg_query($query2);

        if ($result && $result2) {
            pg_query("UPDATE project_coords SET geom = ST_GeomFromText('POINT('||longitude||' '||latittude||')',4326)");
        }
        elseif (!$result && !$result2) {
            $errormessage = pg_last_error();
            echo "Error with query: " . $errormessage;
            exit();
        }

       /* $query3 = $dbh->prepare("SELECT * FROM cnty_projects WHERE \"Status\" ='Ongoing' ");
        $query3->execute();
        $count =$query3->rowCount();
        echo $count;*/
        
        pg_close();

?>

