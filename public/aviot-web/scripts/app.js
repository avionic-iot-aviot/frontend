var listenerStatus = false
var latitude, longitude, altitude, relative_altitude
var rtt=0;
var circleTest=false;
var rotation=0;
var mode=-1;
var listInterval=null;
var waypoints,real_waypoints;

/**
 * Events:
 * - connect
 * - battery
 * - state
 * - global_position
 * - rel_alt
 */



var mavros = new AviotCopter(getQueryVariable('copter_id'), getQueryVariable('fccs_id'), '', WSS_ENDPOINT)

mavros.on('connect', function(){
  console.log('connected')
  $('#video').append('<video class="rounded centered" id="remotevideo" width="100%" height="100%" autoplay playsinline/>')
  setTimeout(() => {
    mavros.streamRate(0,1,true);
    doListFence();
  }, 2000);
  setInterval(() => {
    rttTest();
  }, 5000);
})
mavros.on('state', onStateUpdate)
mavros.on('battery', updateBatteryInfo)
mavros.on('global_position', onGlobalPosUpdate)
mavros.on('relative_altitude', onRelAltUpdate)
mavros.on('compass_hdg', onCompassUpdate)
mavros.on('waypoints', onWaypoints)
mavros.on('waypoints_real', onWaypointsReal)
mavros.on('error', onError)
mavros.on('streaming', onStreaming)
mavros.on('video_room', onVideoRoom)
mavros.on('rtt_resp', onRttResp)
mavros.on('fence', onFence)

function onError(err){
  //handle errors
  console.error(err)
}

function doListFence() {
  if (listInterval) {
    clearInterval(listInterval);
    listInterval=null;
  }
  if (polygon.length==0)
    mavros.listFence(frontendId);
  listInterval=setInterval(() => {
    if (polygon.length==0)
      mavros.listFence(frontendId);
  }, 10000);
}

function onStreaming(msg){
  startJanusStream(msg, $('#remotevideo'));
console.log(msg)
}
function onVideoRoom(msg){
  console.log(msg)
  startJanusVideoRoom(msg, $('#remotevideo'), () => {
    mavros.stopVideoRoom()
  })
}
function onRttResp(msg){
  if (msg.frontendId!=frontendId)
    return;

  rtt_ts2=Date.now()
  console.log('rtt_resp: '+rtt_ts2);

  rtt=rtt_ts2-rtt_ts1;
  console.log('rtt: '+(rtt));

  $('#rtt').html(rtt);
}
function onFence(msg){
  if (msg.data.frontendId!=frontendId)
    return;

  if (msg.action=="set") {
    /*areas.forEach(function(a, index){
      if (a.temp_id==msg.data.temp_id) {
        a.id=msg.res.polygon_id;
      }
    });
    updateTable();*/
    doListFence();
  }
  else if (msg.action=="get") {
    clearMap();

    msg.res.points.forEach((p, index) => {
      addMarker(p.x,p.y);
    });
    addArea2(msg.data.fenceId,msg.res.mode);
  }
  else if (msg.action=="list") {
    // remove areas that are not present in the fence list
    areas.reduceRight(function(acc, a, index, object) {
      if (a.id>=0 && !msg.res.polygon_ids.includes(a.id)) {
        a.area.setMap(null);
        object.splice(index,1);
      }
    },[]);
    updateTable();

    // send getFence command for only new areas in the fence list
    let ids=areas.map((a)=>a.id);
    msg.res.polygon_ids.forEach((fenceId, index) => {
      if (!ids.includes(fenceId))
        mavros.getFence(fenceId, frontendId);
    });
  }
}

function onGlobalPosUpdate(msg){
  latitude = msg.latitude
  longitude = msg.longitude
  altitude = msg.altitude
  $('#lat').html(latitude)
  $('#lng').html(longitude)
  $('#alt').html(Math.round(altitude * 10) / 10)
  updateDronePos(latitude,longitude,getQueryVariable('copter_id'),true,rotation)
}
function onWaypoints(msg){
  waypoints=msg.waypoints;
  refreshWaypoints(waypoints,real_waypoints)
}
function onWaypointsReal(msg){
  real_waypoints=msg.waypoints;
}

