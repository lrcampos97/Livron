<?php
header('Access-Control-Allow-Headers: "Origin, X-Requested-With, Content-Type, Accept"');
header("Access-Control-Allow-Origin: *", false);
header("Access-Control-Allow-Origin: *");

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';
require '../src/config/DB.php';

// Get All Usuarios
$app->get('/usuario', function(Request $request, Response $response){
    $sql = "SELECT * FROM USUARIOS";

    try{
        // Get DB Object
        $db = new db();        
        $db = $db->connect();

        $stmt = $db->query($sql);
        $usuarios = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        return json_encode($usuarios);
    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }
});


// Consultar usuário  
$app->get('/usuario/{id}', function(Request $request, Response $response){
    $id = $request->getAttribute('id');
    
    $sql = "SELECT * FROM USUARIOS WHERE USUARIO_ID = $id";
    
    try{
        // Get DB Object
        $db = new db();
        $db = $db->connect();

        $stmt = $db->query($sql);
        $usuarios = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($usuarios);

    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }
});

// Validar usuário
$app->get('/usuario/validaLogin/{login}/{senha}', function(Request $request, Response $response){
    $login = $request->getAttribute('login');
    $senha = $request->getAttribute('senha');
    
    $sql = "SELECT * FROM USUARIOS WHERE LOGIN = :LOGIN AND SENHA = :SENHA";
    
    try{
        // Get DB Object
        $db = new db();
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->bindValue('LOGIN',$login);    
        $stmt->bindValue('SENHA',$senha);
        $stmt->execute();
    
        $usuarios = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($usuarios);

    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }
});

// Adicionar usuário
$app->post('/usuario', function(Request $request, Response $response){
    $body = $request->getBody();

    $data = json_decode($body, true); // parse the JSON into an assoc. array

    $nome = $data['NOME'];  
    $login = $data['LOGIN'];  
    $senha = $data['SENHA'];  
    $email = $data['EMAIL'];  
    $telefone = $data['TELEFONE'];  
    $sexo = $data['SEXO'];  
    $perfilId = $data['PERFIL_ID'];  
    $XP = $data['XP'];  
    try{
        // Get DB Object
        $sql = "INSERT INTO USUARIOS (NOME, LOGIN, SENHA, EMAIL, TELEFONE, SEXO, PERFIL_ID, XP)	
                 VALUES (:NOME, :LOGIN, :SENHA, :EMAIL, :TELEFONE, :SEXO, :PERFIL_ID, :XP);";
        $db = new db();        
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->bindValue('NOME', $nome);
        $stmt->bindValue('LOGIN', $login);
        $stmt->bindValue('SENHA', $senha);
        $stmt->bindValue('EMAIL', $email);
        $stmt->bindValue('TELEFONE', $telefone);
        $stmt->bindValue('SEXO', $sexo);
        $stmt->bindValue('PERFIL_ID', $perfilId);
        $stmt->bindValue('XP', $XP);              
        $stmt->execute();

        $lastId= $db->lastInsertId();
        
        $db = null;

        return json_encode($lastId);
        
    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }    

});


// Atualizar usuário
$app->put('/usuario/{id}', function(Request $request, Response $response){
    $body = $request->getBody();
    $usuarioId = $request->getAttribute('id');

    $data = json_decode($body, true); // parse the JSON into an assoc. array

    $nome = $data['NOME'];  
    $login = $data['LOGIN'];  
    $senha = $data['SENHA'];  
    $email = $data['EMAIL'];  
    $telefone = $data['TELEFONE'];  
    $sexo = $data['SEXO'];  
    $perfilId = $data['PERFIL_ID'];  
    $XP = $data['XP'];  

    try{        
        $sql = "UPDATE USUARIOS SET 	
                    NOME = :NOME,
                    LOGIN = :LOGIN,
                    SENHA = :SENHA,
                    EMAIL = :EMAIL,
                    TELEFONE = :TELEFONE,
                    SEXO = :SEXO,
                    PERFIL_ID = :PERFIL_ID,
                    XP = :XP
                WHERE USUARIO_ID = :USUARIO_ID;";
                 
        $db = new db();        
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->bindValue('USUARIO_ID', $usuarioId);
        $stmt->bindValue('NOME', $nome);
        $stmt->bindValue('LOGIN', $login);
        $stmt->bindValue('SENHA', $senha);
        $stmt->bindValue('EMAIL', $email);
        $stmt->bindValue('TELEFONE', $telefone);
        $stmt->bindValue('SEXO', $sexo);
        $stmt->bindValue('PERFIL_ID', $perfilId);
        $stmt->bindValue('XP', $XP);              
        $stmt->execute();

        $db = null;

        return json_encode("status: OK");
        
    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }    

});




