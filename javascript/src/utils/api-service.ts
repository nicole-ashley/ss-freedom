const API_BASE = 'api/ssfreedom';

export class ApiService {
  private fetch: (input: string, init: RequestInit) => Promise<Response>;

  constructor(_fetch = fetch.bind(window)) {
    this.fetch = _fetch;
  }

  async getOptionsForm(className, id) {
    const response = await this.fetch(this.apiUrlFor('getOptionsForm') + `?class=${className}&id=${id}`, {
      method: 'GET',
      credentials: 'include'
    });
    return await response.text();
  }

  async updateObject(className, id, data) {
    const response = await this.fetch(this.apiUrlFor('updateObject'), {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify({class: className, id, data})
    });
    return await response.text();
  }

  async getLinkList() {
    const response = await this.fetch(this.apiUrlFor('getLinkList'), {
      method: 'GET',
      credentials: 'include'
    });
    return await response.json();
  }

  private apiUrlFor(endpoint) {
    return `${API_BASE}/${endpoint}`;
  }
}
