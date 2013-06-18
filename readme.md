# Node Quote of the Day Server

This is a little, [RFC 865](https://tools.ietf.org/html/rfc865)
compliant, Quote of the day server written in Javascript for Node JS.
The server responds to TCP and UDP Requests.

## Example usage

The server can be started with the qotd-server: `bin/qotd-server`  By
default the server starts on port 8017.  To test that it's working,
netcat is handy: `nc localhost 8017`

## Ports

The server command can take an environment variable with the port that
you'd like the QOTD server to start up on.  `PORT=8090 bin/qotd-server`

The well know port for a quote of the day server is port 17, but that
will require sudo to start with on most machines.

## Author

This Quote of the day server was written by [Nick Rowe](http://dcxn.com)
in the late Spring of 2013.  It was written as a small network
experimentation program.

