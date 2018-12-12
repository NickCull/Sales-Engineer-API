
//Access node modules with the require function
const express = require('express');
const app = express();

//HS Form Submission variables
var https = require('https');
var querystring = require('querystring');

var bodyParser = require('body-parser'); 
var cookieParser = require('cookie-parser'); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/Public')); //Applies CSS to HTML by using express.static() method to serve files 


app.post("/submit", function(req, res){

		res.send("You're All Set!")
		console.log("Submission Sent") 
		console.log(req) //Log request to verify transfer is complete

			var postData = querystring.stringify({
				'email': req.body.email,
				'firstname': req.body.firstname,            //X.X.X tells the function where to look for the data
				'lastname': req.body.lastname,
				'hs_context': JSON.stringify({
					"hutk": req.cookies.hubspotutk,
					"ipAddress": req.headers['x-forwarded-for'] || req.connection.remoteAddress,
					"pageUrl": req.body.pageUrl, //local pageUrl
					"pageName": req.body.pageName, //local pageName
				})
			});
            // set the post options, changing out the HUB ID and FORM GUID variables. 
                //Hub ID: 5226105 --- Form GUID: 79d11caa-8bc9-4880-91f8-4c023fd60112
			var options = {
				hostname: 'forms.hubspot.com',
				path: '/uploads/form/v2/5226105/79d11caa-8bc9-4880-91f8-4c023fd60112', 
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': postData.length
				}
			}
			//configures API response (no modification needed here)
			var request = https.request(options, function(response){
				console.log("Status: " + response.statusCode);
				console.log("Headers: " + JSON.stringify(response.headers)); //API response
				response.setEncoding('utf8');
				response.on('data', function(chunk){
					console.log('Body: ' + chunk) //Chunk converts data into smaller more managable pieces
				});
			});

			request.on('error', function(e){
				console.log("Cambridge, We Have A Problem" + e.message)
			});

            //triggers the POST to HS
			request.write(postData);
			request.end();

	})//END HS FORM SUBMISSION API 

//Sends HTML file to server live on port 3000
app.get("/", function(req, res){
	console.log("Server is live")
	res.sendFile("/users/ncull/Documents/HubSpotSEApiPresentation/SEapi.html")
}) 

//Listen to the server live on port Andre 3000
app.listen(3000, () => console.log('Listening on port 3000'));
