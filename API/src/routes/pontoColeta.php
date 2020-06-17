<?php
header('Access-Control-Allow-Headers: "Origin, X-Requested-With, Content-Type, Accept"');
header("Access-Control-Allow-Origin: *", false);
header("Access-Control-Allow-Origin: *");

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\StreamInterface;

require '../vendor/autoload.php';


// Get All Emprestimos
$app->get('/pontoColeta', function(Request $request, Response $response){
    $sql = "SELECT * FROM PONTOS_COLETAS";

    try{
        // Get DB Object
        $db = new db();        
        $db = $db->connect();

        $stmt = $db->query($sql);
        $pontoColeta = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        return json_encode($pontoColeta);
    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }
});

// Consultar ponto de coleta  
$app->get('/pontoColeta/{id}', function(Request $request, Response $response){
    $id = $request->getAttribute('id');
    
    $sql = "SELECT * FROM PONTOS_COLETAS WHERE PONTO_COLETA_ID = $id";
    
    try{
        // Get DB Object
        $db = new db();
        $db = $db->connect();

        $stmt = $db->query($sql);
        $pontoColeta = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($pontoColeta);

    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }
});

// Adicionar PONTO DE COLETA
$app->post('/pontoColeta', function(Request $request, Response $response){
    $body = $request->getBody();

    $data = json_decode($body, true); // parse the JSON into an assoc. array

    $razaoSocial = $data['RAZAO_SOCIAL'];  
    $usuarioId = $data['USUARIO_ID'];  
    $classificacao = $data['CLASSIFICACAO'];  
    $endereco = $data['ENDERECO'];  

    try{
        $sql = "INSERT INTO PONTOS_COLETAS (RAZAO_SOCIAL, USUARIO_ID,CLASSIFICACAO, ENDERECO)	
                 VALUES (:RAZAO_SOCIAL, :USUARIO_ID, :CLASSIFICACAO, :ENDERECO);";
        $db = new db();        
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->bindValue('RAZAO_SOCIAL', $razaoSocial);
        $stmt->bindValue('USUARIO_ID', $usuarioId);
        $stmt->bindValue('CLASSIFICACAO', $classificacao);
        $stmt->bindValue('ENDERECO', $endereco);                 
        $stmt->execute();

        $lastId= $db->lastInsertId();
        
        $db = null;

        return json_encode($lastId);
        
    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }    

});

// Atualizar ponto de coleta
$app->put("/pontoColeta/{id}", function ($request, $response, array $args) {
    $body = $request->getBody();
    $pontoColetaId = $request->getAttribute('id');

    $data = json_decode($body, true); // parse the JSON into an assoc. array

    $razaoSocial = $data['RAZAO_SOCIAL'];  
    $usuarioId = $data['USUARIO_ID'];  
    $classificacao = $data['CLASSIFICACAO'];  
    $endereco = $data['ENDERECO'];  


    try{
        
        $sql = "UPDATE PONTOS_COLETAS SET	
                    RAZAO_SOCIAL = :RAZAO_SOCIAL,
                    USUARIO_ID = :USUARIO_ID,
                    CLASSIFICACAO = :CLASSIFICACAO,
                    ENDERECO = :ENDERECO
                WHERE PONTO_COLETA_ID =  :PONTO_COLETA_ID;";

        $db = new db();        
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->bindValue('RAZAO_SOCIAL', $razaoSocial);     
        $stmt->bindValue('USUARIO_ID', $usuarioId);
        $stmt->bindValue('CLASSIFICACAO', $classificacao);
        $stmt->bindValue('ENDERECO', $endereco);  
        $stmt->bindValue('PONTO_COLETA_ID', $pontoColetaId);
        $stmt->execute();
    
        $db = null;

        return json_encode("status: OK");
        
    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }    
});

// Deletar ponto de coleta
$app->delete("/pontoColeta/{id}", function ($request, $response, array $args) {    
    $pontoColeta = $request->getAttribute('id');

    try{
        // Get DB Object
        $sql = "DELETE FROM PONTOS_COLETAS WHERE PONTO_COLETA_ID = :PONTO_COLETA_ID;";

        $db = new db();        
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->bindValue('PONTO_COLETA_ID', $pontoColeta);     
        $stmt->execute();
    
        $db = null;

        return json_encode("status: OK");
        
    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }    
});