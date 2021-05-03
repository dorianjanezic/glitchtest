//establishing mqtt connection over websocket port
let client = mqtt.connect("wss://oasisrazor294:604NiryUDL1xQd9j@oasisrazor294.cloud.shiftr.io", {
  clientId: 'javascript'
});

//global variables
let number = 100;
var twostrings = 1;
let am, fm, membrane, pluck, metal, mono;
let chosenSynth;
let synthInstruments = [];
let loop;

notes = ["C", "D", "E", "F", "G", "A", "H"]

//dropdown array
let synths = [
  "FM Synth",
  "AM Synth",
  "Membrane Synth",
  "Plucky Synth",
  "Metal Synth",
  "Mono Synth",
];

//tone synth objects
const gain = new Tone.Gain(0.7);
gain.toDestination();

const fmSynth = new Tone.FMSynth({oscillator:{type:"sine"}}).connect(gain)

const amSynth = new Tone.AMSynth({
  envelope: {
  attack: 0.1,
  decay: 2,
  release: 0.8,
},}).connect(gain)

const membraneSynth = new Tone.MembraneSynth().connect(gain)
const pluckSynth = new Tone.PluckSynth().connect(gain)
const metalSynth = new Tone.MetalSynth().connect(gain)
const monoSynth = new Tone.MetalSynth().connect(gain)

//synths array
synthInstruments.push(
  amSynth,
  fmSynth,
  membraneSynth,
  pluckSynth,
  metalSynth,
  monoSynth
);

//start button
document.getElementById("button1").addEventListener("click", async () => {
  Tone.Transport.stop();
  await Tone.start();
  loop = new Tone.Loop(function(time) {
    console.log(time);
    chosenSynth.triggerAttackRelease(twostrings);
  }, 
  "4n").start(0);
  Tone.Transport.start();
});

//stop button
document.getElementById("button2").addEventListener("click", async () => {
 loop.stop();
 console.log("stop")
 Tone.Transport.stop();
 loop.mute = true;
 console.log("mute")
});

window.addEventListener("load", () => {
  let dropdown = document.getElementById("dropdown");
  let defaultoption = document.createElement("option");
  defaultoption.text = "Select Synth";

  dropdown.add(defaultoption);

  for (let i = 0; i < synths.length; i++) {
    let synthOption = document.createElement("option");
    synthOption.text = synths[i];
    dropdown.add(synthOption);
  }

  dropdown.selectedIndex = 0;

  dropdown.addEventListener("change", function (e) {
    if (e.target.value == "FM Synth") {
      chosenSynth = synthInstruments[0];
      Tone.Transport.stop();
    }
   else if (e.target.value == "AM Synth") {
      chosenSynth = synthInstruments[1];
      Tone.Transport.stop();
    }
  else if (e.target.value == "Membrane Synth") {
      chosenSynth = synthInstruments[2];
      Tone.Transport.stop();
    }
  else if (e.target.value == "Plucky Synth") {
      chosenSynth = synthInstruments[3];
      Tone.Transport.stop();
    }
  else if (e.target.value == "Metal Synth") {
      chosenSynth = synthInstruments[4];
      Tone.Transport.stop();
    }
  else if (e.target.value == "Mono Synth") {
      chosenSynth = synthInstruments[5];
      Tone.Transport.stop();
    };
  });
});

//mathematics for calculating notes and octaves out of sensor data
function calculateNote (valueString) {
  let iterval = parseInt(valueString)% 7;
  return (notes[iterval]);
};
function calculateOctave (valueString) {
  let iterval = Math.floor(parseInt(valueString)/ 7);
  return (iterval.toString());
};
const pingPong = new Tone.PingPongDelay(twostrings, 0.2).toDestination();
//connecting to mqtt and subscribing to topic
client.on('connect', function () {
  console.log('connected!');
  client.subscribe('/distance');
});
const grainplayer = new Tone.GrainPlayer("sounds/diva.wav").toDestination();
grainplayer.connect(pingPong)

// // tone.js sampler    
// const player = new Tone.Player("sounds/diva.wav").toDestination();;

//
// const filter = new Tone.Reverb(400, "highpass").toDestination();
// grainplayer.connect(filter);



//membrane synth
// const synth = new Tone.PluckSynth().toDestination();
// const loop = new Tone.Loop(
//   function(time) {
//   synth.triggerAttackRelease(twostrings);
// }, "8n").start(0);

//attach a click listener to a play button
document.getElementById("button").addEventListener("click", async () => {
  grainplayer.start();
});

//map range
function mapNumber (number, inMin, inMax, outMin, outMax)
{
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

//on received message from mqtt
client.on('message', function (topic, message) {
  document.getElementById("p1").innerHTML = message.toString();

    if (message < 60) {
      twostrings = calculateNote(message).concat(calculateOctave(message))
    };

    if (message < 10) {
      // player.start();
    }

    if (message < 5) {
      // player.stop();
    }
// mapping sensor values to filter frequency value
// filter.decay.value = mapNumber (message, 0, 100, 0, 1);
// console.log(filter.decay.value)
});