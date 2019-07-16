import React, { useEffect, useState } from "react";
import { H1 } from "./components/util/H1";
import { Playground } from "./components/util/Playground";
import { BiquadFilterComponent } from "./components/webaudio/biquadFilter";
import { ConvolverComponent } from "./components/webaudio/convolverNode";
import { DynamicsCompressorComponent } from "./components/webaudio/dynamicsCompressor";
import { GainComponent } from "./components/webaudio/gainNode";
import { PannerComponent } from "./components/webaudio/pannerNode";
import { SourceComponent } from "./components/webaudio/source";
import { WaveShaperComponent } from "./components/webaudio/waveshaper";
import { AnalyserComponent } from "./components/webaudio/analyser";

function App() {
  // Meta
  let [nodes, setNodes] = useState({});
  let [audioContext, setAudioContext] = useState(null);
  let [isPlaying, setIsPlaying] = useState(false);

  // This function creates the audio nodes
  const setup = () => {
    // Init AudioContext and audio source
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const audioElement = document.querySelector("audio");
    const source = audioContext.createMediaElementSource(audioElement);

    // Create analyserNode
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 256;

    // Create waveShaperNode
    const waveShaperNode = audioContext.createWaveShaper();
    let curve = new Float32Array(256);
    curve.forEach((_, i) => {
      let x = (i * 2) / 256 - 1;
      curve[i] = ((Math.PI + 15) * x) / (Math.PI + 15 * Math.abs(x));
    });
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

    // Keep nodes and audio context in state
    setAudioContext(audioContext);
    setNodes({
      source: { instance: sourceNode, position: 0 },
      analyser: { instance: analyserNode, position: 1, bypass: false },
      waveShaper: { instance: waveShaperNode, position: 2, bypass: true },
      dynamicsCompressor: {
        instance: dynamicsCompressorNode,
        position: 3,
        bypass: true
      },
      gain: { instance: gainNode, position: 4, bypass: true },
      biquadFilter: {
        instance: biquadFilterNode,
        position: 5,
        bypass: true
      },
      convolver: { instance: convolverNode, position: 6, bypass: true },
      panner: { instance: pannerNode, position: 7, bypass: true },
      destination: { instance: audioContext.destination, position: 8 }
    });

    // Begin playing
    sourceNode.play();
  };

  // Util method for setting the bypass flag of a node
  const setBypass = (nodeId, shouldBypass) => {
    const newNodes = { ...nodes };
    newNodes[nodeId].bypass = shouldBypass;
    setNodes(newNodes);
  };

  // This function builds the audio node graph each time "nodes" is set
  useEffect(() => {
    if (nodes) {
      // Map nodes object to an array ordered by node position
      const nodeArray = Object.values(nodes).sort(
        (a, b) => a.position > b.position
      );
      // Build audio node graph
      nodeArray.forEach((node, index) => {
        // Remove any existing output connections
        if (node.instance.numberOfOutputs > 0) {
          node.instance.disconnect();
        }
        // Skip bypassed nodes
        if (!node.bypass) {
          // Skip last node
          if (!(index === nodeArray.length - 1)) {
            // Find the next non-bypassed node
            const nextNode = nodeArray.find(({ bypass, position }) => {
              return !bypass && position > node.position;
            });
            // Connect node to the next non-bypassed node
            node.instance.connect(nextNode.instance);
          }
        }
      });
    }
  }, [nodes]);

  return (
    <main>
      <H1>Webaudio API</H1>
      <Playground>
        <SourceComponent
          setup={setup}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          audioContext={audioContext}
          source={nodes.source}
        />
        <AnalyserComponent
          isActive={isPlaying && !nodes.analyserNode.bypass}
          disabled={!audioContext}
          analyserNode={nodes.analyser}
          setBypass={setBypass}
        />
        <WaveShaperComponent
          disabled={!audioContext}
          waveShaperNode={nodes.waveShaper}
          setBypass={setBypass}
        />
        <DynamicsCompressorComponent
          disabled={!audioContext}
          dynamicsCompressorNode={nodes.dynamicsCompressor}
          setBypass={setBypass}
        />
        <GainComponent
          disabled={!audioContext}
          gainNode={nodes.gain}
          setBypass={setBypass}
        />

        <BiquadFilterComponent
          disabled={!audioContext}
          biquadFilterNode={nodes.biquadFilter}
          setBypass={setBypass}
        />
        <ConvolverComponent
          disabled={!audioContext}
          convolverNode={nodes.convolver}
          setBypass={setBypass}
        />
        <PannerComponent
          disabled={!audioContext}
          pannerNode={nodes.panner}
          setBypass={setBypass}
        />
      </Playground>
    </main>
  );
}

export default App;
