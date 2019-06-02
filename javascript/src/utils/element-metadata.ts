export class ElementMetadata {
  public static getElementConfiguration(element: HTMLElement) {
    return JSON.parse(element.dataset.ssFreedomField);
  }

  public static getObjectDataForFieldElement(element: HTMLElement) {
    const objectElement = <HTMLElement>element.closest('[data-ss-freedom-object]');
    const configuration = JSON.parse(objectElement.dataset.ssFreedomObject);
    return {
      class: configuration.class,
      id: configuration.id
    }
  }
}
