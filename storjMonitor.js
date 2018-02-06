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
        return '[' + ((hour < 10) ? '0' + hour: hour) + ':' + ((minutes < 10) ? '0' + minutes: minutes) + ':' + ((seconds < 10) ? '0' + seconds: seconds) + '] ';
    }

    log.apply(console, [formatConsoleDate(new Date()) + first_parameter].concat(other_parameters));
};

function fParseNodes() {
	const daemon = dnode.connect(45015);

	daemon.on('remote', (rpc) => {
		rpc.status(function(err, shares) {
			daemon.end();
			shares.forEach((share) => {
				console.log(share.id + ' | Submit to Storjstat');
				fSubmitData(share.id, share.meta);
			});
		});
	}).on('fail',function(err){
		console.log('Error in protocol layer, try restaring StorjMonitor...');
		console.log(err);
	}).on('error',function(err){
		console.log('Error connecting to StorjShare Client, are you sure its running?');
		console.log(err);
	});		
}

function fSubmitData(nodeId,meta) {
	requestify.post('https://storjstat.com:3000/clientnode?token=' + token + '&nodeID=' + nodeId, meta)
		.then(function(response) {
			var obj = response.getBody();
			if (obj.saved == true) {
				console.log(nodeId + ' | Success');
			} else {
				console.log(nodeId + ' | Error');
			}
		}).fail(function(response) {
			console.log('ERROR ' + JSON.stringify(response.getBody()));
		});
}

setInterval(function(){ fParseNodes(); }, 900000);
fParseNodes();
