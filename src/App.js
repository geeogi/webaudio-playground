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
  const [audioContext, setAudioContext] = useState();
  const [nodes, setNodes] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [decodedSongAudioData, setDecodedSongAudioData] = useState();
  const [
    decodedConvolutionAudioData,
    setDecodedConvolutionAudioData
  ] = useState();

  // This function creates the audio nodes
  const setup = async () => {
    // Initialise AudioContext and audio source
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContextInstance = new AudioContext();

    // Create audio nodes
    const bufferSourceNode = audioContextInstance.createBufferSource();
    const analyserNode = audioContextInstance.createAnalyser();
    const waveShaperNode = audioContextInstance.createWaveShaper();
    const dynamicsCompressorNode = audioContextInstance.createDynamicsCompressor();
    const gainNode = audioContextInstance.createGain();
    const biquadFilterNode = audioContextInstance.createBiquadFilter();
    const convolverNode = audioContextInstance.createConvolver();
    const pannerNode = audioContextInstance.createPanner();

    // Load song audio
    const audioResponse = await fetch(new Request("viper.mp3"));
    const songAudioBuffer = await audioResponse.arrayBuffer();
    audioContextInstance.decodeAudioData(songAudioBuffer, decodedData => {
      setDecodedSongAudioData(decodedData);
      bufferSourceNode.buffer = decodedData;
    });

    // Load convolution audio
    const hallResponse = await fetch(new Request("hall.wav"));
    const hallAudioBuffer = await hallResponse.arrayBuffer();
    audioContextInstance.decodeAudioData(hallAudioBuffer, decodedData => {
      setDecodedConvolutionAudioData(decodedData);
    });

    // Set nodes, buffer and audio context in state
    setAudioContext(audioContextInstance);
    setNodes({
      bufferSource: { instance: bufferSourceNode, position: 0 },
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
            // Find the next non-bypassed node and connect this node to it
            const nextNode = nodeArray.find(({ bypass, position }) => {
              return !bypass && position > node.position;
            });
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
    nodes.bufferSource.instance.stop(0);
    // Refresh buffer source node so playing can continue
    const newNodes = { ...nodes };
    newNodes.bufferSource.instance = null;
    newNodes.bufferSource.instance = audioContext.createBufferSource();
    newNodes.bufferSource.instance.buffer = decodedSongAudioData;
    setNodes(newNodes);
    setIsPlaying(false);
  };

  return (
    <main>
      <H1>Webaudio API</H1>
      <Playground>
        <AudioNodeElement title={"Source"} id={"bufferSource"}>
          <button onClick={setup} disabled={audioContext}>
            Setup
          </button>
          <button onClick={handlePlay} disabled={!audioContext}>
            Play
          </button>
          <button onClick={handleStop} disabled={!audioContext}>
            Stop
          </button>
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
          decodedAudioData={decodedConvolutionAudioData}
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
