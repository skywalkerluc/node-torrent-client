# Notes:

### Http vs udp vs tcp
The main reason that most trackers now use udp is that udp has better performance than http. Http is built on top of another protocol called tcp, which we’ll use later in the project when we start actually downloading files from peers.

### Dgram, URL Parser and Buffer purposes
I use the url module’s parse method on our tracker url. This lets me easily extract different parts of the url like its protocol, hostname, port, etc.

The dgram module is our module for udp, and here I’m creating a new socket instance. A socket is an object through which network communication can happen. We pass the argument ‘udp4’, which means we want to use the normal 4-byte IPv4 address format (as 127.0.0.1).

In order to send a message through a socket, it must be in the form of a buffer, not a string or number. ```Buffer.from``` is an easy way to create a buffer from a string.

### About building connection request

Each message is a buffer with a specific format described in the BEP (Bittorrent docs).

The BEP describes the connect request as follows:

```
Offset  Size            Name            Value
0       64-bit integer  connection_id   0x41727101980
8       32-bit integer  action          0 // connect
12      32-bit integer  transaction_id  ? // random
16
```

This tells us that our message should start out with a 64-bit (i.e. 8 bytes) integer at index 0, and that the value should be 0x41727101980. Since we just write 8 bytes, the index of the next part is 8. Now we write 32-bit integer (4 bytes) with the value 0. This moves us up to an offset of 12 bytes, and we write a random 32-bit integer. So the total message length is 8 bytes + 4 bytes + 4bytes = 16 bytes long, and should look something like this:

```
<Buffer 00 00 04 17 27 10 19 80 00 00 00 00 a6 ec 6b 7d>
```

The 0x indicates that the number is a hexadecimal number, which can be a more conventient representation when working with bytes. Otherwise they’re basically the same as base 10 numbers.

The reason we have to write in 4 byte chunks, is that there is no method to write a 64 bit integer. Actually node.js doesn’t support precise 64-bit integers. But as you can see it’s easy to write a 64-bit hexadecimal number as a combination of two 32-bit hexadecimal numbers.

### About building connection response

Parsing the response is much simpler. Here’s how the response is formatted:

```
Offset  Size            Name            Value
0       32-bit integer  action          0 // connect
4       32-bit integer  transaction_id
8       64-bit integer  connection_id
16
```