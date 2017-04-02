var fs = require('fs'), path = require('path');
function directoryWalk(currentDirPath, callback, baseChecked) {
    baseChecked = baseChecked || false;
    if( !baseChecked ){
        try {
            fs.accessSync(currentDirPath);
            baseChecked = true; // prevent this logic running again
        } catch (e) {
            //return
            return callback([]);
        }
    }
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name),
            stat = fs.statSync(filePath);
        if (stat.isFile()) callback(filePath, stat);
        else if (stat.isDirectory()) directoryWalk(filePath, callback, baseChecked);
    });
}
module.exports = directoryWalk;