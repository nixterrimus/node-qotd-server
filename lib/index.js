exports.StaticQuoter = function(){
  this.quote = function(){
    return "Hello, World!";
  };
}

exports.FortuneQuoter = function(pathToFortuneFile){
  var fs = require('fs');
  this.pathToFortuneFile = pathToFortuneFile;
  this.quotes = [];
  var that = this;
  var RFC_865_MAX_QUOTE_LENGTH = 512;

  var initialize = function(){
    if (that.pathToFortuneFile == undefined) {
      throw new ReferenceError('FortuneQuoter must be initialized with the path to a fortune file');
    }
    fs.readFile(that.pathToFortuneFile, 'utf8', function (err,data) {
      var validQuotes = quotesFromData(data).filter(validQuote);
      that.quotes = validQuotes;
    });
  };

  this.quote = function(){
    var randomQuote = that.quotes[Math.floor(Math.random()*that.quotes.length)];
    return randomQuote;
  };

  var quotesFromData = function(data){
    return data.split("\n%\n")
  };

  var validQuote = function (quote, index, array) {
    return (quote.length < RFC_865_MAX_QUOTE_LENGTH);
  }

  initialize();
};

exports.TcpQuoteServer = function(quoter, port) {
  var net = require('net');
  var strftime = require('strftime')
  this.quoter = quoter;
  this.port = port;
  var that = this;

  this.start = function(){
    var tcpServer = net.createServer( {}, function(server) {
      logRequest();
      server.write(quoter.quote());
      server.write('\r\n');
      server.end();
    });

    tcpServer.listen(that.port, function() {
      console.log('QOTD TCP Server started on port ' + that.port);
    });
  };

  var logRequest = function(){
    console.log("[" + strftime('%F %T') + "] TCP Request Received");
  };
};

exports.UdpQuoteServer = function(quoter, port){
  var dgram = require('dgram');
  var strftime = require('strftime')
  this.port = port;
  var that = this;

  this.start = function(){
    var server = dgram.createSocket("udp4", function(msg, connection) {
      logRequest();
      var quote = new Buffer(quoter.quote() + "\r\n");
      server.send(quote, 0, quote.length, connection.port, connection.address);
    });
    server.bind(that.port);
  };

  var logRequest = function(){
    console.log("[" + strftime('%F %T') + "] UDP Request Received");
  };
};

exports.QOTDServer = function(quoter, port) {
  this.port = port;
  this.quoter = quoter;
  var that = this;

  this.startOnAllInterfaces = function() {
    var tServer = new exports.TcpQuoteServer(quoter, port);
    var uServer = new exports.UdpQuoteServer(quoter, port);
    tServer.start();
    uServer.start();
  }
}
