var Ball = cc.PhysicsSprite.extend({
    ctor: function (filename, p, space) {
        this._super(filename, cc.rect(0,0,25,25));
        
        var size = this.getContentSize(),
            body = new cp.Body(50, cp.momentForBox(50, size.width, size.height)),
            phBody = space.addBody(body),
            shape = new cp.CircleShape(phBody, size.width/2, cc.p(0,0)),
            phShape = space.addShape(shape);
        
        phBody.p = p;
        
        phShape.setElasticity(1);
        phShape.setFriction(0);
        phShape.setCollisionType(0);
        
        this.setBody(phBody);
        this.setRotation(0);
    }
});