const express = require("express");
const app = express();
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
var Connection = require('tedious').Connection;
var Request = require('tedious').Request; 
var TYPES = require('tedious').TYPES;  

	var config = {
	    userName: "user_trial",
	    password: "7412LIVE!@#$%¨&*()",
	    server: "virtual2.febracorp.org.br:1433"
		 };
 	var connection = new Connection(config);  
	connection.on('connect', function(err) {  
    	console.log("Connected");
    	//insert na tbs_nome
    	function insertNome() {  
    		let nome = req.nome;
        request = new Request("INSERT INTO tbs_nome(id, nome, cod) VALUES (@id, @nome, @cod)",
        	function(err) {  
	         if (err) {  
	            console.log(err);}  
	        }); 
        request.addParameter('id', TYPES.Int, 1);  
        request.addParameter('nome', TYPES.NVarChar , req.body.nome);  
        request.addParameter('cod', TYPES.BigInt, nome);        
        connection.execSql(request); 
    	}	
    	//insert na tbs_sobrenome
	    function insertSobrenome() {  
	    	let sobrenome = req.sobrenome;
	        request = new Request("INSERT INTO tbs_sobrenome(id, sobrenome, cod) VALUES (@id, @sobrenome, @cod)",
	        	function(err) {  
		         if (err) {  
		            console.log(err);}  
		        });  
	        request.addParameter('id', TYPES.Int, 1);  
	        request.addParameter('sobrenome', TYPES.NVarChar , req.body.sobrenome);  
	        request.addParameter('cod', TYPES.BigInt, sobrenome);        
	        connection.execSql(request); 
	    }	
	    //insert na tbs_email
	    function insertEmail() {
	    	let email = req.email;
	    	request = new Request("INSERT INTO tbs_email(id, email, cod) VALUES (@id, @email, @cod)",
        	function(err) {  
	         if (err) {  
	            console.log(err);}  
	        });  
        request.addParameter('id', TYPES.Int, 1);  
        request.addParameter('email', TYPES.NVarChar , req.body.email);  
        request.addParameter('cod', TYPES.BigInt, email);        
        connection.execSql(request);
 		}

	    	var result = "";
	    //select nome
	    function selectNome(){
	    	request = new Request("SELECT soma.tbs_cod_nome AS soma, cod.tbs_cod_nome AS cod"+
	    							"FROM tbs_cod_nome LEFT JOIN tbs_nome ON tbs_cod_nome.cod = tbs_nome.cod"),	
	    	result = soma + cod;
	    	console.log(result); 
	    }

	    //select sobrenome
	    function selectSobrenome(){
	    	request = new Request("SELECT soma.tbs_cod_sobrenome AS soma, cod.tbs_cod_sobrenome AS cod"+
	    							"FROM tbs_cod_sobrenome LEFT JOIN tbs_sobrenome ON tbs_cod_sobrenome.cod = tbs_sobrenome.cod"),	
	    	result = soma + cod; 
	    	console.log(result);
	    }

	    //select email
	    function selectEmail(){
	    	request = new Request("SELECT soma.tbs_cod_email AS soma, cod.tbs_cod_email AS cod"+
	    							"FROM tbs_cod_email LEFT JOIN tbs_email ON tbs_cod_email.cod = tbs_email.cod"),
	    	result = soma + cod;
	    }
	    	console.log(result); 
    	
	});    

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	app.get('/',function(req,res){
		res.sendFile('index.html', { root: path.join(__dirname, '../public') });
	});



	const port = 8080;
	app.listen(port, function(err){
		if(err) console.log(err)
		else console.log("online")
	})