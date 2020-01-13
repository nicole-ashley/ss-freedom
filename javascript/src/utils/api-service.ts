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
    const response = await this.fetch(this.apiUrlFor('updateObject'), {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify({class: className, id, data})
    });

    if (response.ok) {
      return await response.text();
    } else {
      throw response;
    }
  }

  async publishObject(className, id) {
    const response = await this.fetch(this.apiUrlFor('publishObject'), {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({class: className, id})
    });

    if (response.ok) {
      return await response.text();
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

  private apiUrlFor(endpoint) {
    return `${API_BASE}/${endpoint}`;
  }
}
