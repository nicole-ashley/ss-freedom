import {ApiService} from './api-service';

export class Field {
  protected element: HTMLElement;
  private debounceTimer;

  private apiService: ApiService;
  private setTimeout;
  private clearTimeout;

  constructor(
    element: HTMLElement,
    apiService: ApiService = null,
    setTimeout = window.setTimeout.bind(window),
    clearTimeout = window.clearTimeout.bind(window)
  ) {
    this.element = element;
    this.apiService = apiService || new ApiService();
    this.setTimeout = setTimeout;
    this.clearTimeout = clearTimeout;
  }

  get value(): any {
    throw 'Value getter is not implemented.';
  }

  protected onChanged() {
    if (this.debounceTimer) {
      this.clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = this.setTimeout(() => this.updateCmsWithLatestData(), 1000);
  }

  private async updateCmsWithLatestData() {
    const object = this.getObjectDataForFieldElement();
    const data = {};
    data[this.getConfiguration().name] = this.value;
    await this.apiService.updateObject(object.class, object.id, data);
  }

  private getConfiguration() {
    return JSON.parse(this.element.dataset.ssFreedomField);
  }

  private getObjectDataForFieldElement() {
    const objectElement = <HTMLElement>this.element.closest('[data-ss-freedom-object]');
    const configuration = JSON.parse(objectElement.dataset.ssFreedomObject);
    return {
      class: configuration.class,
      id: configuration.id
    }
  }
}
