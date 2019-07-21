import React, { useEffect, useState } from "react";
import { H1 } from "./components/util/H1";
import { Playground } from "./components/util/Playground";
import { BiquadFilterComponent } from "./components/webaudio/biquadFilterNode";
import { ConvolverComponent } from "./components/webaudio/convolverNode";
import { DynamicsCompressorComponent } from "./components/webaudio/dynamicsCompressorNode";
import { GainComponent } from "./components/webaudio/gainNode";
import { PannerComponent } from "./components/webaudio/pannerNode";
import { WaveShaperComponent } from "./components/webaudio/waveshaperNode";
import { AnalyserComponent } from "./components/webaudio/analyserNode";
import { AudioNodeElement } from "./components/util/AudioNodeElement";
import { setupNodes } from "./core/setupNodes";
import { connectNodes } from "./core/connectNodes";

function App() {
  // Meta
  let [audioContext, setAudioContext] = useState();
  let [nodes, setNodes] = useState();
  let [isPlaying, setIsPlaying] = useState(false);

  // This method creates the audio context and node graph
  const doSetup = async () => {
    const { audioContextInstance, nodeGraph } = await setupNodes();
    setAudioContext(audioContextInstance);
    setNodes(nodeGraph);
  };

  // This method connects the audio node graph each time "nodes" is set
  useEffect(() => {
    if (nodes) {
      connectNodes(nodes);
    }
  }, [nodes]);

  // This method can be used to set the "bypass" flag of a node
  const setBypass = (nodeId, shouldBypass) => {
    const newNodes = { ...nodes };
    newNodes[nodeId].bypass = shouldBypass;
    setNodes(newNodes);
  };

  // These methods play and stop the bufferSourceNode
  const handlePlay = async () => {
    setIsPlaying(true);
    audioContext.resume();
    nodes.bufferSource.instance.start(0);
  };
  const handleStop = () => {
    nodes.bufferSource.instance.stop(0);
    setAudioContext(null);
    setIsPlaying(false);
  };

  return (
    <main>
      <H1>Webaudio API</H1>
      <Playground>
        <AudioNodeElement title={"Source"} id={"bufferSource"}>
          <button onClick={doSetup} disabled={audioContext}>
            Initalise
          </button>
          <button onClick={handlePlay} disabled={!audioContext || isPlaying}>
            Play
          </button>
          <button onClick={handleStop} disabled={!audioContext || !isPlaying}>
            Stop
          </button>
        </AudioNodeElement>
        <AnalyserComponent
          isHalted={
            !isPlaying || !nodes || !nodes.analyser || nodes.analyser.bypass
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
