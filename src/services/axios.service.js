import axios from "axios";
//import Vue from "vue";

const AxiosService = {
  async fetch(url) {
    return new Promise(function(resolve) {
      axios.get(url+"/frontend/getAllDevices", {timeout: 5000})
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        console.log("fetch error: ",error);
        resolve({error});
      })
    });
  },
  async update(url,name,mac) {
    return new Promise(function(resolve) {
      let payload={
        params: {
          device: {
            current_name: name,
            mac_address: mac
          }
        }
      };
      /*let config={
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      };*/
      axios.post(url+"/frontend/configureDevice",payload)
      .then(function () {
        resolve({});
      })
      .catch(function (error) {
        console.log("update error: ",error);
        resolve({error});
      })
    });
  },
};

export { AxiosService };
