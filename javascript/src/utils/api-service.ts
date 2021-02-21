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

  async deleteObject(className, id) {
    const currentPage = this.currentPage();
    const response = await this.fetch(this.apiUrlFor('deleteObject'), {
      method: 'DELETE',
      credentials: 'include',
      body: JSON.stringify({ class: className, id, currentPage })
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

  async addItemToList(className, id, relation, betweenIds = []) {
    const currentPage = this.currentPage();
    const response = await this.fetch(this.apiUrlFor('addItemToList'), {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ class: className, id, relation, betweenIds, currentPage })
    });

    if (response.ok) {
      return new DOMParser().parseFromString(await response.text(), 'text/html');
    } else {
      throw response;
    }
  }

  async removeItemFromList(className, id, relation, itemId) {
    const currentPage = this.currentPage();
    const response = await this.fetch(this.apiUrlFor('removeItemFromList'), {
      method: 'DELETE',
      credentials: 'include',
      body: JSON.stringify({ class: className, id, relation, itemId, currentPage })
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
    const adminWidget = document.querySelector('ss-freedom-admin-widget');
    return {
      class: adminWidget.getAttribute('page-class-name'),
      id: adminWidget.getAttribute('page-id')
    };
  }

  private apiUrlFor(endpoint) {
    return `${API_BASE}/${endpoint}`;
  }
}
