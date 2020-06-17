<?php
header('Access-Control-Allow-Headers: "Origin, X-Requested-With, Content-Type, Accept"');
header("Access-Control-Allow-Origin: *", false);
header("Access-Control-Allow-Origin: *");

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\StreamInterface;

require '../vendor/autoload.php';

// Get All Emprestimos
$app->get('/emprestimo', function(Request $request, Response $response){
    $sql = "SELECT * FROM EMPRESTIMOS";

    try{
        // Get DB Object
        $db = new db();        
        $db = $db->connect();

        $stmt = $db->query($sql);
        $emprestimo = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        return json_encode($emprestimo);
    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }
});


// Consultar emprestimo  
$app->get('/emprestimo/{id}', function(Request $request, Response $response){
    $id = $request->getAttribute('id');
    
    $sql = "SELECT * FROM EMPRESTIMOS WHERE EMPRESTIMO_ID = $id";
    
    try{
        // Get DB Object
        $db = new db();
        $db = $db->connect();

        $stmt = $db->query($sql);
        $emprestimo = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($emprestimo);

    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }
});


// Registrar empréstimo
$app->post('/emprestimo', function(Request $request, Response $response){
    $body = $request->getBody();

    $data = json_decode($body, true); // parse the JSON into an assoc. array

    $livroId = $data['LIVRO_ID'];  
    $pontoColetaId = $data['PONTO_COLETA_ID'];  
    $usuarioResponsavelId = $data['USUARIO_RESPONSAVEL_ID'];  
    $usuarioProprietarioId = $data['USUARIO_PROPRIETARIO_ID'];  
    $dataEmprestimo = $data['DATA_EMPRESTIMO'];  

    try{
        $sql = "INSERT INTO EMPRESTIMOS (LIVRO_ID, PONTO_COLETA_ID, USUARIO_RESPONSAVEL_ID, USUARIO_PROPRIETARIO_ID, DATA_EMPRESTIMO)	
                 VALUES (:LIVRO_ID, :PONTO_COLETA_ID, :USUARIO_RESPONSAVEL_ID, :USUARIO_PROPRIETARIO_ID, :DATA_EMPRESTIMO);";
        $db = new db();        
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->bindValue('LIVRO_ID', $livroId);
        $stmt->bindValue('PONTO_COLETA_ID', $pontoColetaId);
        $stmt->bindValue('USUARIO_RESPONSAVEL_ID', $usuarioResponsavelId);
        $stmt->bindValue('USUARIO_PROPRIETARIO_ID', $usuarioProprietarioId);
        $stmt->bindValue('DATA_EMPRESTIMO', $dataEmprestimo);            
        $stmt->execute();

        $lastId= $db->lastInsertId();
        
        $db = null;

        return json_encode($lastId);
        
    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }    

});


// Atualizar empréstimo
$app->put('/emprestimo/{id}', function(Request $request, Response $response){
    $body = $request->getBody();
    $emprestimoId = $request->getAttribute('id');

    $data = json_decode($body, true); // parse the JSON into an assoc. array

    $livroId = $data['LIVRO_ID'];  
    $pontoColetaId = $data['PONTO_COLETA_ID'];  
    $usuarioResponsavelId = $data['USUARIO_RESPONSAVEL_ID'];  
    $usuarioProprietarioId = $data['USUARIO_PROPRIETARIO_ID'];  
    $dataEmprestimo = $data['DATA_EMPRESTIMO']; 
    $dataEntrega = $data['DATA_ENTREGA'];

    try{        
        $sql = "UPDATE EMPRESTIMOS SET 	
                    LIVRO_ID = :LIVRO_ID,
                    PONTO_COLETA_ID = :PONTO_COLETA_ID,
                    USUARIO_RESPONSAVEL_ID = :USUARIO_RESPONSAVEL_ID,
                    USUARIO_PROPRIETARIO_ID = :USUARIO_PROPRIETARIO_ID,
                    DATA_EMPRESTIMO = :DATA_EMPRESTIMO,
                    DATA_ENTREGA = :DATA_ENTREGA
                WHERE EMPRESTIMO_ID = :EMPRESTIMO_ID;";
                 
        $db = new db();        
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->bindValue('EMPRESTIMO_ID', $emprestimoId);
        $stmt->bindValue('LIVRO_ID', $livroId);
        $stmt->bindValue('PONTO_COLETA_ID', $pontoColetaId);
        $stmt->bindValue('USUARIO_RESPONSAVEL_ID', $usuarioResponsavelId);
        $stmt->bindValue('USUARIO_PROPRIETARIO_ID', $usuarioProprietarioId);
        $stmt->bindValue('DATA_EMPRESTIMO', $dataEmprestimo);
        $stmt->bindValue('DATA_ENTREGA', $dataEntrega);            
        $stmt->execute();

        $db = null;

        return json_encode("status: OK");
        
    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }    

});

// Deletar empréstimo
$app->delete("/emprestimo/{id}", function ($request, $response, array $args) {    
    $emprestimoId = $request->getAttribute('id');

    try{
        // Get DB Object
        $sql = "DELETE FROM EMPRESTIMOS WHERE EMPRESTIMO_ID = :EMPRESTIMO_ID;";

        $db = new db();        
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->bindValue('EMPRESTIMO_ID', $emprestimoId);     
        $stmt->execute();
    
        $db = null;

        return json_encode("status: OK");
        
    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }    
});