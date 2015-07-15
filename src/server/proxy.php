<?php
function parseHeaders( $headers )
{
    $head = array();
    foreach( $headers as $k=>$v )
    {
        $t = explode( ':', $v, 2 );
        if( isset( $t[1] ) )
            $head[ trim($t[0]) ] = trim( $t[1] );
        else
        {
            $head[] = $v;
            if( preg_match( "#HTTP/[0-9\.]+\s+([0-9]+)#",$v, $out ) )
                $head['response_code'] = intval($out[1]);
        }
    }
    return $head;
}
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

if(!isset($_GET["url"])){
    http_response_code(400);
    die('{"message": "No url provided"}');
}
$url = $_GET["url"];
$output = @file_get_contents($url);



if($output === false) {
    // we must process the result to get the status code
    $headers = parseHeaders($http_response_header);
    $responseCode = isset($headers['response_code']) ? $headers['response_code'] : 500;
    $msg = $responseCode == 404 ? 'Resource not found' : 'An error has occurred';
    http_response_code($responseCode);
    die('{ "message": "'.$msg.'" }');
}

echo $output;

