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

      this.rtt_sum=0
      this.rtt_count=0
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
      this.socket.on(`/${this.copterId}/streaming`, this.__emit('streaming'))
      this.socket.on(`/${this.copterId}/video_room`, this.__emit('video_room'))
      this.socket.on(`/${this.copterId}/rtt_resp`, (arg) => {
        this.rtt_ts2=Date.now()
        console.log('rtt_resp: '+this.rtt_ts2);

        this.rtt_sum+=this.rtt_ts2-this.rtt_ts1;
        this.rtt_count++;

        if (this.rtt_count<10)
          rttTest();
        else {
          console.log('avg: '+(this.rtt_sum/this.rtt_count));
          this.rtt_sum=0
          this.rtt_count=0
        }
      });
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
    rttTest(){
      this.rtt_ts1=Date.now()
      console.log('rtt_test: '+this.rtt_ts1);
      this.socket.emit('rtt_test', {copterId: this.copterId})
    }
    startVideoRoom(){
      console.log("Sending start video room")
      this.socket.emit('video_room', {copterId: this.copterId, action: 'start'})
    }
    stopVideoRoom(){
      console.log("Sending stop video room")
      this.socket.emit('video_room', {copterId: this.copterId, action: 'stop'})
    }

    setFence(data){
      console.log("Sending set fence event")
      this.socket.emit('fence', { copterId: this.fccsId, action: 'set', data })
    }
    delFence(fenceId){
      console.log("Sending delete fence event")
      this.socket.emit('fence', { copterId: this.fccsId, action: 'delete', data: { fenceId } })
    }
    resetFence(){
      console.log("Sending reset fence event")
      this.socket.emit('fence', { copterId: this.fccsId, action: 'reset'})
    }
  }
