<?php
    class db{
            
        // Connect
        public function connect(){

            $database = "";
            $usuario = "";
            $senha = "";
            $servidor = '';

            try{                
                $connection = new PDO( "sqlsrv:Server={$servidor};Database={$database}", $usuario, $senha);            
                $connection->exec("set names utf8");
                $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                return $connection;
            }
            catch ( PDOException $e ){            
                echo "\nErro: " . $e->getMessage();
                exit;
            }
        }


    }


    