function Scenario(layer) {
    this.layer = layer;
    this.level = 0;
    this.blocks = [];
    this.size = layer.size;
    this.init();
}

Scenario.prototype = {
    init: function () {
        var space = this.layer.space,
            width = this.size.width,
            height = this.size.height;
        
        // top
        new Wall(space, cp.v(0, height), cp.v(width, height));
        // bottom
        new Wall(space, cp.v(0, 0), cp.v(width, 0));
        // left
        new Wall(space, cp.v(0, 0), cp.v(0, height));
        // right
        new Wall(space, cp.v(width, 0), cp.v(width, height));
    },
    next: function () {
        this.level++;
        
        var self = this,
            space = this.layer.space,
            step = 100,
            current = this.blocks.length;
        
        this.blocks.map(function (block) {
            block.down();
        });
        
        
        for (var x = (self.level % 2) ? 50 : 100; x < self.size.width; x += step) {
        
            // random creation and limit creation
            if (Math.random() > .5) {
                self.addBlock(x);
            }
        }
        
        if (current == self.blocks.length) {
            self.addBlock(((self.level % 2) ? 50 : 100) + (((~~(Math.random() * 10)) % 3) * step));
        }
        
    },
    addBlock: function (x) {
        var topLineHeight = this.size.height - 75,
            block = new Block(res.Orange_png, cc.p(x, topLineHeight), this.layer.space);
        
        this.blocks.push(block);
        this.layer.addChild(block);
    },
    destroyBlock: function (block) {
        // TODO Destroy block
    }
};