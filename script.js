"use strict";

// Get canvas element and set its width and height
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create audio context for sound generation
const audioCtx = new AudioContext();
let oscillator = null;

const cellSize = 10; // Size of each cell in the automata

// Generate initial state for cellular automata
let initState = generateInitialState(cellSize);

// Generate generative image on canvas
const ctx = canvas.getContext("2d");
const imageData = ctx.createImageData(canvas.width, canvas.height);

// Animate generative image on canvas
const animate = () => {
  // Generate new state for cellular automata
  const newState = generateNewState(initState);

  // Draw cells on canvas based on new state
  for (let y = 0; y < canvas.height / cellSize; y++) {
    for (let x = 0; x < canvas.width / cellSize; x++) {
      const index = (y * cellSize * canvas.width + x * cellSize) * 4;
      const value = newState[y][x] ? 255 : 0;
      for (let i = 0; i < cellSize; i++) {
        for (let j = 0; j < cellSize; j++) {
          const pixelIndex = (y * cellSize + i) * canvas.width * 4 + (x * cellSize + j) * 4;
          imageData.data[pixelIndex] = value;
          imageData.data[pixelIndex + 1] = value;
          imageData.data[pixelIndex + 2] = value;
          imageData.data[pixelIndex + 3] = 255;
        }
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);

  // Play sound based on the state of the automata
  if (oscillator !== null) {
    oscillator.stop();
  }
  oscillator = audioCtx.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.value = getSoundFrequency(newState);
  oscillator.connect(audioCtx.destination);
  oscillator.start();

  // Update initial state for next iteration
  initState = newState;

  // Request next frame
  requestAnimationFrame(animate);
};
animate();

// Generate initial state for cellular automata
function generateInitialState() {
  const rows = canvas.height / cellSize;
  const cols = canvas.width / cellSize;
  const state = [];
  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      row.push(Math.round(Math.random()));
    }
    state.push(row);
  }
  return state;
}

// Generate new state for cellular automata based on the previous state
function generateNewState(prevState) {
  const rows = prevState.length;
  const cols = prevState[0].length;
  const newState = [];
  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      const neighbors = getNeighborCount(prevState, x, y);
      if (prevState[y][x] === 1) {
        if (neighbors === 2 || neighbors === 3) {
          row.push(1);
        } else {
          row.push(0);
        }
      } else {
        if (neighbors === 3) {
          row.push(1);
        } else {
          row.push(0);
        }
      }
    }
    newState.push(row);
}
return newState;
}

// Get the count of live neighbors for a given cell
function getNeighborCount(state, x, y) {
let count = 0;
const rows = state.length;
const cols = state[0].length;
for (let i = -1; i <= 1; i++) {
for (let j = -1; j <= 1; j++) {
if (i === 0 && j === 0) {
continue;
}
const row = (y + i + rows) % rows;
const col = (x + j + cols) % cols;
count += state[row][col];
}
}
return count;
}

// Get the frequency for the sound to be played based on the state of the automata
function getSoundFrequency(state) {
let count = 0;
for (let y = 0; y < state.length; y++) {
for (let x = 0; x < state[0].length; x++) {
count += state[y][x];
}
}
return count * 50 + 100;
}