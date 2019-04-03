export class ApiService {
  private fetch: (input: string, init: RequestInit) => Promise<Response>;

  constructor(_fetch = fetch.bind(window)) {
    this.fetch = _fetch;
  }

  async updateObject(className, id, data) {
    const response = await this.fetch('api/ssfreedom/update_object', {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify({class: className, id, data})
    });
    console.log(await response.text());
  }
}
