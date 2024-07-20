<?php
//AUTHORIZATION_KEY
$AUTHORIZATION_KEY = 'c984536d-c5e6-4083-a08d-4947d9a8cfd11';
//AUTHORIZATION_KEY

$url = 'https://api.fx.ninja/api/v1/lead';
$data = [];
foreach ($_POST as $key=>$el) {
    if($key == 'uuid') {
        continue;
    }
    if($el) {
        $data[$key] = htmlspecialchars(trim($el));
    }
}
$data['http_referer']= $_SERVER['HTTP_REFERER'];
$data['ip']= $_SERVER['REMOTE_ADDR'];
$data['host'] = $_SERVER['HTTP_HOST'];
$data['phone'] = $_POST['phoneCode'] . $_POST['phone'];
//print_r(json_encode($data));
$myCurl = curl_init();
curl_setopt_array($myCurl, array(
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($data),
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'accept: application/json', "Authorization: $AUTHORIZATION_KEY"]
));
$response = curl_exec($myCurl);
print_r($response);
curl_close($myCurl);