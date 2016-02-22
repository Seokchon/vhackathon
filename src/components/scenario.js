function Scenario(layer) {
    this.layer = layer;
    this.level = 0;
    this.blocks = [];
    this.size = layer.size;
    this.init();
}

Scenario.prototype = {
    init: function () {
        var layer = this.layer,
            space = this.layer.space,
            width = this.size.width,
            height = this.size.height,
            t = height-50,
            r = width-10,
            b = 100,
            l = 10,
            walls = [
                // top
                new Wall(cc.rect(l, t, r, height-t)),
                // bottom
                new Wall(cc.rect(l, 0, r, b)),
                // left
                new Wall(cc.rect(0, 0, l, height)),
                // right
                new Wall(cc.rect(r, 0, width-r, height))
            ];
        
        // top
        new Boundary(space, cp.v(l, t), cp.v(r, t));
        // bottom
        new Boundary(space, cp.v(l, b), cp.v(r, b), true);
        // left
        new Boundary(space, cp.v(l, b), cp.v(l, t));
        // right
        new Boundary(space, cp.v(r, b), cp.v(r, t));
        
        walls.forEach(function (wall) {
            //layer.addChild(wall, 1000);
        });
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