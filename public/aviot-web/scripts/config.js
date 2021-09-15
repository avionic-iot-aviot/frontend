var JANUS_SERVER_ENDPOINT=getQueryVariable('janus_url')+"/janus";
var WSS_ENDPOINT=getQueryVariable('wss_url');

//var JANUS_SERVER_ENDPOINT = 'http://13.48.71.129:30464/janus'
//var WSS_ENDPOINT = 'http://13.48.71.129:31015'

console.log(JANUS_SERVER_ENDPOINT);
console.log(WSS_ENDPOINT);

frontendId=uuidv4();