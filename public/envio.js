function enviar(){
	var form = {nome: "", sobrenome:"", email:""};
	var nome = document.getElementById("nome").value;
	var sobrenome = document.getElementById("sobrenome").value;
	var email = document.getElementById("email").value;

	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "http://162.243.24.210:8082/",
		"method": "POST",
		"headers": {
		"content-type": "application/x-www-form-urlencoded",
		"cache-control": "no-cache",
		"Access-Control-Allow-Origin": "localhost:8080"
		},
		"data": {
		"nome": nome,
		"sobrenome": sobrenome,
		"email": email
		}
	}

$.ajax(settings).done(function (response) {
  console.log(response);
});

};

