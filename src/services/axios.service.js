import axios from "axios";
//import Vue from "vue";

const AxiosService = {
  async fetch(ip,port) {
    return new Promise(function(resolve) {
      axios.get('http://'+ip+":"+port+"/frontend/getAllDevices", {timeout: 5000})
      .then(function (response) {
        resolve([response.data,response.data.length]);
      })
      .catch(function (error) {
        console.log("fetch error: ",error);
        resolve({error});
      })
    });
  },
  async update(ip,port,name,mac) {
    return new Promise(function(resolve) {
      let payload={
        params: {
          device: {
            NewHostName: name,
            Mac: mac
          }
        }
      };
      /*let config={
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      };*/
      axios.post('http://'+ip+":"+port+"/frontend/configureDevice",payload)
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
