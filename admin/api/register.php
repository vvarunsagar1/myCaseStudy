<?php
  header('Access-Control-Allow-Origin: *');
  include_once 'config.php';

  $page='register.php';

  if($_GET['ip'] && $_GET['name'] && $_GET['email'] && $_GET['password'] && $_GET['mobile']) {
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
    $email = $_GET['email'];
    $password = $_GET['password'];
    $mobile = $_GET['mobile'];
    $name = $_GET['name'];
    $user_type = 'U';
    $e_verify = 'N';
    $del_flg = 'N';

    $insertNewRecord = "INSERT INTO `users`(`email_id`, `mobile`, `name`, `password`, `user_type`, `e_verify`, `CRTD_DT`, `CRTD_IP`, `DEL_FLG`) VALUES (:email,:mobile,:name,:password,:user_type,:e_verify,NOW(3),:ip,:del_flg)";
    $query = $dbc->prepare($insertNewRecord);
    $query->bindParam(":email", $email);
    $query->bindParam(":mobile", $mobile);
    $query->bindParam(":name", $name);
    $query->bindParam(":password", $password);
    $query->bindParam(":user_type", $user_type);
    $query->bindParam(":e_verify", $e_verify);
    $query->bindParam(":ip", $ip);
    $query->bindParam("del_flg", $del_flg);
    if ($query->execute()) {
      $status = 'RS';
      $message = 'New Record Inserted Successfully';
      $last_id = $dbc->lastInsertId();
    } else {
      $message = 'SQL Error';
    }
  }
  message:
   echo '{"page":"'.$page.'","status":"'.$status.'","message":"'.$message.'"}';
?>
