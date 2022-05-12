export default class Services {
  constructor(_url) {
    this.url = _url;
  }

  fetchData() {
    return axios({ url: this.url, method: "GET" });
  }

  addData(data) {
    return axios({ url: this.url, method: "POST", data: data });
  }

  deleteData(id) {
    return axios({ url: this.url + id, method: "DELETE" });
  }

  updateData(id, data) {
    return axios({ url: this.url + id, method: "PUT", data: data });
  }
}
