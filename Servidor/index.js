const express = require("express");
const app = express();
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
var TYPES = require('tedious').TYPES;
//var Request = require("tedious").Request;
//var Connection = require("tedious").Connection;
var tp = require('tedious-promises');
var dbConfig = require('../Servidor/config.json');
tp.setConnectionConfig(dbConfig);

	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	app.get('/',function(req,res){
		res.sendFile('index.html', { root: path.join(__dirname, '../public') });
	});

	app.post('/', function(req, res){
		var nome = req.body.nome;
		var nomeCod = req.body.nomeCod;
		var sobrenome = req.body.sobrenome;
		var sobrenomeCod = req.body.sobrenomeCod;
		var email = req.body.email;
		var emailCod = req.body.emailCod;
		res.send({Nome: nome, Sobrenome: sobrenome, Email:email});
		insertNome(nome, nomeCod);
		insertSobrenome(sobrenome, sobrenomeCod);
		insertEmail(email, emailCod);
//		insertSql(nome, nomeCod, sobrenome, sobrenomeCod, email,emailCod);
	//	selectNome();
	///	selectSobrenome();
	//	selectEmail();
	//	selectSql();
		selectSql(nomeCod, sobrenomeCod, emailCod, function(result){
			console.log(result);
			app.get('/result.html', function(req, res){
				res.send("<label id='resultSoma'><span> Resultado: </span>"+ result +"</label><br/>"+
						"<label id='valorInserido'><span >Nome: </span>"+nome+"</label><br/>"+
						"<label id='valorInserido'><span >Sobrenome: </span>"+sobrenome+"</label><br/>"+
						"<label id='valorInserido'><span >Email: </span>"+email+"</label><br/>");
			})
		})
	})

	function insertNome(nome, nomeCod){
		console.log(nome, nomeCod)
		tp.sql("INSERT INTO tbs_nome(nome, cod) VALUES (@nome, @nomeCod)")
			.parameter("nome", TYPES.NVarChar, nome)
			.parameter("nomeCod", TYPES.BigInt, nomeCod)
			.execute()
			.then(function(){
				console.log("nome inserido No banco")
			}).fail(function(err){
				console.log(err)
			})
	}
	function insertSobrenome(sobrenome, sobrenomeCod){
		tp.sql("INSERT INTO tbs_sobrenome(sobrenome, cod) VALUES (@sobrenome, @sobrenomeCod)")
			.parameter("sobrenome", TYPES.NVarChar, sobrenome)
			.parameter("sobrenomeCod",TYPES.BigInt, sobrenomeCod)
			.execute()
			.then(function(){
				console.log("sobrenome inserido No banco")
			}).fail(function(err){
				console.log(err)
			})
	}
	function insertEmail(email, emailCod){
		tp.sql("INSERT INTO tbs_email(email, cod) VALUES (@email, @emailCod)")
			.parameter("email", TYPES.NVarChar, email)
			.parameter("emailCod",TYPES.BigInt, emailCod)
			.execute()
			.then(function(){
				console.log("email inserido no banco")
			}).fail(function(err){
				console.log(err)
			})
	}
////////////////////////////////////////////////////////////////////////////////////
	var nomeTotal;
	var sobrenomeTotal;
	var emailTotal;
	function selectSql(nomeCod, sobrenomeCod, emailCod, callback){
		tp.sql("SELECT tbs_cod_nome.soma + tbs_cod_nome.cod as somaNome FROM tbs_cod_nome inner JOIN tbs_nome ON tbs_cod_nome.cod = tbs_nome.cod where tbs_cod_nome.cod = @nomeCod")
			.parameter('nomeCod', TYPES.NVarChar, nomeCod)
			.execute()
			.then(function(result){
				console.log(result)
				nomeTotal = result;	
				tp.sql("SELECT tbs_cod_sobrenome.soma + tbs_cod_sobrenome.cod as somaSobrenome FROM tbs_cod_sobrenome inner JOIN tbs_sobrenome ON tbs_cod_sobrenome.cod = tbs_sobrenome.cod where tbs_cod_sobrenome.cod = @sobrenomeCod")
					.parameter('sobrenomeCod', TYPES.NVarChar, sobrenomeCod)
					.execute()
					.then(function(result){
						sobrenomeTotal = result[0].somaSobrenome;
						tp.sql("SELECT tbs_cod_email.soma + tbs_cod_email.cod as somaEmail FROM tbs_cod_email inner JOIN tbs_email ON tbs_cod_email.cod = tbs_email.cod where tbs_cod_email.cod @emailCod")
							.parameter('emailCod', TYPES.NVarChar, emailCod)
							.execute()
							.then(function(result){
								emailTotal = result[0].somaEmail;
								var total = parseInt(nomeTotal) + parseInt(sobrenomeTotal) + parseInt(emailTotal);
								tp.sql("SELECT tbs_cores.cor,tbs_cores.total from tbs_cores where tbs_cores.cor not in(select tbs_cores_excluidas.cor from tbs_cores_excluidas) and tbs_cores.total = @total")
									.parameter('total', TYPES.NVarChar, total)
									.execute()
									.then(function(result){
										callback(result);
										console.log(result)
									}).fail(function(err){
										console.log(err);
									})
							})
					})
			})
		}



////////////////////////////////////////////////////////////////////////////////////
	function selectNome(){	
		tp.sql("SELECT sum(tbs_cod_nome.soma + tbs_cod_nome.cod) as somaNome FROM tbs_cod_nome LEFT JOIN tbs_nome ON tbs_cod_nome.cod = tbs_nome.cod")
			.execute()
			.then(function(result){
				nomeTotal = result[0].somaNome;
				console.log(parseInt(emailTotal)+"/"+parseInt(sobrenomeTotal)+"/"+parseInt(nomeTotal)+" nome");
			}).fail(function(err){
				console.log(err)
			})
	}	
////////////////////////////////////////////////////////////////////////////////////
	function selectSobrenome(){
		tp.sql("SELECT sum(tbs_cod_sobrenome.soma + tbs_cod_sobrenome.cod) as somaSobrenome FROM tbs_cod_sobrenome LEFT JOIN tbs_sobrenome ON tbs_cod_sobrenome.cod = tbs_sobrenome.cod")
			.execute()
			.then(function(result){
				sobrenomeTotal = result[0].somaSobrenome;
				console.log(parseInt(emailTotal)+parseInt(sobrenomeTotal)+parseInt(nomeTotal)+" sobrenome");
			}).fail(function(err){
				console.log(err)
			})
	}
////////////////////////////////////////////////////////////////////////////////////
	function selectEmail(){
		tp.sql("SELECT sum(tbs_cod_email.soma + tbs_cod_email.cod) as somaEmail FROM tbs_cod_email LEFT JOIN tbs_email ON tbs_cod_email.cod = tbs_email.cod")
			.execute()
			.then(function(result){
				emailTotal = result[0].somaEmail;
				console.log(parseInt(emailTotal)+"/"+parseInt(sobrenomeTotal)+"/"+parseInt(nomeTotal)+" email");
			}).fail(function(err){
				console.log(err)
			})
	}

	const port = 8080;
	app.listen(port, function(err){
		if(err) console.log(err);
		else console.log("online");
	})