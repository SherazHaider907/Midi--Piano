const audioContext = new AudioContext();

const NOTE_DETAILS = [
  { note: "C", key: "Z", frequency: 261.626, active: false, oscillator: null },
  { note: "Db", key: "S", frequency: 277.183, active: false, oscillator: null },
  { note: "D", key: "X", frequency: 293.665, active: false, oscillator: null },
  { note: "Eb", key: "D", frequency: 311.127, active: false, oscillator: null },
  { note: "E", key: "C", frequency: 329.628, active: false, oscillator: null },
  { note: "F", key: "V", frequency: 349.228, active: false, oscillator: null },
  { note: "Gb", key: "G", frequency: 369.994, active: false, oscillator: null },
  { note: "G", key: "B", frequency: 391.995, active: false, oscillator: null },
  { note: "Ab", key: "H", frequency: 415.305, active: false, oscillator: null },
  { note: "A", key: "N", frequency: 440, active: false, oscillator: null },
  { note: "Bb", key: "J", frequency: 466.164, active: false, oscillator: null },
  { note: "B", key: "M", frequency: 493.883, active: false, oscillator: null },
];

document.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  const keyboardKey = e.code;
  const noteDetail = getNoteDetail(keyboardKey);

  if (!noteDetail) return;

  noteDetail.active = true;
  playNotes();
});

document.addEventListener("keyup", (e) => {
  const keyboardKey = e.code;
  const noteDetail = getNoteDetail(keyboardKey);

  if (!noteDetail) return;

  noteDetail.active = false;
  playNotes();
});

function getNoteDetail(keyboardKey) {
  return NOTE_DETAILS.find((n) => `Key${n.key}` === keyboardKey);
}

function playNotes() {
  // Update key styles and stop active oscillators
  NOTE_DETAILS.forEach((note) => {
    const keyElement = document.querySelector(`[data-note="${note.note}"]`);
    if (keyElement) {
      keyElement.classList.toggle("active", note.active);
    }
    if (note.oscillator) {
      note.oscillator.stop();
      note.oscillator.disconnect();
      note.oscillator = null;
    }
  });

  // Play active notes
  const activeNotes = NOTE_DETAILS.filter((note) => note.active);
  if (activeNotes.length === 0) return;

  const gain = 1 / activeNotes.length;
  activeNotes.forEach((note) => {
    startNote(note, gain);
  });
}

function startNote(noteDetail, gain) {
  const gainNode = audioContext.createGain();
  gainNode.gain.value = gain;

  const oscillator = audioContext.createOscillator();
  oscillator.frequency.value = noteDetail.frequency;
  oscillator.type = "sine";

  oscillator.connect(gainNode).connect(audioContext.destination);
  oscillator.start();

  noteDetail.oscillator = oscillator;
}
