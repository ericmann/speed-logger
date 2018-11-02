/****** OPTIONS *******/
var options = {
	interval: 600,                   // Interval of test in second
	logger: true,                    // Save test result
	loggerFileName: 'log.csv',       // Name of file to save history
	enableWebInterface: true,        // Web interface of result
  webInterfacePort: 3131,          // Port of web interface
	webInterfaceListenIp: "0.0.0.0", // IP to start server
	enableCLICharts: false,          // Show graph in CLI
	clearCLIBetweenTest: false,    // Clear screen between test
	consoleLog: false,           // Output logging to console
  secureDomains: null,          // Array of strings [ 'www.example.com' ]
  secureAdminEmail: 'youremail@here.com' //The admin for the secure email confirmation

  /** Secure uses https://letsencrypt.org/
     # Install software letsencrypt
     wget https://dl.eff.org/certbot-auto
     chmod a+x certbot-auto
     # Create dns entry and add _acme-challenge as TXT with key value
     ./certbot-auto certonly --agree-tos --renew-by-default --manual --preferred-challenges=dns -d www.example.com
     # Copy keys to certs: cp /etc/letsencrypt/* ./certs/ -r
     # To renew key if required
     ./certbot-auto renew
 */
};
/****** END OPTIONS ****/


var fs = require( 'fs' ),
	child = require( 'child_process' ),
	logger = fs.createWriteStream( options.loggerFileName, { 'flags': 'a' } ),
	asciichart = require ('asciichart'),
	http = require("http"),
  https = require('https'),
  url = require("url"),
  path = require("path"),
	csv = require("fast-csv"),
	date = require("./libs/date"),
	formatBytes = require("./libs/formatBytes");

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

if(options.enableWebInterface) {
  if (options.consoleLog)
	  console.log('Start {0}webserver on {1}:{2} every {3} minutes refresh'.format(options.secureDomains && options.secureAdminEmail ? "secure" :"", options.webInterfaceListenIp, options.webInterfacePort,Math.round(options.interval/60)));

  var server;
  if (options.secureDomains && options.secureAdminEmail) {
     const PROD = true;
     var path = require('path');
     //var os = require('os')
     var Greenlock = require('greenlock');
     var greenlockCfg = {
        agreeTos: true                      // Accept Let's Encrypt v2 Agreement
      , email: options.secureAdminEmail           // IMPORTANT: Change email and domains
      , approveDomains: options.secureDomains
      , communityMember: false              // Optionally get important updates (security, api changes, etc)
                                            // and submit stats to help make Greenlock better
      , version: 'draft-11'
      , server: PROD ? 'https://acme-v02.api.letsencrypt.org/directory'
            : 'https://acme-staging-v02.api.letsencrypt.org/directory'
      , configDir: path.join(__dirname, '/certs')
      , challengeType: 'dns-01'
     };

     var greenlock = Greenlock.create(greenlockCfg);
   if (options.consoleLog) {
     console.log('Make sure you have the certificates in: {0}'.format(greenlockCfg.configDir));
    }
   // var redir = require('redirect-https')();
   // require('http').createServer(greenlock.middleware(redir)).listen(80);
    server = https.createServer(greenlock.tlsOptions,
      function(req, res) {
      fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
      })
     }
    );
  } else {
	//Webserver
	 server = http.createServer(function(req, res) {
		fs.readFile('./index.html', 'utf-8', function(error, content) {
			res.writeHead(200, {"Content-Type": "text/html"});
			res.end(content);
		});
	});
 }

	//Initialise Socket IO
	var io = require('socket.io').listen(server);
	server.listen(options.webInterfacePort, options.webInterfaceListenIp);

	//On client connect push history
	io.sockets.on('connection', function (socket) {
		//Read CSV to show history
		var stream = fs.createReadStream(options.loggerFileName);
		var pings = [], downloads = [], uploads = [];
		var csvStream = csv()
		  .on("data", function(data){
			pings.push([(new Date(data[0])).getTime(), parseFloat(data[2])]);
			downloads.push([(new Date(data[0])).getTime(), parseFloat(data[3])]);
			uploads.push([(new Date(data[0])).getTime(), parseFloat(data[4])]);
		});
		stream.pipe(csvStream);


		//Make series for Highcharts
		var series = [
		{
			name:'Pings',
			data: pings,
			yAxis: 2
		},
		{
			name: 'Downloads',
			data: downloads
		},
		{
			name: 'Upload',
			data: uploads,
			yAxis: 1
		}
		];
		csvStream.on("end",function(){
			socket.emit('history', series);
		});
	});
}

if(options.enableCLICharts) {
	//This is series for CLI chart
	var s0 = [], s1 = [], s2 = [], id = 0, format = function (x) {
		return ('          ' + x.toFixed(0)).slice (-10);
	};
}

function log_speed() {
	if(options.consoleLog)
		console.log( "\n Running test ..." );

	var tester = child.exec( 'speedtest-cli --json' );

	tester.stdout.on( 'data', function( data ) {
		try {
			var out = JSON.parse(data);
			var pertinant_data = [];
			pertinant_data[0] = date('Y-m-d H:i:s');
			pertinant_data[1] = out.client.ip;
			pertinant_data[2] = out.ping;
			pertinant_data[3] = out.download;
			pertinant_data[4] = out.upload;
			pertinant_data[5] = out.server.sponsor;

			if(options.clearCLIBetweenTest && options.enableCLICharts)
				console.log('\033c');

			//Output result to console
			if(options.consoleLog)
				console.log('{0} => IP: {1} | Ping: {2}ms | Download: {3} | Upload: {4} | Server: {5}'.format(pertinant_data[0], pertinant_data[1], pertinant_data[2], formatBytes(pertinant_data[3]), formatBytes(pertinant_data[4]), pertinant_data[5]));

			if(options.enableWebInterface) {
				//Append to html chart
				var tt = (new Date(pertinant_data[0])).getTime();
				io.sockets.emit('update', [[tt, pertinant_data[2]], [tt, pertinant_data[3]], [tt, pertinant_data[4]]]);
			}

			//ASCII chart
			if(options.enableCLICharts) {
				s0[id] = (pertinant_data[2]);
				s1[id] = (formatBytes(pertinant_data[3], 0, true));
				s2[id] = (formatBytes(pertinant_data[4], 0, true));
				id++;
				if(id == 100)
					id = 0;

				//But if only one value in chart
				if(s0.length > 1) {
					console.log('PING');
					console.log (asciichart.plot(s0, { height: 10 }));
					console.log("\nDownload");
					console.log (asciichart.plot(s1, { height: 10, format: format }));
					console.log("\nUpload");
					console.log (asciichart.plot(s2, { height: 10, format: format }));
				}
			}

			if(options.logger) {
				logger.write( pertinant_data.join(',') );
				logger.write( '\r\n' );
			}

		} catch (ex){
			console.error( 'Error parsing data from speedtest.net: ' + data);
			console.error( ex )
		}

	} );

	tester.on( 'close', function( data ) {
		tester.kill();
		setTimeout( log_speed, options.interval * 1000 ); // Run the test again

	} );
}

log_speed();
