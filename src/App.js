import React, { useEffect, useState } from "react";
import { AudioNodeElement } from "./components/util/AudioNodeElement";
import { H1 } from "./components/util/H1";
import { Playground } from "./components/util/Playground";
import { AnalyserComponent } from "./components/webaudio/analyserComponent";
import { BiquadFilterComponent } from "./components/webaudio/biquadFilterComponent";
import { ConvolverComponent } from "./components/webaudio/convolverComponent";
import { DynamicsCompressorComponent } from "./components/webaudio/dynamicsCompressorComponent";
import { GainComponent } from "./components/webaudio/gainComponent";
import { PannerComponent } from "./components/webaudio/pannerComponent";
import { WaveShaperComponent } from "./components/webaudio/waveshaperComponent";
import { connectNodes } from "./core/connectNodes";
import { setupNodes } from "./core/setupNodes";
import { Button } from "./components/util/Button";

function App() {
  // State
  let [audioContext, setAudioContext] = useState();
  let [nodes, setNodes] = useState();
  let [isPlaying, setIsPlaying] = useState(false);

  // This method sets up the audio context and node graph
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
          <Button onClick={doSetup} disabled={audioContext}>
            Setup
          </Button>
          <Button onClick={handlePlay} disabled={!audioContext || isPlaying}>
            Play
          </Button>
          <Button onClick={handleStop} disabled={!audioContext || !isPlaying}>
            Stop
          </Button>
        </AudioNodeElement>
        <AnalyserComponent
          isHalted={
            !isPlaying || !nodes || !nodes.analyser || nodes.analyser.bypass
          }
          disabled={!isPlaying}
          analyserNode={nodes && nodes.analyser}
          setBypass={setBypass}
        />
        <WaveShaperComponent
          disabled={!isPlaying}
          waveShaperNode={nodes && nodes.waveShaper}
          setBypass={setBypass}
        />
        <DynamicsCompressorComponent
          disabled={!isPlaying}
          dynamicsCompressorNode={nodes && nodes.dynamicsCompressor}
          setBypass={setBypass}
        />
        <GainComponent
          disabled={!isPlaying}
          gainNode={nodes && nodes.gain}
          setBypass={setBypass}
        />

        <BiquadFilterComponent
          disabled={!isPlaying}
          biquadFilterNode={nodes && nodes.biquadFilter}
          setBypass={setBypass}
        />
        <ConvolverComponent
          disabled={!isPlaying}
          convolverNode={nodes && nodes.convolver}
          setBypass={setBypass}
        />
        <PannerComponent
          disabled={!isPlaying}
          pannerNode={nodes && nodes.panner}
          setBypass={setBypass}
        />
      </Playground>
    </main>
  );
}

export default App;
