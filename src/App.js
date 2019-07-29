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
import { setupAudioContextAndAudioNodeGraph } from "./core/setupNodes";

function App() {
  // State
  let [songAudioBuffer, setSongAudioBuffer] = useState();
  let [impulseAudioBuffer, setImpulseAudioBuffer] = useState();
  let [audioContext, setAudioContext] = useState();
  let [nodes, setNodes] = useState();
  let [isPlaying, setIsPlaying] = useState(false);

  /*
   ** Note: storing and decoding large audio buffers is CPU and memory intensive.
   ** The <audio> element is best suited for large audio files: https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaElementSource
   ** However, we're using ArrayBuffers in order to avoid this IOS bug: https://bugs.webkit.org/show_bug.cgi?id=196293
   */

  // Load the audio files as ArrayBuffers on app start
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

  /*
   ** Note: User gesture is required to initiate AudioContext: https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
   */

  // This method sets up the audio context and audio node graph
  const onSetup = async () => {
    if (songAudioBuffer && impulseAudioBuffer && !audioContext) {
      // Use a copy of the buffers so the originals can be used again
      const songAudioBufferCopy = songAudioBuffer.slice(0);
      const impulseAudioBufferCopy = impulseAudioBuffer.slice(0);
      const {
        audioContextInstance,
        nodeGraph
      } = await setupAudioContextAndAudioNodeGraph(
        songAudioBufferCopy,
        impulseAudioBufferCopy
      );
      setAudioContext(audioContextInstance);
      setNodes(nodeGraph);
    }
  };

  // This method configures the audio node graph each time "nodes" is set
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
          <Button
            onClick={onSetup}
            dummy={audioContext || isLoading}
            disabled={audioContext || isLoading}
          >
            Setup
          </Button>
          <Button
            onClick={handlePlay}
            dummy={!audioContext || isPlaying || isLoading}
            disabled={!audioContext || isPlaying || isLoading}
          >
            Play
          </Button>
          <Button
            onClick={handleStop}
            dummy={!audioContext || !isPlaying || isLoading}
            disabled={!audioContext || !isPlaying || isLoading}
          >
            Stop
          </Button>
        </AudioNodeElement>
        <AnalyserComponent
          disabled={!isPlaying}
          analyserNode={nodes && nodes.analyser}
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
