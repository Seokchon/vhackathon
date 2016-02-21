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
            
            
        debugger;    
        function makeStatic(v1, v2) {
            var shape = new cp.SegmentShape(space.staticBody, v1, v2, 10);
            
            shape.setElasticity(1);
            shape.setFriction(0);
            shape.setCollisionType(1);
            
            space.addStaticShape(shape);
        }
        
        // top
        makeStatic(cp.v(0, height), cp.v(width, height));
        // bottom
        makeStatic(cp.v(0, 0), cp.v(width, 0));
        // left
        makeStatic(cp.v(0, 0), cp.v(0, height));
        // right
        makeStatic(cp.v(width, height), cp.v(width, height));
    },
    next: function () {
        this.level++;
        
        var self = this,
            space = this.layer.space,
            topLineHeight = this.size.height +25,
            step = 100,
            current = this.blocks.length;
        
        for (var x = (this.level % 2) ? 50 : 100; x < this.size.width; x += step) {
            
            // random creation and limit creation
            if (Math.random() > .5) {
            
                this.addBlock(new Block(res.Orange_png, cc.p(x, topLineHeight), space));
            }
        }
        
        if (current == this.blocks.length) {
            var rx = ((this.level % 2) ? 50 : 100) + (((~~(Math.random() * 10)) % 3) * step);
            this.addBlock(new Block(res.Orange_png, cc.p(rx, topLineHeight), space));
        }
        
        this.blocks.map(function (block) {
            block.down();
        });
    },
    addBlock: function (block) {
        this.blocks.push(block);
        this.layer.addChild(block);
    },
    destroyBlock: function (block) {
        // TODO Destroy block
    }
};