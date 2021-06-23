<?php
    header('Content-type: application/json');

    $dir = "./projects/";

    $info_list = array();

    $folders = array();

    $scan = scandir($dir);

    foreach ($scan as $result) {
        if (is_dir($dir . $result) && !in_array($result, [".", ".."])) {
            $folders[] = $result . "/";
        }
    }

    foreach ($folders as $folder) {
        $info_file = glob($dir . $folder . "*.json")[0];
        $json = json_decode(file_get_contents($info_file), true);
        $info_list[] = $json;
    }

    $output = json_encode($info_list);

    echo $output;
?>