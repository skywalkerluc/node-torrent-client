# Notes:

### Http vs udp vs tcp
The main reason that most trackers now use udp is that udp has better performance than http. Http is built on top of another protocol called tcp, which we’ll use later in the project when we start actually downloading files from peers.

### Dgram, URL Parser and Buffer purposes
I use the url module’s parse method on our tracker url. This lets me easily extract different parts of the url like its protocol, hostname, port, etc.

The dgram module is our module for udp, and here I’m creating a new socket instance. A socket is an object through which network communication can happen. We pass the argument ‘udp4’, which means we want to use the normal 4-byte IPv4 address format (as 127.0.0.1).

In order to send a message through a socket, it must be in the form of a buffer, not a string or number. ```Buffer.from``` is an easy way to create a buffer from a string.

