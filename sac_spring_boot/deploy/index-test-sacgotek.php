<?php
$backend_url = 'http://127.0.0.1:8085';

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $backend_url . $uri);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
curl_setopt($ch, CURLOPT_HEADER, true);

if ($method === 'POST' || $method === 'PUT' || $method === 'PATCH') {
    $body = file_get_contents('php://input');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}

$headers = [];
foreach (getallheaders() as $name => $value) {
    if (strcasecmp($name, 'Host') !== 0) {
        $headers[] = "$name: $value";
    }
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($ch);
if ($response === false) {
    $err_msg = curl_error($ch);
    $err_code = curl_errno($ch);
    header("HTTP/1.1 502 Bad Gateway");
    echo "Bad Gateway: Failed to connect to Spring Boot backend.<br>";
    echo "cURL Error ($err_code): $err_msg";
    exit;
}

$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$resp_headers = substr($response, 0, $header_size);
$resp_body = substr($response, $header_size);
curl_close($ch);

foreach (explode("\r\n", $resp_headers) as $hdr) {
    if (!empty($hdr) && stripos($hdr, 'Transfer-Encoding:') === false) {
        header($hdr);
    }
}

echo $resp_body;