function onRelAltUpdate(msg){
  if(Math.round(msg) > 0){
    $('#land').attr('disabled', false)
    //$('#set-alt').attr('disabled', true)
  }
  else if(Math.round(msg) === 0){
    $('#land').attr('disabled', true)
    //if(latitude && longitude){
    //  $('#set-alt').attr('disabled', false)
    //}
  }
  relative_altitude = Math.round(msg * 10) / 10;
  $('#rel-alt').html(relative_altitude);
}
function onCompassUpdate(msg) {
  rotation=msg;
}
function onStateUpdate(data) {
  mode=data.mode;
  let className = data.armed ? 'success' : 'danger'
  var info = "Status: " + (data.armed ? 'ARMED' : 'DISARMED')
  info+="&nbsp;&nbsp;&nbsp;Mode: "+data.mode;
  info = '<div class="alert alert-' + className +'" role="alert">'+ info +'</div>'
  $('#status').html(info + "\n")
  if (data.armed && !listenerStatus){
    console.log('Enabling listener');
    document.addEventListener('keydown',press)
    listenerStatus = true
  } else if (!data.armed && listenerStatus){
    console.log('Disabling listener');
    document.removeEventListener('keydown', press)
    listenerStatus = false
  }
}
function updateBatteryInfo (data) {
  let className = ''
  let percentage = Math.round(data.percentage * 100)
  if(percentage > 60) {
    className = 'success'
  } else if (percentage <=60 && percentage > 20) {
    className = 'warning'
  } else className = 'danger'

  var info = "Battery: " + Math.round(data.percentage * 100)+ "%, "+ Math.round(data.voltage * 100) / 100 + "V / " + Math.round(data.current * 10 * -1) / 10 + "A"
  info = '<div class="alert alert-' + className +'" role="alert">'+ info +'</div>'
  $('#battery').html(info + "\n")
}


function armThrottle () {
  console.log('arming mavros');
  mavros.armThrottle()
}
function setAlt() {
  console.log('taking off');
  altitude_from_input = Number($('#altitude').val());
  mavros.takeoff(latitude, longitude, altitude + altitude_from_input);
}
function rttTest() {
  rtt_ts1=Date.now()
  console.log('rtt_test: '+rtt_ts1);
  mavros.rttTest(frontendId)
}

function land(){
  mavros.land(latitude, longitude, 0)
}
function changeMode(){
  mavros.mode(81,'GUIDED')
}


function startStreaming(){
  mavros.startStreaming()
  $('#streaming').html('STOP STREAMING')
  $('#streaming').attr('onclick', 'stopStreaming()')
  $('#streaming').attr('class', 'btn btn-warning')

}
function stopStreaming(){
  stopJanusStream();
  mavros.stopStreaming()
  $('#streaming').html('START STREAMING')
  $('#streaming').attr('onclick', 'startStreaming()')
  $('#streaming').attr('class', 'btn btn-success')

}

function startVideoRoom(){
  mavros.startVideoRoom()

  $('#videoroom').html('STOP VIDEO ROOM')
  $('#videoroom').attr('onclick', 'stopVideoRoom()')
  $('#videoroom').attr('class', 'btn btn-warning')
}
function stopVideoRoom(){
  stopJanusVideoRoom()
  
  $('#videoroom').html('START VIDEO ROOM')
  $('#videoroom').attr('onclick', 'startVideoRoom()')
  $('#videoroom').attr('class', 'btn btn-success')
}
function circleStart(){
  circleTest=true;
  $('#circle-start').addClass("d-none");
  $('#circle-stop').removeClass("d-none");
}
function circleStop(){
  circleTest=false;
  direction = {
    x: 0,
    y: 0,
    z: 0,
    _x: 0,
    _y: 0,
    _z: 0
  }
  $('#circle-start').removeClass("d-none");
  $('#circle-stop').addClass("d-none");
}


$('#armThrottle').click(armThrottle)
$('#set-alt').click(setAlt)
$('#land').click(land)
$('#change-mode').click(changeMode)


document.addEventListener('keydown',press)
var direction = {
  x: 0,
  y: 0,
  z: 0,
  _x: 0,
  _y: 0,
  _z: 0
}


