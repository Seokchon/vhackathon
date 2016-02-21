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
        this.layer.addChild(new Wall(space, cp.v(0, height - 50), cp.v(width, height)), 1000);
        // bottom
        this.layer.addChild(new Wall(space, cp.v(0, 0), cp.v(width, 100), true), 1000);
        // left
        this.layer.addChild(new Wall(space, cp.v(-10, 100), cp.v(0, height)), 1000);
        // right
        this.layer.addChild(new Wall(space, cp.v(width, 100), cp.v(width + 10, height)), 1000);
    },
    pick: function () {
        
        var pick = ~~(Math.random() * Math.max(100-this.level, 60));
        
        if (pick > 40) {
            return 1;
        } else if (pick > 20) {
            return 2;
        } else if (pick > 5) {
            return 3;
        } else {
            return 4;
        }
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
            topLineHeight = this.size.height - 100,
            block = new Block(this.pick(), cc.p(x, topLineHeight), this.layer.space);
        
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