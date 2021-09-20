let map;
let polygon = []
let areas = []
let area
var allow = true
var droneMarker = null


var colors = {
  allow: {
    stroke: 'rgb(92,184,92)',
    background: 'rgb(92,184,92, 0.8)'
  },
  deny: {
    stroke: 'rgb(217,83,79)',
    background: 'rgb(217,83,79, 0.8)'
  }
}
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.5111591, lng: 15.0833803 },
    zoom: 13,
  });



  map.addListener('click', onClick)
  $("#map").css('height', '50vh')
}
function isAllowed(){
  return $('#allow-area:checked').length
}

function addMarker(lat,lng) {
  let marker = new google.maps.Marker({
    position: {
      lat,
      lng
    },
    draggable: true,
    map,
    title: "Point " + (polygon.length+1),
  })
  
  marker.addListener('drag', onDrag)

  polygon.push(marker)
  
}
function onDrag(evt) {
  refreshArea();
}
function onClick(evt) {
  addMarker(evt.latLng.lat(),evt.latLng.lng());
  refreshArea()
}
function updateDronePos(lat, lng, droneId, center, rotation){
  if(droneMarker === null) {
    droneMarker = new google.maps.Marker({
      position: {
        lat: lat,
        lng: lng
      },
      draggable: false,
      map,
      title: droneId,
    })
  }
  
  droneMarker.setIcon({
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    scale: 7,
    rotation: rotation
  });

  droneMarker.setPosition(new google.maps.LatLng(lat, lng))
  center && setCenter(lat, lng)
}
function setCenter(lat, lng){
  map.setCenter(new google.maps.LatLng(lat, lng))
}
function refreshArea(){
  if(area){
    area.setMap(null)
  }
  area = new google.maps.Polygon({
    fillColor: isAllowed() ? colors.allow.background : colors.deny.background,
    strokeColor: isAllowed() ? colors.allow.stroke : colors.deny.stroke,
    paths: polygon.map(m => new google.maps.LatLng(m.position.lat(), m.position.lng()))
  });
  area.setMap(map)
}
function addPolygon(){
  areas.push(polygon)
}
function removeMarkers(){
  polygon.forEach((m) => m.setMap(null))
  polygon = []
  refreshArea()
}

function removePolyline(index){
  if (areas[index].id<0) return;

  let removed = areas.splice(index, 1);
  console.log(removed)
  removed[0].area.setMap(null)
  updateTable();
  mavros.delFence(removed[0].id,frontendId)

}
function clearMap() {
  polygon.forEach((m) => m.setMap(null))
  polygon = []
  refreshArea()
}
function updateTable(){
  if (areas.length==0) {
    $('#polygons-table').html('<tr><td colspan="4" class="text-center">No Data</td></tr>');
  }
  else {
    let table = ''
    areas.forEach(function(a, index){

      let td = [
        '<td>'+ (a.id>=0?(a.id+1):"") +'</td>',
        '<td>'+ a.polygon.length +'</td>',
        '<td><span class="text-'+ (a.isAllowed ? 'success' : 'danger') + ' ">' + (a.isAllowed ? 'Allow' : 'Deny') + '</span></td>',
        '<td><Button class="btn btn-sm btn-warning" onclick="removePolyline('+ index +')">remove</Button></td>'
      ]
      table += '<tr>' + td.reduce((acc, value) => acc + value, '') + '</tr>'
    })

    $('#polygons-table').html(table)
  }
}

function makeArea() {
  if (polygon.length==0) return null;

  refreshArea()
  let temp_id=uuidv4();
  polygon.forEach(m => m.setMap(null))

  let res = {
    id: -1,
    temp_id: temp_id,
    area: area,
    polygon: polygon,
    isAllowed: isAllowed()
  };

  area = undefined
  polygon = []

  return res;
}
function sendArea(area) {
  let payload = {
    mode: area.isAllowed ? 'ALLOW' : 'DENY',
    points: area.polygon.map(m => ({x: m.position.lat(), y: m.position.lng(), z: 0 })),
    temp_id: area.temp_id,
    frame: 0
  }
  mavros.setFence(payload,frontendId)
}
function addArea(){
  let area=makeArea();
  if (!area) return;

  areas.push(area);
  updateTable();

  sendArea(area);
}
function addArea2(id){
  let area=makeArea();
  if (!area) return;

  area.id=id;
  areas.push(area);
  updateTable();
}
function reset(){
  mavros.resetFence(frontendId)
  
  areas.forEach(function(a, index){
    a.area.setMap(null);
  });
  areas=[];
  updateTable();
}