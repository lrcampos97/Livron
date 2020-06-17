<?php
header('Access-Control-Allow-Headers: "Origin, X-Requested-With, Content-Type, Accept"');
header("Access-Control-Allow-Origin: *", false);
header("Access-Control-Allow-Origin: *");

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\StreamInterface;

require '../vendor/autoload.php';

// Get All usuarioLivros
$app->get('/usuarioLivros', function(Request $request, Response $response){
    $sql = "SELECT * FROM USUARIO_LIVROS";

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

// Consultar livros com o usuário 
$app->get('/usuarioLivros/GetLivrosByUser/{id}', function(Request $request, Response $response){
    $id = $request->getAttribute('id');
    
    $sql = "SELECT * FROM USUARIO_LIVROS where USUARIO_ID = $id";
    
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

// Consultar livros de acordo com o livro_id 
$app->get('/usuarioLivros/GetLivrosByLivro/{id}', function(Request $request, Response $response){
    $id = $request->getAttribute('id');
    
    $sql = "SELECT * FROM USUARIO_LIVROS where LIVRO_ID = $id";
    
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

// Adicionar vinculo
$app->post('/usuarioLivros', function(Request $request, Response $response){
    $body = $request->getBody();

    $data = json_decode($body, true); // parse the JSON into an assoc. array

    $usuarioId = $data['USUARIO_ID'];  
    $livroId = $data['LIVRO_ID'];  
    $statusLeitura = $data['STATUS_LEITURA'];      

    try{
        $sql =  "INSERT INTO USUARIO_LIVROS (USUARIO_ID, LIVRO_ID, STATUS_LEITURA)	
                 VALUES (:USUARIO_ID, :LIVRO_ID, :STATUS_LEITURA);";
        $db = new db();        
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->bindValue('USUARIO_ID', $usuarioId);
        $stmt->bindValue('LIVRO_ID', $livroId);
        $stmt->bindValue('STATUS_LEITURA', $statusLeitura);
        $stmt->execute();

        $lastId= $db->lastInsertId();
        
        $db = null;

        return json_encode($lastId);
        
    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }    

});


// Atualizar status leitura
$app->put("/usuarioLivros", function ($request, $response, array $args) {
    $body = $request->getBody();
    
    $data = json_decode($body, true); // parse the JSON into an assoc. array

    $userId = $data['USUARIO_ID'];  
    $livroId = $data['LIVRO_ID'];  
    $statusLeitura = $data['STATUS_LEITURA'];  

    try{
        
        $sql = "UPDATE USUARIO_LIVROS SET	
                    STATUS_LEITURA = :STATUS_LEITURA
                WHERE LIVRO_ID = :LIVRO_ID AND USUARIO_ID = :USUARIO_ID;";

        $db = new db();        
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->bindValue('STATUS_LEITURA', $statusLeitura);     
        $stmt->bindValue('USUARIO_ID', $userId);
        $stmt->bindValue('LIVRO_ID', $livroId);    
        $stmt->execute();
    
        $db = null;

        return json_encode("status: OK");
        
    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }    
});


// Deletar ponto de coleta
$app->delete("/usuarioLivros", function ($request, $response, array $args) {    
    $body = $request->getBody();
    
    $data = json_decode($body, true); // parse the JSON into an assoc. array

    $userId = $data['USUARIO_ID'];  
    $livroId = $data['LIVRO_ID'];  
    
    try{
        // Get DB Object
        $sql = "DELETE FROM USUARIO_LIVROS WHERE LIVRO_ID = :LIVRO_ID AND USUARIO_ID = :USUARIO_ID;";

        $db = new db();        
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->bindValue('LIVRO_ID', $livroId);     
        $stmt->bindValue('USUARIO_ID', $userId);
        $stmt->execute();
    
        $db = null;

        return json_encode("status: OK");
        
    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }    
});
