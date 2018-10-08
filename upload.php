<?php

function decodeChunk($data)
{
    $data = explode(';base64,', $data);

    if (!is_array($data) || !isset($data[1])) {
        return false;
    }

    $data = base64_decode($data[1]);
    if (!$data) {
        return false;
    }

    return $data;
}


/* request ajax check  */
if (
    isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
    !empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
    strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'
) {
    if ($_POST['action'] === 'upload') {

        $file_path = __DIR__ . '/uploads/' . $_POST['file'];
        $file_data = decodeChunk($_POST['file_data']);

        if ($file_data === false) {
            $response = [
                'error' => true,
                'message' => 'some error'
            ];
        }

        file_put_contents($file_path, $file_data, FILE_APPEND);

        $response = [
            'error' => false,
            'message' => 'success'
        ];

        echo json_encode($response);

    }
}