import React, { useState } from "react";
import { AudioNodeElement } from "./components/AudioNodeElement";
import { Playground } from "./components/Playground";

function App() {
  // Meta
  let [isReady, setIsReady] = useState(false);
  let [isPlaying, setIsPlaying] = useState(false);
  // Nodes
  let [audioContext, setAudioContext] = useState(null);
  let [waveShaperNode, setWaveShaperNode] = useState(null);
  let [gainNode, setGainNode] = useState(null);
  let [dynamicsCompressorNode, setDynamicsCompressorNode] = useState(null);
  let [biquadFilterNode, setBiquadFilterNode] = useState(null);
  let [convolverNode, setConvolverNode] = useState(null);
  let [pannerNode, setpannerNode] = useState(null);

  const setup = () => {
    // Init AudioContext and audio source
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const audioElement = document.querySelector("audio");
    const source = audioContext.createMediaElementSource(audioElement);

    // Create waveShaperNode
    const waveShaperNode = audioContext.createWaveShaper();
    var k = typeof 400 === "number" ? 400 : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
    for (; i < n_samples; ++i) {
      x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    waveShaperNode.curve = curve;
    waveShaperNode.oversample = "4x";

    // Create dynamicsCompressorNode
    const dynamicsCompressorNode = audioContext.createDynamicsCompressor();

    // Create gainNode
    const gainNode = audioContext.createGain();

    // Create biquadFilterNode
    const biquadFilterNode = audioContext.createBiquadFilter();
    biquadFilterNode.type = "lowpass";
    biquadFilterNode.frequency.value = 40000;

    // Create convolverNode
    convolverNode = audioContext.createConvolver();
    const impulseResponseRequest = new XMLHttpRequest();
    impulseResponseRequest.open("GET", "hall.wav", true);
    impulseResponseRequest.responseType = "arraybuffer";
    impulseResponseRequest.onload = () => {
      audioContext.decodeAudioData(impulseResponseRequest.response, buffer => {
        convolverNode.buffer = buffer;
      });
    };
    impulseResponseRequest.send();

    // Create pannerNode
    const pannerNode = audioContext.createPanner();

    // Connect nodes
    source.connect(waveShaperNode);
    waveShaperNode.connect(dynamicsCompressorNode);
    dynamicsCompressorNode.connect(gainNode);
    gainNode.connect(biquadFilterNode);
    biquadFilterNode.connect(convolverNode);
    convolverNode.connect(pannerNode);
    pannerNode.connect(audioContext.destination);

    // Update state
    setIsReady(true);
    setAudioContext(audioContext);
    setGainNode(gainNode);
    setDynamicsCompressorNode(dynamicsCompressorNode);
    setBiquadFilterNode(biquadFilterNode);
    setConvolverNode(convolverNode);
    setpannerNode(pannerNode);
  };

  // Audio source methods
  const handlePlayPause = () => {
    const audioElement = document.querySelector("audio");
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
    if (!isPlaying) {
      audioElement.play();
      setIsPlaying(true);
    } else {
      audioElement.pause();
      setIsPlaying(false);
    }
  };

  // waveShaperNode methods
  const handleWaveShaperChange = e => {};

  // gainNode methods
  const handleGainChange = e => {
    gainNode.gain.value = e.target.value;
  };

  // dynamicsCompressorNode methods
  const handleDynamicsCompressorChange = e => {
    dynamicsCompressorNode[e.target.name].value = e.target.value;
  };

  // biquadFilterNode methods
  const handleFilterFrequencyChange = e => {
    biquadFilterNode.frequency.value = e.target.value;
  };
  const handleFilterQChange = e => {
    biquadFilterNode.Q.value = e.target.value;
  };
  const handleFilterTypeChange = e => {
    biquadFilterNode.type = e.target.value;
  };

  // convolverNode methods
  const handleConvolverChange = e => {
    if (e.target.checked) {
      biquadFilterNode.disconnect(pannerNode);
      biquadFilterNode.connect(convolverNode);
      convolverNode.connect(pannerNode);
    } else {
      biquadFilterNode.disconnect(convolverNode);
      biquadFilterNode.connect(pannerNode);
    }
  };

  // pannerNode methods
  let [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const handlePannerPositionChange = e => {
    const newPosition = { ...position };
    newPosition[e.target.name] = e.target.value;
    setPosition(newPosition);
    pannerNode.setPosition(position.x, position.y, position.z);
  };

  let [orientation, setOrientation] = useState({ x: 0, y: 0, z: 0 });
  const handlePannerOrientationChange = e => {
    const newOrientation = { ...orientation };
    newOrientation[e.target.name] = e.target.value;
    setOrientation(newOrientation);
    pannerNode.setOrientation(orientation.x, orientation.y, orientation.z);
  };

  return (
    <Playground>
      <AudioNodeElement>
        <h3>Audio Input</h3>
        <h6>
          (<code>audio</code> element)
        </h6>
        <audio src="viper.mp3" type="audio/mpeg" onCanPlayThrough={setup} />
        {isReady && (
          <button role="switch" aria-checked="false" onClick={handlePlayPause}>
            <span>Play/Pause</span>
          </button>
        )}
      </AudioNodeElement>
      <AudioNodeElement>
        <h3>WaveShaper</h3>
        <h6>(waveShaperNode)</h6>
        <label htmlFor="enabled">Enabled</label>
        <input
          name="enabled"
          type="checkbox"
          defaultChecked={true}
          onChange={handleWaveShaperChange}
        />
      </AudioNodeElement>
      <AudioNodeElement>
        <h3>Compressor</h3>
        <h6>(dynamicsCompressorNode)</h6>
        <label htmlFor="attack">Attack</label>
        <input
          name="attack"
          type="range"
          min="0"
          max="1"
          defaultValue="0.003"
          step="0.01"
          onChange={handleDynamicsCompressorChange}
        />
        <label htmlFor="knee">Knee</label>
        <input
          name="knee"
          type="range"
          min="0"
          max="40"
          defaultValue="30"
          step="0.01"
          onChange={handleDynamicsCompressorChange}
        />
        <label htmlFor="ratio">Ratio</label>
        <input
          name="ratio"
          type="range"
          min="1"
          max="20"
          defaultValue="12"
          step="0.01"
          onChange={handleDynamicsCompressorChange}
        />
        <label htmlFor="release">Release</label>
        <input
          name="release"
          type="range"
          min="0"
          max="1"
          defaultValue="0.25"
          step="0.01"
          onChange={handleDynamicsCompressorChange}
        />
        <label htmlFor="threshold">Threshold</label>
        <input
          name="threshold"
          type="range"
          min="-100"
          max="0"
          defaultValue="-24"
          step="0.01"
          onChange={handleDynamicsCompressorChange}
        />
      </AudioNodeElement>
      <AudioNodeElement>
        <h3>Gain</h3>
        <h6>(gainNode)</h6>
        <label htmlFor="gain">Gain</label>
        <input
          name="gain"
          type="range"
          min="0"
          max="3"
          defaultValue="1"
          step="0.01"
          onChange={handleGainChange}
        />
      </AudioNodeElement>
      <AudioNodeElement>
        <h3>Filter</h3>
        <h6>(biquadFilterNode)</h6>
        <label htmlFor="type">Type</label>
        <select name="type" onChange={handleFilterTypeChange}>
          <option>lowpass</option>
          <option>highpass</option>
          <option>lowshelf</option>
          <option>highshelf</option>
          <option>bandpass</option>
          <option>allpass</option>
        </select>
        <label htmlFor="frequency">Frequency</label>
        <input
          name="frequency"
          type="range"
          min="0"
          max="40000"
          defaultValue="40000"
          step="0.01"
          onChange={handleFilterFrequencyChange}
        />
        <label htmlFor="q">Q</label>
        <input
          name="q"
          type="range"
          min="0"
          max="20"
          defaultValue="1"
          step="0.01"
          onChange={handleFilterQChange}
        />
      </AudioNodeElement>
      <AudioNodeElement>
        <h3>Reverb</h3>
        <h6>(convolverNode)</h6>
        <label htmlFor="enabled">Enabled</label>
        <input
          name="enabled"
          type="checkbox"
          defaultChecked={true}
          onChange={handleConvolverChange}
        />
      </AudioNodeElement>
      <AudioNodeElement>
        <h3>Panner</h3>
        <h6>(stereoPannerNode)</h6>
        <label htmlFor="x">x-position</label>
        <input
          name="x"
          type="range"
          min="-1"
          max="1"
          step="0.01"
          onChange={handlePannerPositionChange}
        />
        <label htmlFor="y">y-position</label>
        <input
          name="y"
          type="range"
          min="-1"
          max="1"
          step="0.01"
          onChange={handlePannerPositionChange}
        />
        <label htmlFor="z">z-position</label>
        <input
          name="z"
          type="range"
          min="-1"
          max="1"
          step="0.01"
          onChange={handlePannerPositionChange}
        />

        <label htmlFor="x">x-orientation</label>
        <input
          name="x"
          type="range"
          min="-1"
          max="1"
          step="0.01"
          onChange={handlePannerOrientationChange}
        />
        <label htmlFor="y">y-orientation</label>
        <input
          name="y"
          type="range"
          min="-1"
          max="1"
          step="0.01"
          onChange={handlePannerOrientationChange}
        />
        <label htmlFor="z">z-orientation</label>
        <input
          name="z"
          type="range"
          min="-1"
          max="1"
          step="0.01"
          onChange={handlePannerOrientationChange}
        />
      </AudioNodeElement>
    </Playground>
  );
}

export default App;
