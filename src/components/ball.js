var Ball = cc.PhysicsSprite.extend({
    ctor: function (filename, p, space) {
        this._super(filename);
        
        var size = this.getContentSize(),
            body = new cp.Body(50, cp.momentForBox(50, size.width, size.height)),
            phBody = space.addBody(body),
            shape = new cp.BoxShape(phBody, size.width, size.height),
            phShape = space.addShape(shape);
        
        phBody.p = p;
        
        phShape.setElasticity(1);
        phShape.setFriction(0);
        phShape.setCollisionType(0);
        
        this.setBody(phBody);
        this.setRotation(0);
    }
});