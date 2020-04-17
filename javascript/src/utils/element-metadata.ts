export class ElementMetadata {
  public static getElementConfiguration(element: HTMLElement) {
    return JSON.parse(element.dataset.ssFreedomField);
  }

  public static getObjectData(element: HTMLElement) {
    return JSON.parse(element.dataset.ssFreedomObject);
  }

  public static getObjectDataForFieldElement(element: HTMLElement) {
    const objectElement = <HTMLElement>element.closest('[data-ss-freedom-object]');
    const data = this.getObjectData(objectElement);
    return {
      class: data.class,
      id: data.id
    }
  }
}
