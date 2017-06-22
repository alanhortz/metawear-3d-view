/* jshint esversion : 6 */

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Metawear = require('node-metawear');
app.use(express.static('public'));
io.on('connection', function() {
	console.log('user connected');
});
server.listen(8080, function() {
	console.log('server listening on port 8080');
});


Metawear.discoverByAddress('c7:6e:8e:86:15:55',function(device) {
    console.log('discovered device ', device.address);

    device.on('disconnect', function() {
        console.log('we got disconnected! :( ');
    });

    device.connectAndSetup(function(error) {
        console.log('were connected!');
        
        const QUATERION = 0x7;
        const DATA_QUATERION = 0x3;
        const MODE_NDOF = 0x1;

        var sensorFusion = new device.SensorFusion(device);
        
        sensorFusion.config.setMode(MODE_NDOF);
        sensorFusion.subscribe(QUATERION);
        sensorFusion.enableData(DATA_QUATERION);
        sensorFusion.writeConfig();
	sensorFusion.start();
        
        sensorFusion.onChange(function(data) {
            //console.log(data);
            io.emit('quaternion',data);
        });
    });
});
