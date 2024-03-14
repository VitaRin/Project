const { Server } = require("socket.io");
const io = new Server();

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

io.listen(3000);
//io.listen(3000, () => {
    //console.log('listening on *:3000');
//});