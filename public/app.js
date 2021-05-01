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
const fmSynth = new Tone.FMSynth().toDestination();
const amSynth = new Tone.AMSynth().toDestination();
const membraneSynth = new Tone.MembraneSynth().toDestination();
const pluckSynth = new Tone.PluckSynth().toDestination();
const metalSynth = new Tone.MetalSynth().toDestination();
const monoSynth = new Tone.MetalSynth().toDestination();

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

document.getElementById("button2").addEventListener("click", async () => {
 loop.stop();
 console.log("stop")
 Tone.Transport.stop();
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
    }
   else if (e.target.value == "AM Synth") {
      chosenSynth = synthInstruments[1];
    }
  else if (e.target.value == "Membrane Synth") {
      chosenSynth = synthInstruments[2];
    }
  else if (e.target.value == "Plucky Synth") {
      chosenSynth = synthInstruments[3];
    }
  else if (e.target.value == "Metal Synth") {
      chosenSynth = synthInstruments[4];
    }
  else if (e.target.value == "Mono Synth") {
      chosenSynth = synthInstruments[5];
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

//connecting to mqtt and subscribing to topic
client.on('connect', function () {
  console.log('connected!');
  client.subscribe('/distance');
});

//tone.js sampler    
// const player = new Tone.Player("sounds/diva.wav")

//
// const filter = new Tone.Filter(400, "lowpass").toDestination();
// player.connect(filter);

//membrane synth
// const synth = new Tone.PluckSynth().toDestination();
// const loop = new Tone.Loop(
//   function(time) {
//   synth.triggerAttackRelease(twostrings);
// }, "8n").start(0);

//attach a click listener to a play button
document.getElementById("button").addEventListener("click", async () => {
  console.log("audio is ready");
  player.start();
});

//map range
function mapNumber (number, inMin, inMax, outMin, outMax)
{
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

//on received message from mqtt
client.on('message', function (topic, message) {
  document.getElementById("p1").innerHTML = message.toString();

    if (message < 30) {
      twostrings = calculateNote(message).concat(calculateOctave(message))
    };
// mapping sensor values to filter frequency value
// filter.frequency.value = mapNumber (message, 0, 30, 0, 500);
});