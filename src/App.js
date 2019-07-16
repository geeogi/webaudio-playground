import React, { useEffect, useRef, useState } from "react";
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
  const [nodes, setNodes] = useState();
  const [audioContext, setAudioContext] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioElementRef = useRef();

  // This function creates the audio nodes
  const setup = () => {
    // Init AudioContext and audio source
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const sourceNode = audioContext.createMediaElementSource(
      audioElementRef.current
    );

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
            console.log(node.instance);
          }
        }
      });
    }
  }, [nodes]);

  // Handle play and pause
  const handlePlay = () => {
    if (audioContext && audioContext.state === "suspended") {
      audioContext.resume();
    }
    if (nodes && nodes.source) {
      nodes.source.instance.mediaElement.play();
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    nodes.source.instance.mediaElement.pause();
    setIsPlaying(false);
  };

  return (
    <main>
      <H1>Webaudio API</H1>
      <Playground>
        <SourceComponent
          isPlaying={isPlaying}
          handlePlay={handlePlay}
          handlePause={handlePause}
          reactRef={audioElementRef}
          ready={Boolean(nodes)}
          setup={setup}
        />
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
