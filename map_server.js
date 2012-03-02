var fs = require('fs');
var server = require('http').createServer(function(req, response){
  fs.readFile('map.html', function(err, data){
    response.writeHead(200, {'Content-Type':'text/html'});  
    response.write(data);  
    response.end();
  });
});
server.listen(8888);

var nowjs = require("now");
var everyone = nowjs.initialize(server);


var actors = [];
nowjs.on('connect', function() {
  actors[this.user.clientId] = {x: 0, y: 0};
});

nowjs.on('disconnect', function() {
  for(var i in actors) {
    if(i == this.user.clientId) {
      delete actors[i];
      break;
    }
  }
});

everyone.now.updateActor = function(x, y) {
  actors[this.user.clientId].x = x;
  actors[this.user.clientId].y = y;
  var toUpdate = {};
  for(var i in actors) {
    if(Math.abs(x - actors[i].x) < 310 && Math.abs(y - actors[i].y) < 210) {
        toUpdate[i] = {x: actors[i].x, y: actors[i].y};
    }
  }
  for(var i in toUpdate) {
    nowjs.getClient(i, function(err) {
      this.now.drawActors(toUpdate);
    });
  }
}
