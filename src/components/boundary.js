
function Boundary(space, v1, v2, reset) {
    
    var shape = new cp.SegmentShape(space.staticBody, v1, v2, 0);
    
    shape.setElasticity(1);
    shape.setFriction(0);
    
    space.addStaticShape(shape);
    
    if (!!reset) {
        shape.reset = true;
    }
    
    return shape;
}