/**
go_forward_cmd (0.0,5.0,0.0);
go_behind_cmd (0.0,-5.0,0.0);
go_left_cmd (-5.0,0.0,0.0);
go_right_cmd (5.0,0.0,0.0);
go_up_cmd (0.0,0.0,-5.0);
go_down_cmd (0.0,0.0,5.0);
*/
let publish = false
function press(e){
  if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */){
    direction = {
      x: 0.5,
      y: 0,
      z: 0,
      _x: 0,
      _y: 0,
      _z: 0
    }
  }
  if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */){
    direction = {
      x: 0,
      y: 0.5,
      z: 0,
      _x: 0,
      _y: 0,
      _z: 0
    }
  }
  if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */){
    direction = {
      x: -0.5,
      y: 0,
      z: 0,
      _x: 0,
      _y: 0,
      _z: 0
    }
  }
  if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */){
    direction = {
      x: 0,
      y: -0.5,
      z: 0,
      _x: 0,
      _y: 0,
      _z: 0
    }
  }
  if (e.keyCode === 81 /* rotate left */){
    direction = {
      x: 0,
      y: 0,
      z: 0,
      _x: 0,
      _y: 0,
      _z: -0.5
    }
  }
  if (e.keyCode === 69 /* rotate right */){
    direction = {
      x: 0,
      y: 0,
      z: 0,
      _x: 0,
      _y: 0,
      _z: 0.5
    }
  }
  if (e.keyCode === 84 /* T */){
    direction = {
      x: 0,
      y: 0,
      z: -0.5,
      _x: 0,
      _y: 0,
      _z: 0
    }
  }
  if (e.keyCode === 71 /* G */){
    direction = {
      x: 0,
      y: 0,
      z: 0.5,
      _x: 0,
      _y: 0,
      _z: 0
    }
  }
  publish = true
}

$(window).blur(function(){
  publish = false
})
$(window).focus(function(){
  publish = true
})

document.addEventListener('keyup',release)
function release(e){
  direction = {
    x: 0,
    y: 0,
    z: 0,
    _x: 0,
    _y: 0,
    _z: 0
  }
  publish = false
  console.log(publish);
}

var lastMsg = direction
var r=0,r2=0;
setInterval(function(){
  if(listenerStatus && (publish || circleTest)){
    if (!circleTest) {
      if(lastMsg && lastMsg.x === 0 && lastMsg.y === 0 && lastMsg.z === 0 &&
        lastMsg._x === 0 && lastMsg._y === 0 && lastMsg._z === 0 &&
        direction.x === 0 && direction.y === 0 && direction.z === 0 &&
        direction._x === 0 && direction._y === 0 && direction._z === 0 ){
        lastMsg = direction
        return
      }
    }
    else {
      r+=0.021;
      r2+=0.0628;
      if (r>=Math.PI*2) r-=Math.PI*2;
      if (r2>=Math.PI*2) r2-=Math.PI*2;
      direction.x=0.5*Math.cos(r);
      direction.y=0.5*Math.sin(r);
      direction.z=0.5*Math.sin(r2);
    }

    //console.log('Publishing vel');
    const { x, y, z, _x, _y, _z} = direction
    mavros.cmdVel({x, y, z}, {x: _x, y: _y, z: _z})
    lastMsg = direction

  }
}, 100)

const refreshRate = 100;
const output = document.getElementById('output');
setInterval(getGamepadState, refreshRate);


function getGamepadState() {
    // Returns up to 4 gamepads.
    const gamepads = navigator.getGamepads();
    // We take the first one, for simplicity
    const gamepad = gamepads[0];
    // Escape if no gamepad was found
    if (!gamepad) {
        //console.log('No gamepad found.');
        return;
    }
    // Filter out only the buttons which are pressed
    const pressedButtons = gamepad.buttons
        .map((button, id) => ({id, button}))
        .filter((btn) => !!btn.button.pressed);
    // Print the pressed buttons to our HTML
    if(!pressedButtons.length){
      direction = {
        x: 0,
        y: 0,
        z: 0
      }
    }
    for (const button of pressedButtons) {
        if (button.id === 2 /* ctrl */){
          direction = {
            x: 0,
            y: 0,
            z: 0
          }
          land()
          return
        }
        if(button.id === 7){ //r2
          direction.x = -1
        }
        if (button.id === 12 /* up arrow */){
          direction.y = 1
        }
        if (button.id === 15 /* right */){
          direction.x = 1
        }
        if (button.id === 13 /* down */){
          direction.y = -1
        }
        if (button.id === 14 /* left */){
          direction.x = -1
        }
        if (button.id === 7 /* r2 */ || button.id === 0 /* x */){
          direction.z = 1
        }
        if (button.id === 6 /* ctrl */){
          direction.z = -1
        }
    }
}
