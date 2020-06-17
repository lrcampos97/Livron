<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';

$app = new \Slim\App;


require_once('../src/routes/usuario.php');
require_once('../src/routes/livro.php');
require_once('../src/routes/emprestimo.php');
require_once('../src/routes/pontoColeta.php');
require_once('../src/routes/usuarioLivros.php');
require_once('../src/routes/generos.php');

$app->run();
