import React, { useEffect, useRef, useState } from "react";
import { AudioNodeElement } from "../util/AudioNodeElement";

export const AnalyserNodeComponent = props => {
  const [looping, setLooping] = useState(false);

  const [currentMaxVoltage, setCurrentMaxVoltage] = useState(0);

  const waveformCanvas = useRef();

  const loop = () => {
    // Ensure node is initialised and is active
    if (props.analyserNode && !props.analyserNode.bypass) {
      const bufferLength = props.analyserNode.instance.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      props.analyserNode.instance.getByteTimeDomainData(dataArray);
      // Update graphs
      updateLevel(dataArray);
      updateWaveform(dataArray);
      // Loop
      requestAnimationFrame(loop);
      setLooping(true);
    } else {
      clearLevel();
      clearWaveform();
      setLooping(false);
    }
  };

  const updateLevel = dataArray => {
    // Find max sample
    const max = Math.max(...dataArray);
    // Convert 8bit waveform data [0, 255] to voltage [-1,1]
    const maxVoltage = (max - 128) / 128;
    // Set state to trigger re-render
    setCurrentMaxVoltage(maxVoltage);
  };

  const clearLevel = () => {
    setCurrentMaxVoltage(0);
  };

  const updateWaveform = dataArray => {
    if (waveformCanvas) {
      const context = waveformCanvas.current.getContext("2d");
      context.clearRect(0, 0, 130, 40);
      context.beginPath();
      dataArray.forEach((value, index) => {
        const y = (value / 128) * 40;
        const x = index;
        if (index === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      });
      context.stroke();
    }
  };

  const clearWaveform = () => {
    const context = waveformCanvas.current.getContext("2d");
    context.clearRect(0, 0, 130, 40);
  };

  useEffect(() => {
    if (!looping) {
      loop();
    }
  });

  return (
    <AudioNodeElement
      disabled={props.disabled}
      bypassed={props.analyserNode && props.analyserNode.bypass}
      title={"Visualiser"}
      id={"analyserNode"}
      setBypass={props.setBypass}
    >
      <label htmlFor="amplititude">Amplititude:</label>
      <meter
        name="amplitude"
        min="0"
        optimum="0.6"
        high="0.95"
        max="1"
        value={currentMaxVoltage}
      />
      <label htmlFor="waveform">Waveform:</label>
      <canvas
        name="waveform"
        ref={waveformCanvas}
        width="130px"
        height="40px"
      />
    </AudioNodeElement>
  );
};
