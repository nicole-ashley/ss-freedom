export class BoundingDocumentRect {
  static horizontalProperties = ['x', 'left', 'right'];
  static verticalProperties = ['y', 'top', 'bottom'];

  static for(element: Element): DOMRect {
    const rect = BoundingDocumentRect.cloneRect(element.getBoundingClientRect());
    return BoundingDocumentRect.addViewportOffset(rect);
  }

  static cloneRect(original: DOMRect): DOMRect {
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

  static addViewportOffset(rect: DOMRect): DOMRect {
    BoundingDocumentRect.horizontalProperties.forEach(name => rect[name] += window.scrollX);
    BoundingDocumentRect.verticalProperties.forEach(name => rect[name] += window.scrollY);
    return rect;
  }
}
