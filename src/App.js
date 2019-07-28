import React, { useEffect, useState } from "react";
import { AudioNodeElement } from "./components/base/AudioNodeElement";
import { Box } from "./components/base/Box";
import { Button } from "./components/base/Button";
import { H1 } from "./components/base/H1";
import { P } from "./components/base/P";
import { Playground } from "./components/base/Playground";
import { AnalyserComponent } from "./components/webaudio/analyserComponent";
import { BiquadFilterComponent } from "./components/webaudio/biquadFilterComponent";
import { ConvolverComponent } from "./components/webaudio/convolverComponent";
import { DynamicsCompressorComponent } from "./components/webaudio/dynamicsCompressorComponent";
import { GainComponent } from "./components/webaudio/gainComponent";
import { PannerComponent } from "./components/webaudio/pannerComponent";
import { WaveShaperComponent } from "./components/webaudio/waveshaperComponent";
import { connectNodes } from "./core/connectNodes";
import { setupNodes } from "./core/setupNodes";

function App() {
  // State
  let [songAudioBuffer, setSongAudioBuffer] = useState();
  let [impulseAudioBuffer, setImpulseAudioBuffer] = useState();
  let [audioContext, setAudioContext] = useState();
  let [nodes, setNodes] = useState();
  let [isPlaying, setIsPlaying] = useState(false);

  // Here we load the audio files as ArrayBuffers
  // Note: using buffers for long audio files is CPU and memory intensive.
  // The <audio> element is  better suited for this purpose.
  // Currently there's a bug on IOS so we're not using it: https://bugs.webkit.org/show_bug.cgi?id=196293
  useEffect(() => {
    if (!songAudioBuffer) {
      fetch(new Request("konkreet-clip.mp3")).then(songAudio => {
        songAudio.arrayBuffer().then(songBuffer => {
          setSongAudioBuffer(songBuffer);
        });
      });
    }
    if (!impulseAudioBuffer) {
      fetch(new Request("hall.mp3")).then(impulseAudio => {
        impulseAudio.arrayBuffer().then(impulseBuffer => {
          setImpulseAudioBuffer(impulseBuffer);
        });
      });
    }
  });

  // This method sets up the audio context and node graph
  const doSetup = async () => {
    if (songAudioBuffer && impulseAudioBuffer && !audioContext) {
      // Create a copy of the buffers so they can be used again
      const songAudioBufferCopy = songAudioBuffer.slice(0);
      const impulseAudioBufferCopy = impulseAudioBuffer.slice(0);
      const { audioContextInstance, nodeGraph } = await setupNodes(
        songAudioBufferCopy,
        impulseAudioBufferCopy
      );
      setAudioContext(audioContextInstance);
      setNodes(nodeGraph);
    }
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

  const isLoading = Boolean(!songAudioBuffer || !impulseAudioBuffer);

  return (
    <main>
      <Box>
        <H1>Webaudio API</H1>
        <P>
          <span>Sound on </span>
          <span role="img" aria-label="speaker">
            🔊
          </span>
        </P>
      </Box>
      <Playground>
        <AudioNodeElement title={"Source"} id={"bufferSource"}>
          {isLoading ? (
            <P>
              <strong>Loading...</strong>
            </P>
          ) : (
            <>
              <Button
                onClick={doSetup}
                disabled={
                  audioContext || !songAudioBuffer || !impulseAudioBuffer
                }
              >
                Setup
              </Button>
              <Button
                onClick={handlePlay}
                disabled={!audioContext || isPlaying}
              >
                Play
              </Button>
              <Button
                onClick={handleStop}
                disabled={!audioContext || !isPlaying}
              >
                Stop
              </Button>
            </>
          )}
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
