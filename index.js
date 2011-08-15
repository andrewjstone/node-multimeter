var charmer = require('charm');
var Bar = require('./lib/bar');

var exports = module.exports = function (c) {
    if (c instanceof charmer.Charm) {
        var charm = c;
    }
    else {
        var charm = charmer.apply(null, arguments);
        charm.on('^C', function () {
            charm.destroy();
        });
    }
    
    var multi = function (x, y, params) {
        if (typeof x === 'object') {
            params = x;
            x = params.x;
            y = params.y;
        }
        if (!params) params = {};
        
        if (x === undefined) throw new Error('x is undefined');
        if (y === undefined) throw new Error('y is undefined');
        
        return new Bar(charm, x, y, params);
    };
    
    multi.drop = function (params, cb) {
        if (!cb) { cb = params; params = {} }
        
        charm.position(function (x, y) {
            var bar = new Bar(charm, x, y, params);
            cb(bar);
        });
    };
    
    multi.charm = charm;
    multi.destroy = charm.destroy.bind(charm);
    multi.write = charm.write.bind(charm);
    
    return multi;
};
