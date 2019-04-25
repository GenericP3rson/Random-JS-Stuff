var mqtt = require('mqtt');

var hostname = "mqtt://localhost:1883";
var client = mqtt.connect(hostname);

console.log(`Be sure you've typed these into the terminal:
brew services start mosquitto
brew services start snips-audio-server
brew services start snips-hotword
brew services start snips-tts
brew services start snips-nlu
brew services start snips-asr
brew services start snips-dialogue`);

client.on('connect', function () {
    console.log("[Snips Log] Connected to MQTT broker " + hostname);
    // console.log(`Be sure you've typed these into the terminal:
    // brew services start mosquitto
    // brew services start snips-audio-server
    // brew services start snips-hotword
    // brew services start snips-tts
    // brew services start snips-nlu
    // brew services start snips-asr
    // brew services start snips-dialogue`);
    console.log("Say, 'Hey, Snips' and ask about the weather!");
    client.subscribe('hermes/#');
});

client.on('message', function (topic, message) {
    if (topic === "hermes/asr/startListening") {
        onListeningStateChanged(true);
    } else if (topic === "hermes/asr/stopListening") {
        onListeningStateChanged(false);
    } else if (topic.match(/hermes\/hotword\/.+\/detected/g) !== null) {
        onHotwordDetected()
    } else if (topic.match(/hermes\/intent\/.+/g) !== null) {
        onIntentDetected(JSON.parse(message));
    }
});

function onIntentDetected(intent) {
    console.log("[Snips Log] Intent detected: " + JSON.stringify(intent));
    console.log(`There's a ${intent.intent.probability*100}% chance!`)
}

function onHotwordDetected() {
    console.log("[Snips Log] Hotword detected");
}

function onListeningStateChanged(listening) {
    console.log("[Snips Log] " + (listening ? "Start" : "Stop") + " listening");
}