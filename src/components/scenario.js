function Scenario(layer) {
    this.layer = layer;
    this.level = 0;
    this.blocks = [];
    this.size = layer.size;
    this.init();
}

Scenario.prototype = {
    images: [res.green_png, res.red_png, res.yellow_png, res.grey_png],
    init: function () {
        var space = this.layer.space,
            width = this.size.width,
            height = this.size.height;
        
        // top
        new Wall(space, cp.v(0, height), cp.v(width, height));
        // bottom
        new Wall(space, cp.v(0, 0), cp.v(width, 0), true);
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
        var scenario = this,
            topLineHeight = this.size.height - 75,
            block = new Block(this.images[((~~(Math.random() * 10)) % 4)], cc.p(x, topLineHeight), this.layer.space);
        
        block.onFragil(function () {
            scenario.destroyBlock(block);
        });
        
        this.blocks.push(block);
        this.layer.addChild(block);
    },
    destroyBlock: function (block) {
        this.blocks.splice(this.blocks.indexOf(block), 1);
    }
};