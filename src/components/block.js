var Block = cc.PhysicsSprite.extend({
    ctor: function (filename, p, space) {
        this._super(filename, cc.rect(0,0,50,50));
        
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
        
        var scaleUp = cc.scaleBy(0.5, 10, 10).easing(cc.easeIn(2.0));
        
        this.runAction(scaleUp);
    },
    down: function () {
        
        var down = cc.moveBy(0.5, cc.p(0 , -75)).easing(cc.easeIn(2.0));
        
        this.runAction(down);
        
        
        
        // check gameover
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