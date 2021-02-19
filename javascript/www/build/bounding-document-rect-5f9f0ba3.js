class BoundingDocumentRect {
  static for(element) {
    const rect = BoundingDocumentRect.cloneRect(element.getBoundingClientRect());
    return BoundingDocumentRect.addViewportOffset(rect);
  }
  static cloneRect(original) {
    const clone = {
      height: original.height,
      width: original.width,
      x: original.x,
      y: original.y,
      top: original.top,
      right: original.right,
      bottom: original.bottom,
      left: original.left,
      toJSON: original.toJSON
    };
    return clone;
  }
  static addViewportOffset(rect) {
    BoundingDocumentRect.horizontalProperties.forEach(name => rect[name] += window.scrollX);
    BoundingDocumentRect.verticalProperties.forEach(name => rect[name] += window.scrollY);
    return rect;
  }
}
BoundingDocumentRect.horizontalProperties = ['x', 'left', 'right'];
BoundingDocumentRect.verticalProperties = ['y', 'top', 'bottom'];

export { BoundingDocumentRect as B };
