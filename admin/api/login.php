<?php
  header('Access-Control-Allow-Origin: *');
  include_once 'config.php';

  $page='login.php';

  if($_GET['ip'] && $_GET['email'] && $_GET['password']) {
    try {
      $dbc = new PDO("mysql:host=$server;dbname=$db", $config['username'], $config['password']);
      // set the PDO error mode to exception
      $dbc->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      $message = 'DB Connected Successfully';
      } catch(PDOException $e) {
      $message = 'Connection Error';
      echo '{"page":"'.$page.'","status":"'.$message.'"}';
    }
    $row_count = '';

    $ip = $_GET['ip'];
    $email = $_GET['email'];
    $password = $_GET['password'];
    $del_flg = 'N';
    $checkForRecord = "SELECT `login_id`, `google_login_id`, `email_id`, `mobile`, `name`, `password`, `img_url`, `user_type`, `e_verify`, `CRTD_DT`, `CRTD_IP`, `DEL_FLG` FROM `users` WHERE `email_id`= :email AND `password` = :password AND `DEL_FLG` = :del_flg";
    $query = $dbc->prepare($checkForRecord);
    $query->bindParam(":email", $email);
    $query->bindParam(":password", $password);
    $query->bindParam(":del_flg", $del_flg);

    $query->execute();
		$result = $query->setFetchMode(PDO::FETCH_ASSOC);
		$result = $query->fetchAll();

      // print_r ($result);
      foreach($result as $row) {
				$row_count 			= "Y";
			}

      if ( $row_count == 'Y') {
          $resultJson = json_encode($result);
          // echo '{"page":"'.$page.'","status":"LS", "data": "'.$resultJson.'"}';
          echo $resultJson;
        } else {
          $message = 'IC';
          echo '{"page":"'.$page.'","status":"'.$message.'"}';
      }
  }
?>
