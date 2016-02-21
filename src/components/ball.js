var Ball = cc.PhysicsSprite.extend({
    ctor: function (filename, p, space) {
        this._super(filename);
        
        var sprite = this,
            size = this.getContentSize(),
            body = new cp.Body(50, cp.momentForBox(50, size.width, size.height)),
            phBody = space.addBody(body),
            shape = new cp.BoxShape(phBody, size.width, size.height),
            phShape = space.addShape(shape);
        
        phBody.p = p;
        
        phShape.setElasticity(1);
        phShape.setFriction(0);
        phShape.setCollisionType(2);
        
        this.setBody(phBody);
        this.setRotation(0);
        
        phShape.stop = function () {
            
            console.log("Stop");
            console.log("body ",phBody);
            sprite.setRotation(0);
            
            phBody.w = 0;
            phBody.vx = 0;
            phBody.vy = 0;
            phBody.p.y = 13;
            //phBody.setDynamic(true);
        };
        
    }
});