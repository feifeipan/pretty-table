const http = require("http");
const url = require("url");

var port = 3000;

var server = http.createServer(function(req, res){
	if (req.method == 'POST') {
	        whole = ''
	        req.on('data', (chunk) => {
	            // # consider adding size limit here
	            whole += chunk.toString()
	        })

	        req.on('end', () => {
	            var w = JSON.parse(whole);
	            w["nv"] = parseInt(w["nv"]) * 2;
	            // console.log(whole["nv"]);
	            res.setHeader("Access-Control-Allow-Origin", "*"); 
	            // console.log(whole);
	            // res.writeHead(200, 'OK', {'Content-Type': 'text/html'})
	            res.end(JSON.stringify(w));
	        })
	    }

	
	// res.end(req.body);
});

server.listen(port);