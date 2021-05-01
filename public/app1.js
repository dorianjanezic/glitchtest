//establishing mqtt connection over websocket port
let client = mqtt.connect("wss://oasisrazor294:604NiryUDL1xQd9j@oasisrazor294.cloud.shiftr.io", {
  clientId: 'javascript'
});

let synths = [
    "FM Synth",
    "AM Synth",
    "Membrane Synth",
    "Plucky Synth",
    "Metal Synth",
    "Mono Synth",
  ];
  let number = 100;
var twostrings = 1;
  let am, fm, membrane, pluck, metal, mono;
  let chosenSynth;

  document.querySelector("button1")?.addEventListener("click", async () => {
    await Tone.start();
    init();
  });

let value = 0.1;
let note;
let notes = [];
function mapRange(value, minf, maxf, mins, maxs) {
  value = (value - minf) / (maxf - minf);
  return mins + value * (maxs - mins);
}

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

  //on received message from mqtt
client.on('message', function (topic, message) {
    document.getElementById("p1").innerHTML = message.toString();
  
      
       twostrings = calculateNote(message).concat(calculateOctave(message))
     
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
        fm = true;
      }
  
      if (e.target.value == "AM Synth") {
        am = true;
      }
  
      if (e.target.value == "Membrane Synth") {
        membrane = true;
      }
  
      if (e.target.value == "Plucky Synth") {
        pluck = true;
      }
  
      if (e.target.value == "Metal Synth") {
        metal = true;
      }
  
      if (e.target.value == "Mono Synth") {
        mono = true;
      }
    });
  });

  let synthInstruments = [];

function init() {
  const freqV = mapRange(value, 50, 4000, 0.1, 5);

  const fmSynth = new Tone.FMSynth().toDestination();

  const amSynth = new Tone.AMSynth().toDestination();

  const membraneSynth = new Tone.MembraneSynth().toDestination();

  const pluckSynth = new Tone.PluckSynth().toDestination();

  const metalSynth = new Tone.MetalSynth().toDestination();

  const monoSynth = new Tone.MetalSynth().toDestination();

  synthInstruments.push(
    amSynth,
    fmSynth,
    membraneSynth,
    pluckSynth,
    metalSynth,
    monoSynth
  );

  if (fm == true) {
    chosenSynth = synthInstruments[0];
  }

  if (am == true) {
    chosenSynth = synthInstruments[1];
  }

  if (membrane == true) {
    chosenSynth = synthInstruments[2];
  }

  if (pluck == true) {
    chosenSynth = synthInstruments[3];
  }

  if (metal == true) {
    chosenSynth = synthInstruments[4];
  }

  if (mono == true) {
    chosenSynth = synthInstruments[5];
  }

  chosenSynth.triggerAttackRelease(twostrings);
}

  