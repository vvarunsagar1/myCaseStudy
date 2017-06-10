<?php
  header('Access-Control-Allow-Origin: *');
  include_once 'config.php';

  $page='monitor_visitors.php';

  if($_GET['ip']) {
    try {
      $dbc = new PDO("mysql:host=$server;dbname=$db", $config['username'], $config['password']);
      // set the PDO error mode to exception
      $dbc->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      $message = 'DB Connected Successfully';
      } catch(PDOException $e) {
      $message = 'Connection Error';
      goto message;
    }
    $row_count = '';

    $ip = $_GET['ip'];
    $date = date('Y-m-d');
    $del_flg = 'N';
    $checkForRecord = "SELECT `visitor_id`,`visitor_ip`, `views`, `visited_date`, `DEL_FLG` FROM `visitors` WHERE `visitor_ip` = :ip AND `visited_date` =:dt AND `DEL_FLG` = :del_flg";
    $query = $dbc->prepare($checkForRecord);
    $query->bindParam(":ip", $ip);
    $query->bindParam(":dt", $date);
    $query->bindParam(":del_flg", $del_flg);

    $query->execute();
		$result = $query->setFetchMode(PDO::FETCH_ASSOC);
		$result = $query->fetchAll();

      // print_r ($result);
      foreach($result as $row) {
				$row_count 			= "Y";
				$vis_id   			= $row['visitor_id'];
        $views          = $row['views'];
        $newViewCount   = $views + 1;
			}

      if ( $row_count == 'Y') {
          $updateExistingRecord = "UPDATE `visitors` SET `views`=:newViews WHERE `visitor_id`= :id AND `DEL_FLG` = :del_flg";
          $query = $dbc->prepare($updateExistingRecord);
          $query->bindParam(":id", $vis_id);
          $query->bindParam(":newViews", $newViewCount);
          $query->bindParam(":del_flg", $del_flg);
  				if ($query->execute()) {
  				    $message = 'Record Updated Successfully';
  				  }	else	{
    				  $message = 'SQL Error';
              goto message;
  				}
        } else {
          // Insert New Visitor Record
          $views = '1';
          $insertNewRecord = "INSERT INTO `visitors`(`visitor_ip`, `views`, `visited_date`, `DEL_FLG`) VALUES (:ip,:views,NOW(3),:del_flg)";
          $query = $dbc->prepare($insertNewRecord);
          $query->bindParam(":ip", $ip);
          $query->bindParam(":views", $views);
          $query->bindParam("del_flg", $del_flg);
          if ($query->execute()) {
            $message = 'New Record Inserted Successfully';
            $last_id = $dbc->lastInsertId();
          } else {
            $message = 'SQL Error';
          }
      }
  }
  message:
   echo '{"page":"'.$page.'","status":"'.$message.'"}';
?>
