<?php
  $username = 'sayhello@nodio.net';
  $password = ']TSCfMyuYv!2i';
  $admin = 'sayhello@nodio.net';

  if(!isset($_POST)) {
    exit();
  };
  require_once './mail/PHPMailerAutoload.php';

  function checkEmail($email) {
    $error = false;
    if(strlen($email) == 0) {
      $error = true;
      $responce = 'Enter your email!';
    }
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      $error = true;
      $responce = 'Incorrect email!';
    }
    if($error) {
      $json_data = array(
        'error'=> true,
        'error_data'=> $responce,
        'sent'=> false,
        'message' => $responce
      );
      echo json_encode($json_data);
      exit();
    }
    return true;
  };

  function checkMessage($message, $min_length = 15) {
    $error = false;
    if(strlen($message) == 0) {
      $error = true;
      $responce = 'Enter your message!';
    }
    if(strlen($message) <= $min_length) {
      $error = true;
      $responce = 'Message must be longer than '.$min_length.' characters!';
    }
    if($error) {
      $json_data = array(
        'error'=> true,
        'error_data'=> $responce,
        'sent'=> false,
        'message' => $responce
      );
      echo json_encode($json_data);
      exit();
    }
    return true;
  }

  $responce_error = 'Error!';

  $type = $_POST['type'];
  $email = $_POST['email'];
  $msg = $_POST['message'];
  checkEmail($email);

  switch($type) {
    case 'subscribe':
      $subject = 'New subscriber in Nodio!';
      $message = 'New subscriber in Nodio!<br>E-mail: '.$email;
      $responce = 'Subscribed!';
      break;
    case 'message':
      checkMessage($msg);
      $subject = 'Nodio: message from '.$email;
      $message = $subject.'<br>Message: '.$msg;
      $responce = 'Message sent';
      break;
    default:
      exit();
  }

  $mail = new PHPMailer;

  $mail->SMTPDebug = 3;                                 // Enable verbose debug output

  $mail->isSMTP();                                      // Set mailer to use SMTP
  $mail->Host = 'mail.privateemail.com';                       // Specify main and backup SMTP servers
  $mail->SMTPAuth = true;                               // Enable SMTP authentication
  $mail->Username = $username;                          // SMTP username
  $mail->Password = $password;                          // SMTP password
  $mail->SMTPSecure = 'ssl';                            // Enable SSL encryption, `tsl` also accepted
  $mail->Port = 465;                                    // TCP port to connect to

  $mail->setFrom($admin);
  $mail->addAddress($admin);                            // Add a recipient
  $mail->addReplyTo($email);

  $mail->isHTML(true);                                  // Set email format to HTML

  $mail->Subject = $subject;
  $mail->Body    = $message;
  $mail->AltBody = $message;

  if(!$mail->send()) {
    $json_data = array(
      'error'=> true,
      'error_data'=> $mail->ErrorInfo,
      'sent'=> false,
      'message' => $responce_error
    );
    echo json_encode($json_data);
  }
  else {
    $json_data = array(
      'error'=> false,
      'error_data'=> false,
      'sent'=> true,
      'message' => $responce
    );
    echo json_encode($json_data);
  }
?>