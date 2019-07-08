import React, { useEffect, useState } from "react";
import { H1 } from "./components/util/base";
import { Playground } from "./components/util/Playground";
import { BiquadFilterComponent } from "./components/webaudio/biquadFilter";
import { ConvolverNodeComponent } from "./components/webaudio/convolverNode";
import { DynamicsCompressorComponent } from "./components/webaudio/dynamicsCompressor";
import { GainNodeComponent } from "./components/webaudio/gainNode";
import { PannerNodeComponent } from "./components/webaudio/pannerNode";
import { SourceComponent } from "./components/webaudio/source";
import { WaveShaperComponent } from "./components/webaudio/waveshaper";

function App() {
  // Meta
  let [isPlaying, setIsPlaying] = useState(false);
  let [nodes, setNodes] = useState(null);
  let [audioContext, setAudioContext] = useState(null);

  // This function creates the audio nodes
  const setup = () => {
    // Init AudioContext and audio source
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const audioElement = document.querySelector("audio");
    const source = audioContext.createMediaElementSource(audioElement);

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

  // This function builds the audio node graph each time "nodes" is set
  useEffect(() => {
    if (nodes) {
      // Map nodes object to an array ordered by node position
      let nodeArray = Object.values(nodes).sort(
        (a, b) => a.position > b.position
      );
      // Replace "bypassed" nodes with a gain node
      nodeArray = nodeArray.map(node =>
        node.bypass ? { ...node, instance: audioContext.createGain() } : node
      );
      // Build audio node graph
      nodeArray.forEach((node, index) => {
        if (index < nodeArray.length - 1) {
          // Remove any existing output connections
          node.instance.disconnect();
          // Connect node to consecutive node
          node.instance.connect(nodeArray[index + 1].instance);
        }
      });
    }
  }, [audioContext, nodes]);

  // Util method for setting the bypass flag of a node
  const setBypass = (nodeId, shouldBypass) => {
    const newNodes = { ...nodes };
    newNodes[nodeId].bypass = shouldBypass;
    setNodes(newNodes);
  };

  return (
    <>
      <H1>Webaudio API</H1>
      <Playground>
        <SourceComponent
          setup={setup}
          isPlaying={isPlaying}
          audioContext={audioContext}
          setIsPlaying={setIsPlaying}
        />
        <WaveShaperComponent
          waveShaperNode={nodes && nodes.waveShaperNode}
          setBypass={setBypass}
        />
        <DynamicsCompressorComponent
          dynamicsCompressorNode={nodes && nodes.dynamicsCompressorNode}
          setBypass={setBypass}
        />
        <GainNodeComponent
          gainNode={nodes && nodes.gainNode}
          setBypass={setBypass}
        />

        <BiquadFilterComponent
          biquadFilterNode={nodes && nodes.biquadFilterNode}
          setBypass={setBypass}
        />
        <ConvolverNodeComponent
          convolverNode={nodes && nodes.convolverNode}
          setBypass={setBypass}
        />
        <PannerNodeComponent
          pannerNode={nodes && nodes.pannerNode}
          setBypass={setBypass}
        />
      </Playground>
    </>
  );
}

export default App;
