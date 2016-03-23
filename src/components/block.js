var Block = cc.PhysicsSprite.extend({
    images: [res.yellow_png, res.green_png, res.red_png, res.grey_png],
    sprites : null,
    ctor: function (life, p, space) {
        //this._super(this.images[life-1], cc.rect(0,0,50,50));
        this._super(this.images[0], cc.rect(0,0,50,50));
        
        this.sprites = [];
        
        for(var i =1; i <life; i++){
            this.sprites[i] = new cc.Sprite(this.images[i], cc.rect(0,0,50,50));
            this.sprites[i].setPosition( cc.p(25,25) );
            this.addChild(this.sprites[i], i);
        }
        
        var sprite = this,
            size = this.getContentSize(),
            body = new cp.Body(Infinity, Infinity),
            phBody = space.addBody(body),
            shape = new cp.CircleShape(phBody, size.width/2, cc.p(0,0)),
            phShape = space.addShape(shape);
        
        phBody.p = p;
        
        sprite.fragilHandler = [];
        
        phShape.setElasticity(1);
        phShape.setFriction(0);
        phShape.setCollisionType(1);
        
        phShape.getBlockSprite = function () {
            return sprite;
        };
        
        this.setScale(0.1);
        this.setBody(phBody);
        this.setRotation(0);
        this.life = life;
        
        var scaleUp = cc.scaleBy(0.5, 10, 10).easing(cc.easeIn(2.0));
        
        this.runAction(scaleUp);
    },
    down: function () {
        
        var down = cc.moveBy(0.5, cc.p(0, -75)).easing(cc.easeIn(2.0));
        
        this.runAction(down);
        
        
        
        // check gameover
    },
    damage: function () {
        
        var brrr = cc.sequence(
            cc.moveBy(0.02, cc.p(3, 0)),
            cc.repeat(cc.sequence(cc.moveBy(0.05, cc.p(-6, 0)),cc.moveBy(0.05, cc.p(6, 0))),6),
            cc.moveBy(0.02, cc.p(-3, 0))
        );
        
        this.runAction(brrr);
        
        if (this.life > 0) {
            this.removeChild(this.sprites[this.life-1], true);
        }
        this.life--;
        
        return this.life;
    },
    onFragil: function (cb) {
        this.fragilHandler.push(cb);
    },
    fragil: function () {
        this.fragilHandler.forEach(function (handler) {
            handler();
        });
    }
});