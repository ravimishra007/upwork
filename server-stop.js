// Simple utility to stop the Express server
console.log('Stopping the Express server...');

// Get all running servers
const servers = [];
for (const connection of Object.values(process._getActiveHandles())) {
  if (connection && connection.constructor && connection.constructor.name === 'Server') {
    servers.push(connection);
  }
}

// Close all servers
let closed = 0;
servers.forEach(server => {
  server.close(() => {
    closed++;
    console.log(`Closed server ${closed}/${servers.length}`);
    if (closed === servers.length) {
      console.log('All servers closed');
      process.exit(0);
    }
  });
});

if (servers.length === 0) {
  console.log('No active servers found');
  process.exit(0);
} 