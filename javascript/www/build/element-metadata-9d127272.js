class ElementMetadata {
  static getElementConfiguration(element) {
    const data = JSON.parse(element.getAttribute('ss-freedom-data'));
    data.name = element.getAttribute('ss-freedom-field');
    return data;
  }
  static getObjectData(element) {
    const data = JSON.parse(element.getAttribute('ss-freedom-data'));
    data.uid = element.getAttribute('ss-freedom-object');
    data.class = element.getAttribute('ss-freedom-class');
    data.id = element.getAttribute('ss-freedom-id');
    return data;
  }
  static getClosestObjectElement(element) {
    return element.closest('[ss-freedom-object]');
  }
  static getDataForClosestObjectElement(element) {
    const objectElement = ElementMetadata.getClosestObjectElement(element);
    return ElementMetadata.getObjectData(objectElement);
  }
  static getDataForClosestRelation(element) {
    const relationElement = element.closest('[ss-freedom-relation]');
    const data = Object.assign({}, ElementMetadata.getDataForClosestObjectElement(relationElement), JSON.parse(relationElement.getAttribute('ss-freedom-data')));
    data.relation = relationElement.getAttribute('ss-freedom-relation');
    return data;
  }
}

export { ElementMetadata as E };
