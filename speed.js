var fs = require( 'fs' ),
	child = require( 'child_process' ),
	logger = fs.createWriteStream( 'log.csv', { 'flags': 'a' } );;

function log_speed() {
	console.log( 'Running test ...' );

	var tester = child.exec( 'speedtest-cli --simple' );

	tester.stdout.on( 'data', function( data ) {
		var output = data.split( '\n' );

		// Log to the console for our sake.
		console.log( 'Results: ' + output.join( ' | ' ) );

		output = output.slice( 0, 3 );

		output[0] = output[0].replace( 'Ping: ', '' ).replace( ' ms', '' );
		output[1] = output[1].replace( 'Download: ', '' ).replace( ' Mbits/s', '' );
		output[2] = output[2].replace( 'Upload: ', '' ).replace( ' Mbits/s', '' );

		output.unshift( Date.now() );

		logger.write( output.join( ',' ) );
		logger.write( '\r\n' );

		tester.kill();

		setTimeout( log_speed, 10 * 60 * 1000 ); // Run the test again in 10 minutes
	} );

	tester.stderr.on( 'data', function( data ) {
		console.log( 'Error requesting data from Speedtest.net' );
		console.log( data );
	} );
}

log_speed();