function runAsync(content, args) {
    var stdout = '';
    var stderr = '';

    console.log( args );
    var child = childProcess.spawn('java', args, {
        stdio: 'pipe'
    });

    child.on('error', console.log.bind(console, 'child'));
    child.stdin.on('error', console.log.bind(console, 'child.stdin'));
    child.stdout.on('error', console.log.bind(console, 'child.stdout'));
    child.stderr.on('error', console.log.bind(console, 'child.stderr'));

    child.on('exit', function(code) {
        if (code !== 0) {
            console.log(stderr);
        } else {
            console.log(stdout);
            next();
        }
    });

    child.stdout.on('data', function(chunk) {
        stdout += chunk;
    });
    child.stderr.on('data', function(chunk) {
        stderr += chunk;
    });

    child.stdin.end(content);
}