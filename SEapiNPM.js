// Start test code


//Access node modules with the require function
const express = require('express');
const app = express();

//HS Form Submission variables
var https = require('https');
var querystring = require('querystring');   //the querystring module provides utilities for parsing and formatting URL query strings.

var bodyParser = require('body-parser'); //Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());   //using body parser to allow the app to expect json
var cookieParser = require('cookie-parser'); //Parse Cookie header and populate req.cookies with an object keyed by the cookie names. 
	app.use(cookieParser());

//This is the start of the actual function that needs to run in order to accept the req from the client //This is /submit hanging off my 3000
//Post method sends body of a network request
app.post("/submit", function(req, res){

		res.send("Your submission has been sent")
		console.log("Submission sent")
		console.log(req) //Log the request that is sent so we know it is going to the server

            // build the data object - start of data from HS Form Submission API Doc
	            //when sending data to a web server the data must be a string, convert JS object to a string .stringify
			var postData = querystring.stringify({
				'email': req.body.email,
				'firstname': req.body.firstname,
				'lastname': req.body.lastname,
				'hs_context': JSON.stringify({
					"hutk": req.cookies.hubspotutk,
					"ipAddress": req.headers['x-forwarded-for'] || req.connection.remoteAddress,
					"pageUrl": req.body.pageUrl, //local pageUrl
					"pageName": req.body.pageName, //local pageName
				})
			});
            // set the post options, changing out the HUB ID and FORM GUID variables. This is where the server is actually going craft the request that it wants to send to HubSpot
                //Hub ID: 5226105 --- Form GUID: 1edEcqovJSICR-EwCP9YBEg340hl
			var options = {
				hostname: 'forms.hubspot.com',
				path: '/uploads/form/v2/5226105/79d11caa-8bc9-4880-91f8-4c023fd60112', /////////////possibly wrong GUID?///////////
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': postData.length
				}
			}


//Here we are configuring the settings of the request, similar to how we configured the settings for our app to use on lines 7-13. So, when you do request.write then the settings are already there.
//"chunk" is breaking up data so you are not crashing the servers
            //Above are HHHAANNNAAAHHH'S notes

			var request = https.request(options, function(response){
				console.log("Status: " + response.statusCode);
				console.log("Headers: " + JSON.stringify(response.headers)); //whatever hubspot sends back
				response.setEncoding('utf8');
				response.on('data', function(chunk){
					console.log('Body: ' + chunk) //Chunk converts data into smaller more managable pieces
				});
			});

			request.on('error', function(e){
				console.log("WARNING WARNING WARNING" + e.message)
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