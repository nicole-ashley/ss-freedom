const API_BASE = 'api/ssfreedom';

export class ApiService {
  private fetch: (input: string, init: RequestInit) => Promise<Response>;

  constructor(_fetch = fetch.bind(window)) {
    this.fetch = _fetch;
  }

  async getObjectInfo(className, id) {
    const response = await this.fetch(this.apiUrlFor('getObjectInfo') + `?class=${className}&id=${id}`, {
      method: 'GET',
      credentials: 'include'
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw response;
    }
  }

  async getOptionsForm(className, id) {
    const response = await this.fetch(this.apiUrlFor('getOptionsForm') + `?class=${className}&id=${id}`, {
      method: 'GET',
      credentials: 'include'
    });

    if (response.ok) {
      return await response.text();
    } else {
      throw response;
    }
  }

  async updateObject(className, id, data) {
    const currentPage = this.currentPage();
    const response = await this.fetch(this.apiUrlFor('updateObject'), {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify({ class: className, id, data, currentPage })
    });

    if (response.ok) {
      return new DOMParser().parseFromString(await response.text(), 'text/html');
    } else {
      throw response;
    }
  }

  async publishObject(className, id) {
    const currentPage = this.currentPage();
    const response = await this.fetch(this.apiUrlFor('publishObject'), {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ class: className, id, currentPage })
    });

    if (response.ok) {
      return new DOMParser().parseFromString(await response.text(), 'text/html');
    } else {
      throw response;
    }
  }

  async getLinkList() {
    const response = await this.fetch(this.apiUrlFor('getLinkList'), {
      method: 'GET',
      credentials: 'include'
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw response;
    }
  }

  private currentPage() {
    const adminWidget = this.getAdminWidget();
    return {
      class: adminWidget.getAttribute('page-class-name'),
      id: adminWidget.getAttribute('page-id')
    };
  }

  private apiUrlFor(endpoint) {
    const cmsEditLink = this.getAdminWidget().getAttribute('cms-edit-link');
    const serverBase = cmsEditLink.replace(/(?<=\.[^\/]+)\/admin\/pages\/.*$/i, '');
    return `${serverBase}/${API_BASE}/${endpoint}`;
  }

  private getAdminWidget(): HTMLElement {
    return document.querySelector('ss-freedom-admin-widget');
  }
}
