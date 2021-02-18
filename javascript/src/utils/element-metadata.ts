export class ElementMetadata {
  public static getElementConfiguration(element: Element) {
    const data = JSON.parse(element.getAttribute('ss-freedom-data'));
    data.name = element.getAttribute('ss-freedom-field');
    return data;
  }

  public static getObjectData(element: Element) {
    const data = JSON.parse(element.getAttribute('ss-freedom-data'));
    data.uid = element.getAttribute('ss-freedom-object'); 
    data.class = element.getAttribute('ss-freedom-class');
    data.id = element.getAttribute('ss-freedom-id');
    return data;
  }

  public static getClosestObjectElement(element: Element): HTMLElement {
    return element.closest('[ss-freedom-object]');
  }

  public static getDataForClosestObjectElement(element: Element) {
    const objectElement = ElementMetadata.getClosestObjectElement(element);
    return ElementMetadata.getObjectData(objectElement);
  }

  public static getDataForClosestRelation(element: Element) {
    const relationElement = element.closest('[ss-freedom-relation]');
    const data = Object.assign(
      {},
      ElementMetadata.getDataForClosestObjectElement(relationElement),
      JSON.parse(relationElement.getAttribute('ss-freedom-data')),
    );
    data.relation = relationElement.getAttribute('ss-freedom-relation');
    return data;
  }
}
