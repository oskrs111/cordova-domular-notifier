//--------------------------------------------------------------------------------------------------------
//----- HTTPS FCM NOTIFICATION SEVICE HOWTO --------------------------------------------------------------
//https://fcm.googleapis.com/fcm/send

//----- REQUIRED POST HEADERS ----------------------------------------------------------------------------
//Content-Type:application/json
//Authorization:key=your-api-key-here

//----- REQUIRED HTTP BODY ----------------------------------------------------------------------------
/*
{
  "data":{
    "title":"New Text Message",
    "image":"https://firebase.google.com/images/social.png",
    "message":"Hello how are you?"
  },
  "notification" : {
     "body" : "First Notification",
     "title": "Collapsing A",
     "click_action": "FCM_PLUGIN_ACTIVITY",
     "sound" : "default"
 },
  "to":"/topics/your-topic-here"
}
*/

//----- HTTPS FCM NOTIFICATION REFERENCES --------------------------------------------------------------
//https://stackoverflow.com/questions/37407366/firebase-fcm-notifications-click-action-payload
//https://firebase.google.com/docs/cloud-messaging/http-server-ref?hl=es-419#notification-payload-support

//--------------------------------------------------------------------------------------------------------
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        let that = this;
        this.receivedEvent('deviceready', '');
		
		FCMPlugin.onTokenRefresh(function(token){
            FCMPlugin.subscribeToTopic('mainDoor');
            //alert( token );
            that.receivedEvent('onsubscribe', token);
            console.log(token);
		});

		FCMPlugin.getToken(function(token){
            FCMPlugin.subscribeToTopic('mainDoor');
            //alert(token);
            that.receivedEvent('ontoken', token);
            console.log(token);
		});

		FCMPlugin.onNotification(function(data){
            if(data.wasTapped){
                //Notification was received on device tray and tapped by the user.
                //alert( JSON.stringify(data) );
                that.receivedEvent('ondata', data.message);
                console.log(data);
            }else{
                //Notification was received in foreground. Maybe the user needs to be notified.
                //alert( JSON.stringify(data) );
                that.receivedEvent('ondata', data.message);
                console.log(data);
            }
        },
        function(msg){
            //alert('Message:' + JSON.stringify(msg));
            that.receivedEvent('onmessage', msg);
            console.log(msg);
        },
        function(err){
            //alert('Error:' + JSON.stringify(err));
            that.receivedEvent('onerror', err);
            console.log(err);
        }
    );				
    },

    // Update DOM on a Received Event
    receivedEvent: function(type, message) {
        switch(type){
            case 'ondata':
            case 'onmessage':
            case 'onerror':
                _beep();

            case 'deviceready':   
            case 'onsubscribe':   
            case 'ontoken':      
            default:
                append(type, message);
                _vibrate();
                break;
        }
/*        
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        
*/        
    }
};

app.initialize();

function append(type, message){
    let container = document.getElementById('container_Id');
    let _new = document.createElement("div");
    _new.classList.add("item");
    _new.innerHTML = _getLine(_now(), type, message);
    container.append(_new);
}

function _getLine(time, type, message){
    let template = `
    <p><span class="${type}"><span><b>${time}</b></span>${message}</span></p>
    `;
    return template;
}

function _now(){
    let d = new Date();
    let str = `${(d.getHours() < 10)?('0' + d.getHours()):d.getHours()}:${(d.getMinutes() < 10)?('0' + d.getMinutes()):d.getMinutes()}:${(d.getSeconds() < 10)?('0' + d.getSeconds()):d.getSeconds()}-${(d.getDay() < 10)?('0' + d.getDay()):d.getDay()}/${(d.getMonth() < 10)?('0' + d.getMonth()):d.getMonth()}/${d.getFullYear()}`;
    return str;
}

function _beep() {
    navigator.notification.beep(1);
}

// Vibrate for 2 seconds
//
function _vibrate() {
    navigator.vibrate(2000);
}
