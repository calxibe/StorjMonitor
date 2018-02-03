#!/usr/bin/env node

'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
const dnode = require('dnode');
const http = require('http');
const requestify = require('requestify'); 

var token = "YOUR-TOKEN-HERE"; //api token can be create under "Nodes" -> "API-Key"
var log = console.log;

console.log = function () {
    var first_parameter = arguments[0];
    var other_parameters = Array.prototype.slice.call(arguments, 1);

    function formatConsoleDate (date) {
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var milliseconds = date.getMilliseconds();

        return '[' +
               ((hour < 10) ? '0' + hour: hour) + ':' +
               ((minutes < 10) ? '0' + minutes: minutes) + ':' +
               ((seconds < 10) ? '0' + seconds: seconds) + '] ';
    }

    log.apply(console, [formatConsoleDate(new Date()) + first_parameter].concat(other_parameters));
};

function fSubmitData() {
	const daemon = dnode.connect(45015);

	var options;
	daemon.on('remote', (rpc) => {
	  rpc.status(function(err, shares) {
		shares.forEach((share) => {
			console.log(share.id + ' | Submit to Storjstat');
			//console.log(share.id+'\n'+JSON.stringify(share.meta, null, 4));
			
			requestify.post('https://storjstat.com:3000/clientnode?token=' + token + '&nodeID=' + share.id, share.meta)
				.then(function(response) {
					var obj = response.getBody();
					if (obj.saved == true) {
						console.log(share.id + ' | Success');
					} else {
						console.log(share.id + ' | Error');
					}
				})
				.fail(function(response) {
					console.log('ERROR ' + JSON.stringify(response.getBody()));
				});

		});
	   daemon.end();
	  });
	}).on('error',function(err){
	    //console.log(err);
	    console.log('Error connecting to Storj app, are you sure its running?');
	});
}

setInterval(function(){ fSubmitData(); }, 900000);
fSubmitData();