class AviotCopter {

    constructor(copterId, fccsId, token, endpoint){
      this.copterId = copterId
      this.fccsId = fccsId
      this.callbacks = {}
      this._onConnect = this._onConnect.bind(this)
      this.__emit = this.__emit.bind(this)

      this.socket = io(endpoint)
      this.socket.on('connect', this._onConnect)
      this.socket.on('error', this._onError)
    }

    getCopterId(){
      return this.copterId
    }
    on(event, cb){
      if(!this.callbacks[event]){
        this.callbacks[event] = [];
      }
      this.callbacks[event].push(cb)
    }

    _emit(event, data){
      let cbs = this.callbacks[event]
      if(cbs){
          cbs.forEach(cb => cb(data))
      }
    }
    __emit(event){
      return function(data) {
        this._emit(event, data)
        console.log(data)
      }.bind(this)
    }
    _onError(error){
      console.log(error)
      this._emit('error', error)
    }
    _onConnect(){
      this.socket.emit('connect_to_copter', this.copterId)
      this.socket.emit('connect_to_copter', this.fccsId)
      this.socket.on(`/${this.fccsId}/battery`, this.__emit('battery'))
      this.socket.on(`/${this.fccsId}/state`, this.__emit('state'))
      this.socket.on(`/${this.fccsId}/global_position/global`, this.__emit('global_position'))
      this.socket.on(`/${this.fccsId}/global_position/rel_alt`, this.__emit('relative_altitude'))
      this.socket.on(`/${this.fccsId}/global_position/compass_hdg`, this.__emit('compass_hdg'))
      this.socket.on(`/${this.fccsId}/home_position`, this.__emit('home_position'))
      this.socket.on(`/${this.fccsId}/mission/waypoints`, this.__emit('waypoints'))
      this.socket.on(`/${this.fccsId}/mission/waypoints_real`, this.__emit('waypoints_real'))
      this.socket.on(`/${this.copterId}/volume`, this.__emit('volume'))
      this.socket.on(`/${this.copterId}/streaming`, this.__emit('streaming'))
      this.socket.on(`/${this.copterId}/video_room`, this.__emit('video_room'))
      this.socket.on(`/${this.copterId}/rtt_resp`, this.__emit('rtt_resp'))
      this.socket.on(`/${this.fccsId}/fence`, this.__emit('fence'))
      this._emit('connect', {status: 'connected'})
    }
    armThrottle(){
      this.socket.emit('arm', {copterId: this.fccsId})
    }
    takeoff(lat, lng, alt) {
      console.log('taking off');
      this.socket.emit('takeoff', {copterId: this.fccsId, latitude: lat, longitude: lng, altitude: alt})
    }
    land(lat, lng, alt){
      this.socket.emit('land', {copterId: this.fccsId, latitude: lat, longitude: lng, altitude: alt} )
    }
    servo(number, command) {
      console.log('sending servo command');
      this.socket.emit('servo', {copterId: this.copterId, action: command, data: { number }})
    }
    cmdVel(linear={x:0, y:0, z:0}, angular={x:0, y:0, z:0}){
      this.socket.emit('cmd_vel', {copterId: this.fccsId, linear: linear, angular: angular})
    }
    startStreaming(){
      console.log("Sending start streaming")
      this.socket.emit('video_stream', {copterId: this.copterId, action: 'start'})
    }
    stopStreaming(){
      console.log("Sending stop streaming")
      this.socket.emit('video_stream', {copterId: this.copterId, action: 'stop'})
    }
    rttTest(frontendId){
      console.log("Sending RTT test")
      this.socket.emit('rtt_test', {copterId: this.copterId, frontendId})
    }
    startVideoRoom(){
      console.log("Sending start video room")
      this.socket.emit('video_room', {copterId: this.copterId, action: 'start'})
    }
    stopVideoRoom(){
      console.log("Sending stop video room")
      this.socket.emit('video_room', {copterId: this.copterId, action: 'stop'})
    }
    setVolume(volume){
      console.log("Sending volume")
      this.socket.emit('volume', {copterId: this.copterId, data: { volume }})
    }
    streamRate(stream_id, message_rate, on_off){
      console.log("Sending stream rate")
      this.socket.emit('stream_rate', {copterId: this.fccsId, data: { stream_id, message_rate, on_off } })
    }
    mode(base_mode, custom_mode){
      console.log("Sending mode")
      this.socket.emit('mode', {copterId: this.fccsId, data: { base_mode, custom_mode } })
    }

    missionPush(data, frontendId){
      console.log("Sending mission push event")
      this.socket.emit('mission', { copterId: this.fccsId, action: 'push', data: { ...data, frontendId } })
    }
    missionClear(data, frontendId){
      console.log("Sending mission clear event")
      this.socket.emit('mission', { copterId: this.fccsId, action: 'clear', data: { ...data, frontendId } })
    }
    returnToHome(data, frontendId){
      console.log("Sending return to home event")
      this.socket.emit('mission', { copterId: this.fccsId, action: 'return', data: { ...data, frontendId } })
    }
    setFence(data, frontendId){
      console.log("Sending set fence event")
      this.socket.emit('fence', { copterId: this.fccsId, action: 'set', data: { ...data, frontendId } })
    }
    delFence(fenceId, frontendId){
      console.log("Sending delete fence event")
      this.socket.emit('fence', { copterId: this.fccsId, action: 'delete', data: { fenceId, frontendId } })
    }
    resetFence(frontendId){
      console.log("Sending reset fence event")
      this.socket.emit('fence', { copterId: this.fccsId, action: 'reset', data: { frontendId } })
    }
    listFence(frontendId) {
      this.socket.emit('fence', { copterId: this.fccsId, action: 'list', data:  { frontendId }})
    }
    getFence(fenceId, frontendId) {
      this.socket.emit('fence', { copterId: this.fccsId, action: 'get', data: { fenceId, frontendId } })
    }
  }
