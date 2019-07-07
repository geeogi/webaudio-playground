import React, { useEffect, useState } from "react";
import { AudioNodeElement } from "./components/AudioNodeElement";
import { Playground } from "./components/Playground";
import { H1 } from "./components/base";

function App() {
  // Meta
  let [isPlaying, setIsPlaying] = useState(false);
  let [nodes, setNodes] = useState(null);
  let [audioContext, setAudioContext] = useState(null);

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

    // Create convolverNode
    const convolverNode = audioContext.createConvolver();
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

    // Update state
    setAudioContext(audioContext);
    setNodes({
      source: { instance: source, position: 0 },
      waveShaperNode: { instance: waveShaperNode, position: 1, bypass: true },
      dynamicsCompressorNode: {
        instance: dynamicsCompressorNode,
        position: 2,
        bypass: true
      },
      gainNode: { instance: gainNode, position: 3, bypass: true },
      biquadFilterNode: {
        instance: biquadFilterNode,
        position: 4,
        bypass: true
      },
      convolverNode: { instance: convolverNode, position: 5, bypass: true },
      pannerNode: { instance: pannerNode, position: 6, bypass: true },
      destination: { instance: audioContext.destination, position: 7 }
    });
  };

  useEffect(() => {
    if (nodes) {
      // Create array of nodes and order them by position
      let nodeArray = Object.values(nodes).sort(
        (a, b) => a.position > b.position
      );
      // Replace "bypassed" nodes with a gain node
      nodeArray = nodeArray.map(node =>
        node.bypass
          ? { instance: audioContext.createGain(), position: node.position }
          : node
      );
      // Build audio graph
      nodeArray.forEach((node, index) => {
        if (index < nodeArray.length - 1) {
          // Remove node's output connections if they exist
          node.instance.disconnect();
          // Connect node to consecutive node
          node.instance.connect(nodeArray[index + 1].instance);
        }
      });
    }
  }, [audioContext, nodes]);

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

  const setBypass = (nodeId, shouldBypass) => {
    const newNodes = { ...nodes };
    newNodes[nodeId].bypass = shouldBypass;
    setNodes(newNodes);
  };

  const handleGainChange = e => {
    nodes.gainNode.instance.gain.value = e.target.value;
  };

  const handleDynamicsCompressorChange = e => {
    nodes.dynamicsCompressorNode.instance[e.target.name].value = e.target.value;
  };

  const handleFilterFrequencyChange = e => {
    nodes.biquadFilterNode.instance.frequency.value = e.target.value;
  };
  const handleFilterQChange = e => {
    nodes.biquadFilterNode.instance.Q.value = e.target.value;
  };
  const handleFilterTypeChange = e => {
    nodes.biquadFilterNode.instance.type = e.target.value;
  };

  let [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const handlePannerPositionChange = e => {
    const newPosition = { ...position };
    newPosition[e.target.name] = e.target.value;
    setPosition(newPosition);
    nodes.pannerNode.instance.setPosition(position.x, position.y, position.z);
  };

  let [orientation, setOrientation] = useState({ x: 0, y: 0, z: 0 });
  const handlePannerOrientationChange = e => {
    const newOrientation = { ...orientation };
    newOrientation[e.target.name] = e.target.value;
    setOrientation(newOrientation);
    nodes.pannerNode.instance.setOrientation(
      orientation.x,
      orientation.y,
      orientation.z
    );
  };

  return (
    <>
      <H1>Webaudio API</H1>
      <Playground>
        <AudioNodeElement title={"Source"} id={"<audio>"}>
          <audio src="viper.mp3" type="audio/mpeg" onCanPlayThrough={setup} />
          <button onClick={handlePlayPause} disabled={!audioContext}>
            <span>Play/Pause</span>
          </button>
        </AudioNodeElement>
        <AudioNodeElement
          bypassed={nodes && nodes.waveShaperNode.bypass}
          title={"WaveShaper"}
          id={"waveShaperNode"}
          setBypass={setBypass}
        />
        <AudioNodeElement
          bypassed={nodes && nodes.dynamicsCompressorNode.bypass}
          title={"Compressor"}
          id={"dynamicsCompressorNode"}
          setBypass={setBypass}
        >
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
        <AudioNodeElement
          bypassed={nodes && nodes.gainNode.bypass}
          title={"Gain"}
          id={"gainNode"}
          setBypass={setBypass}
        >
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
        <AudioNodeElement
          bypassed={nodes && nodes.biquadFilterNode.bypass}
          title={"Filter"}
          id={"biquadFilterNode"}
          setBypass={setBypass}
        >
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
            defaultValue="350"
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
        <AudioNodeElement
          bypassed={nodes && nodes.convolverNode.bypass}
          title={"Reverb"}
          id={"convolverNode"}
          setBypass={setBypass}
        />
        <AudioNodeElement
          bypassed={nodes && nodes.pannerNode.bypass}
          title={"Panner"}
          id={"pannerNode"}
          setBypass={setBypass}
        >
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
    </>
  );
}

export default App;
