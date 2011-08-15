var Bar = module.exports = function (charm, x, y, params) {
    this.charm = charm;
    this.x = x;
    this.y = y;
    this.width = params.width || 10;
    
    this.progress = {
        percent : 0,
        ratio : 0
    };
}

Bar.prototype.draw = function (bars, msg) {
    bars = Math.floor(bars);
    this.charm.push(true);
    
    this.charm
        .position(this.x, this.y)
        .write('[')
        .background('green')
        .write(Array(bars + 1).join(' '))
        .display('reset')
        .write(Array(this.width - bars + 1).join(' '))
        .write('] ' + msg)
    ;
    
    this.charm.pop(true);
    
    return this;
};

Bar.prototype.percent = function (p, msg) {
    if (p === undefined) {
        return this.progress.percent;
    }
    else {
        p = Math.min(100, p);
        this.progress.percent = p;
        this.progress.ratio = [ p, 100 ];
        
        this.draw(
            this.width * p / 100,
            msg || (Math.floor(p) + ' %')
        );
        
        return this;
    }
};

Bar.prototype.ratio = function (n, d, msg) {
    if (n === undefined && d === undefined) {
        return this.progress.ratio;
    }
    else {
        var f = Math.max(n, d) / d;
        this.progress.ratio = [ Math.max(n, d), d ];
        this.progress.percent = f * 100;
        
        this.draw(
            this.width * f,
            msg || (n + ' / ' + d)
        );
        
        return this;
    }
};
