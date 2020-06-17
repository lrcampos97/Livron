<?php
header('Access-Control-Allow-Headers: "Origin, X-Requested-With, Content-Type, Accept"');
header("Access-Control-Allow-Origin: *", false);
header("Access-Control-Allow-Origin: *");

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\StreamInterface;

require '../vendor/autoload.php';

// Get Generos
$app->get('/generos', function(Request $request, Response $response){
    $sql = "SELECT * FROM LIVRO_GENERO";

    try{
        // Get DB Object
        $db = new db();        
        $db = $db->connect();

        $stmt = $db->query($sql);
        $usuarioLivros = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        return json_encode($usuarioLivros);
    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }
});

// Consultar genero
$app->get('/generos/{id}', function(Request $request, Response $response){
    $id = $request->getAttribute('id');
    
    $sql = "SELECT * FROM LIVRO_GENERO where LIVRO_GENERO_ID = $id";
    
    try{
        // Get DB Object
        $db = new db();
        $db = $db->connect();

        $stmt = $db->query($sql);
        $usuarioLivros = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($usuarioLivros);

    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }
});