export class ElementMetadata {
  public static getElementConfiguration(element: HTMLElement) {
    const data = JSON.parse(element.getAttribute('ss-freedom-data'));
    data['name'] = element.getAttribute('ss-freedom-field');
    return data;
  }

  public static getObjectData(element: HTMLElement) {
    const data = JSON.parse(element.getAttribute('ss-freedom-data'));
    data['uid'] = element.getAttribute('ss-freedom-object');
    data['class'] = element.getAttribute('ss-freedom-class');
    data['id'] = element.getAttribute('ss-freedom-id');
    return data;
  }

  public static getObjectForFieldElement(element: HTMLElement): HTMLElement {
    return element.closest('[ss-freedom-object]');
  }

  public static getObjectDataForFieldElement(element: HTMLElement) {
    const objectElement = ElementMetadata.getObjectForFieldElement(element);
    const data = ElementMetadata.getObjectData(objectElement);
    return {
      uid: data.uid,
      class: data.class,
      id: data.id
    };
  }
}
