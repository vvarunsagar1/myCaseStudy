<?php
  header('Access-Control-Allow-Origin: *');
  include_once 'config.php';

  $page='fetch_enquiries.php';

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

    $del_flg = 'N';
    $checkForEnquiries = "SELECT `enquiry_ip`, `name`, `email_id`, `message`, `visited_date` FROM `enquires` WHERE  `DEL_FLG` = :del_flg";
    $query = $dbc->prepare($checkForEnquiries);
    $query->bindParam(":del_flg", $del_flg);

    $query->execute();
		$result = $query->setFetchMode(PDO::FETCH_ASSOC);
		$result = $query->fetchAll();

    // print_r ($result);
    $jsonResult = json_encode($result);
  }
  message:
  //  echo '{"page":"'.$page.'","status":"'.$message.'"}';
   echo $jsonResult;
?>
