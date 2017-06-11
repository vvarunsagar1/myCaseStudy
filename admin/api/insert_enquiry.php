<?php
  header('Access-Control-Allow-Origin: *');
  include_once 'config.php';

  $page='insert_visitors.php';

  if($_GET['ip'] && $_GET['name'] && $_GET['message'] && $_GET['email']) {
    try {
      $dbc = new PDO("mysql:host=$server;dbname=$db", $config['username'], $config['password']);
      // set the PDO error mode to exception
      $dbc->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      $message = 'DB Connected Successfully';
      } catch(PDOException $e) {
      $message = 'Connection Error';
      goto message;
    }
    $ip = $_GET['ip'];
    $name = $_GET['name'];
    $email = $_GET['email'];
    $message = $_GET['message'];
    $del_flg = 'N';

    $insertNewEnquiry = "INSERT INTO `enquires`(`enquiry_ip`, `name`, `email_id`, `message`, `visited_date`, `DEL_FLG`) VALUES (:ip,:name,:email,:message,NOW(3),:del_flg)";

    $query = $dbc->prepare($insertNewEnquiry);
    $query->bindParam(":ip", $ip);
    $query->bindParam(":name", $name);
    $query->bindParam(":email", $email);
    $query->bindParam(":message", $message);
    $query->bindParam(":del_flg", $del_flg);

    if ($query->execute()) {
      $status = 'S';
      $last_id = $dbc->lastInsertId();

      // Send mail
        $email_subject = "Your Enquiry - Reg";
				$email_body = "<html><body>";
				$email_body .= "Dear ".$name.",<br> We received your message, Thank you for contacting us. We will reach you soon regarding your query.<br><br><strong>Thanks and Regards</strong><br>ABC Private Limited";
				$email_body .='</body></html>';
				$headers = $config["from_email"]. "\r\n";
				$headers .= "MIME-Version: 1.0\r\n";
				$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

        $email_admin_body .= "Dear Sir,<br> We received a message from <strong>Mr.".$name."</strong>, The customer query is <strong>".$message."</strong>";

				mail($email,$email_subject,$email_body,$headers);
                                mail($config['to_email'], $email_subject, $email_admin_body, $headers);

    } else {
      $status = 'N';
    }
  }
  message:
   echo '{"page":"'.$page.'","status":"'.$status.'"}';
?>
