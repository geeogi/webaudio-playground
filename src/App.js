import React, { useEffect, useState } from "react";
import { H1 } from "./components/util/H1";
import { Playground } from "./components/util/Playground";
import { BiquadFilterComponent } from "./components/webaudio/biquadFilter";
import { ConvolverComponent } from "./components/webaudio/convolverNode";
import { DynamicsCompressorComponent } from "./components/webaudio/dynamicsCompressor";
import { GainComponent } from "./components/webaudio/gainNode";
import { PannerComponent } from "./components/webaudio/pannerNode";
import { WaveShaperComponent } from "./components/webaudio/waveshaper";
import { AnalyserComponent } from "./components/webaudio/analyser";
import { AudioNodeElement } from "./components/util/AudioNodeElement";

function App() {
  // Meta
  const [nodes, setNodes] = useState();
  const [decodedAudioData, setDecodedAudioData] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState();

  // This function creates the audio nodes
  const setup = () => {
    // Ensure AudioContext doesn't already exist
    if (audioContext) {
      alert("AudioContext already exists");
    }

    // Initialise AudioContext and audio source
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContextInstance = new AudioContext();

    // Create bufferSourceNode
    const bufferSourceNode = audioContextInstance.createBufferSource();

    // Load buffer
    const myRequest = new Request("viper.mp3");
    fetch(myRequest)
      .then(response => response.arrayBuffer())
      .then(buffer => {
        audioContextInstance.decodeAudioData(buffer, decodedData => {
          setDecodedAudioData(decodedData);
          bufferSourceNode.buffer = decodedData;
        });
      });

    // Create analyserNode
    const analyserNode = audioContextInstance.createAnalyser();
    analyserNode.fftSize = 256;

    // Create waveShaperNode
    const waveShaperNode = audioContextInstance.createWaveShaper();
    let curve = new Float32Array(256);
    curve.forEach((_, i) => {
      let x = (i * 2) / 256 - 1;
      curve[i] = ((Math.PI + 15) * x) / (Math.PI + 15 * Math.abs(x));
    });
    waveShaperNode.curve = curve;
    waveShaperNode.oversample = "4x";

    // Create dynamicsCompressorNode
    const dynamicsCompressorNode = audioContextInstance.createDynamicsCompressor();

    // Create gainNode
    const gainNode = audioContextInstance.createGain();

    // Create biquadFilterNode
    const biquadFilterNode = audioContextInstance.createBiquadFilter();
    biquadFilterNode.type = "lowpass";

    // Create convolverNode
    const convolverNode = audioContextInstance.createConvolver();
    const impulseResponseRequest = new XMLHttpRequest();
    impulseResponseRequest.open("GET", "hall.wav", true);
    impulseResponseRequest.responseType = "arraybuffer";
    impulseResponseRequest.onload = () => {
      audioContextInstance.decodeAudioData(
        impulseResponseRequest.response,
        buffer => {
          convolverNode.buffer = buffer;
        }
      );
    };
    impulseResponseRequest.send();

    // Create pannerNode
    const pannerNode = audioContextInstance.createPanner();

    // Keep nodes, buffer and audio context in state
    setAudioContext(audioContextInstance);
    setNodes({
      bufferSource: { instance: bufferSourceNode, position: 0 },
      analyser: { instance: analyserNode, position: 1, bypass: true },
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
      destination: { instance: audioContextInstance.destination, position: 8 }
    });
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

  // Handle play and stop
  const handlePlay = () => {
    setIsPlaying(true);
    audioContext.resume();
    nodes.bufferSource.instance.start(0);
  };
  const handleStop = () => {
    setIsPlaying(false);
    nodes.bufferSource.instance.stop(0);
    const newNodes = { ...nodes };
    newNodes.bufferSource.instance = null;
    newNodes.bufferSource.instance = audioContext.createBufferSource();
    newNodes.bufferSource.instance.buffer = decodedAudioData;
    setNodes(newNodes);
  };

  return (
    <main>
      <H1>Webaudio API</H1>
      <Playground>
        <button onClick={setup}>Setup</button>
        <AudioNodeElement title={"Source"} id={"bufferSource"}>
          <button onClick={handlePlay}>Play</button>
          <button onClick={handleStop}>Stop</button>
        </AudioNodeElement>
        <AnalyserComponent
          isActive={
            isPlaying && nodes && nodes.analyser && !nodes.analyser.bypass
          }
          disabled={!audioContext}
          analyserNode={nodes && nodes.analyser}
          setBypass={setBypass}
        />
        <WaveShaperComponent
          disabled={!audioContext}
          waveShaperNode={nodes && nodes.waveShaper}
          setBypass={setBypass}
        />
        <DynamicsCompressorComponent
          disabled={!audioContext}
          dynamicsCompressorNode={nodes && nodes.dynamicsCompressor}
          setBypass={setBypass}
        />
        <GainComponent
          disabled={!audioContext}
          gainNode={nodes && nodes.gain}
          setBypass={setBypass}
        />

        <BiquadFilterComponent
          disabled={!audioContext}
          biquadFilterNode={nodes && nodes.biquadFilter}
          setBypass={setBypass}
        />
        <ConvolverComponent
          disabled={!audioContext}
          convolverNode={nodes && nodes.convolver}
          setBypass={setBypass}
        />
        <PannerComponent
          disabled={!audioContext}
          pannerNode={nodes && nodes.panner}
          setBypass={setBypass}
        />
      </Playground>
    </main>
  );
}

export default App;
