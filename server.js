var forever = require('forever'),
    child = new(forever.Monitor)('cloudterm.js', {
        'silent': false,
        'pidFile': 'pids/cloudterm.pid',
        'watch': false,
        'watchDirectory': '.',      // Top-level directory to watch from.
        'watchIgnoreDotFiles': true, // whether to ignore dot files
        'watchIgnorePatterns': [], // array of glob patterns to ignore, merged with contents of watchDirectory + '/.foreverignore' file
        'logFile': 'logs/forever.log', // Path to log output from forever process (when daemonized)
        'outFile': 'logs/forever.out', // Path to log output from child stdout
        'errFile': 'logs/forever.err'
    });
child.start();
forever.startServer(child);
