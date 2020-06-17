<?php
header('Access-Control-Allow-Headers: "Origin, X-Requested-With, Content-Type, Accept"');
header("Access-Control-Allow-Origin: *", false);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PUT, GET, OPTIONS, DELETE");

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\StreamInterface;

require '../vendor/autoload.php';

// Get all books
$app->get('/livro', function (Request $request, Response $response) {
    $sql = "SELECT * FROM LIVROS";

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


// Pegar livro específico
$app->get('/livro/{id}', function (Request $request, Response $response) {
    $id = $codigo = $request->getAttribute('id');

    $sql = "SELECT * FROM LIVROS where LIVRO_ID = $id";

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

// Adicionar novo livro
$app->post("/livro", function ($request, $response, array $args) {    
    $body = $request->getBody();

    $data = json_decode($body, true); // parse the JSON into an assoc. array

    $titulo = $data['TITULO'];  
    $subtitulo = $data['SUBTITULO'];  
    $resumo = $data['RESUMO'];  
    $paginas = $data['PAGINAS'];  
    $generoId = $data['GENERO_ID'];  
    $editora = $data['EDITORA'];  
    $edicao = $data['EDICAO'];  
    $usuarioResponsavelId = $data['USUARIO_RESPONSAVEL_ID'];  
    $usuarioProprietarioId = $data['USUARIO_PROPRIETARIO_ID'];  
    $ano = $data['ANO'];
    $ISBN = $data['ISBN']; 
    $autor = $data['AUTOR']; 


    try{
        // Get DB Object
        $sql = "INSERT INTO LIVROS (TITULO, SUBTITULO, RESUMO, PAGINAS, GENERO_ID, EDITORA, EDICAO, USUARIO_RESPONSAVEL_ID, USUARIO_PROPRIETARIO_ID, ANO, ISBN, AUTOR)	
                 VALUES (:TITULO, :SUBTITULO, :RESUMO, :PAGINAS, :GENERO_ID, :EDITORA, :EDICAO, :USUARIO_RESPONSAVEL_ID, :USUARIO_PROPRIETARIO_ID, :ANO, :ISBN, :AUTOR);";
        $db = new db();        
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->bindValue('TITULO', $titulo);
        $stmt->bindValue('SUBTITULO', $subtitulo);
        $stmt->bindValue('RESUMO', $resumo);
        $stmt->bindValue('PAGINAS', $paginas);
        $stmt->bindValue('GENERO_ID', $generoId);
        $stmt->bindValue('EDITORA', $editora);
        $stmt->bindValue('EDICAO', $edicao);
        $stmt->bindValue('USUARIO_RESPONSAVEL_ID', $usuarioResponsavelId);
        $stmt->bindValue('USUARIO_PROPRIETARIO_ID', $usuarioProprietarioId);
        $stmt->bindValue('ANO', $ano);
        $stmt->bindValue('ISBN', $ISBN);
        $stmt->bindValue('AUTOR', $autor);
        $stmt->execute();

         $lastId= $db->lastInsertId();
        
         $db = null;

         return json_encode($lastId);
        
    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }    

});


// Atualizar livro
$app->put("/livro/{id}", function ($request, $response, array $args) {
    $body = $request->getBody();
    $livroId = $request->getAttribute('id');

    $data = json_decode($body, true); // parse the JSON into an assoc. array

    $titulo = $data['TITULO'];  
    $subtitulo = $data['SUBTITULO'];  
    $resumo = $data['RESUMO'];  
    $paginas = $data['PAGINAS'];  
    $generoId = $data['GENERO_ID'];  
    $editora = $data['EDITORA'];  
    $edicao = $data['EDICAO'];  
    $usuarioResponsavelId = $data['USUARIO_RESPONSAVEL_ID'];  
    $usuarioProprietarioId = $data['USUARIO_PROPRIETARIO_ID'];  
    $ano = $data['ANO'];
    $ISBN = $data['ISBN']; 
    $autor = $data['AUTOR']; 


    try{
        
        $sql = "UPDATE LIVROS SET	
                 	TITULO = :TITULO,
                    SUBTITULO = :SUBTITULO,
                    RESUMO = :RESUMO,
                    PAGINAS = :PAGINAS,
                    GENERO_ID = :GENERO_ID,
                    EDITORA = :EDITORA,
                    EDICAO = :EDICAO,
                    USUARIO_RESPONSAVEL_ID = :USUARIO_RESPONSAVEL_ID,
                    USUARIO_PROPRIETARIO_ID = :USUARIO_PROPRIETARIO_ID,
                    ANO = :ANO,
                    ISBN = :ISBN,
                    AUTOR = :AUTOR
                WHERE LIVRO_ID = :LIVRO_ID;";

        $db = new db();        
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->bindValue('LIVRO_ID', $livroId);     
        $stmt->bindValue('TITULO', $titulo);
        $stmt->bindValue('SUBTITULO', $subtitulo);
        $stmt->bindValue('RESUMO', $resumo);
        $stmt->bindValue('PAGINAS', $paginas);
        $stmt->bindValue('GENERO_ID', $generoId);
        $stmt->bindValue('EDITORA', $editora);
        $stmt->bindValue('EDICAO', $edicao);
        $stmt->bindValue('USUARIO_RESPONSAVEL_ID', $usuarioResponsavelId);
        $stmt->bindValue('USUARIO_PROPRIETARIO_ID', $usuarioProprietarioId);
        $stmt->bindValue('ANO', $ano);
        $stmt->bindValue('ISBN', $ISBN);    
        $stmt->bindValue('AUTOR', $autor);
        $stmt->execute();
    
        $db = null;

        return json_encode("status: OK");
        
    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }    
});

// Deletar livro
$app->delete("/livro/{id}", function ($request, $response, array $args) {    
    $livroId = $request->getAttribute('id');
    try{
        // Get DB Object
        $sql = "DELETE FROM LIVROS WHERE LIVRO_ID = :LIVRO_ID;";

        $db = new db();        
        $db = $db->connect();

        $stmt = $db->prepare($sql);
        $stmt->bindValue('LIVRO_ID', $livroId);     
        $stmt->execute();
    
        $db = null;

        return json_encode("status: OK");
        
    } catch(PDOException $e){
        echo '{"error": {"text": '.$e->getMessage().'}';
    }    
});
