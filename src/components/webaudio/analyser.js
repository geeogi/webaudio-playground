import React, { useEffect, useRef, useState } from "react";
import { AudioNodeElement } from "../util/AudioNodeElement";

export const AnalyserNodeComponent = props => {
  const [looping, setLooping] = useState(false);

  const [currentMaxVoltage, setCurrentMaxVoltage] = useState(0);

  const waveformCanvas = useRef();
  const frequencyCanvas = useRef();
  const CANVAS_WIDTH = 150;
  const CANVAS_HEIGHT = 40;

  const updateLevelMeter = timeDomainDataArray => {
    // Find max sample
    const max = Math.max(...timeDomainDataArray);
    // Convert 8bit waveform data [0, 255] to voltage [-1,1]
    const maxVoltage = (max - 128) / 128;
    // Set state to trigger re-render
    setCurrentMaxVoltage(maxVoltage);
  };

  const clearLevelMeter = () => {
    setCurrentMaxVoltage(0);
  };

  const updateWaveformCanvas = timeDomainDataArray => {
    if (waveformCanvas) {
      const context = waveformCanvas.current.getContext("2d");
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      context.beginPath();
      timeDomainDataArray.forEach((value, index) => {
        const y = (value / 128) * CANVAS_HEIGHT;
        const x = index * (CANVAS_WIDTH / timeDomainDataArray.length);
        if (index === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      });
      context.stroke();
    }
  };

  const clearWaveformCanvas = () => {
    const context = waveformCanvas.current.getContext("2d");
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  const updateFrequencyCanvas = frequencyDataArray => {
    if (frequencyCanvas) {
      const context = frequencyCanvas.current.getContext("2d");
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      context.beginPath();
      frequencyDataArray.forEach((value, index) => {
        // Plot every 2nd bar
        if (index % 2 === 0) {
          const y = (value / 255) * CANVAS_HEIGHT;
          const x = index;
          context.fillRect(x, CANVAS_HEIGHT - y, 1, CANVAS_HEIGHT);
        }
      });
      context.stroke();
    }
  };

  const clearFrequencyCanvas = () => {
    const context = frequencyCanvas.current.getContext("2d");
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  const loop = () => {
    // Ensure node is initialised and is active
    if (props.analyserNode && !props.analyserNode.bypass) {
      const bufferLength = props.analyserNode.instance.frequencyBinCount;
      const timeDomainDataArray = new Uint8Array(bufferLength);
      const frequencyDataArray = new Uint8Array(bufferLength);
      props.analyserNode.instance.getByteTimeDomainData(timeDomainDataArray);
      props.analyserNode.instance.getByteFrequencyData(frequencyDataArray);

      // Update graphs
      updateLevelMeter(timeDomainDataArray);
      updateWaveformCanvas(timeDomainDataArray);
      updateFrequencyCanvas(frequencyDataArray);
      // Loop
      requestAnimationFrame(loop);
      setLooping(true);
    } else {
      clearLevelMeter();
      clearWaveformCanvas();
      clearFrequencyCanvas();
      setLooping(false);
    }
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
      <label htmlFor="frequency">Frequency:</label>
      <canvas
        name="frequency"
        ref={frequencyCanvas}
        width={CANVAS_WIDTH + "px"}
        height={CANVAS_HEIGHT + "px"}
      />
      <label htmlFor="waveform">Waveform:</label>
      <canvas
        name="waveform"
        ref={waveformCanvas}
        width={CANVAS_WIDTH + "px"}
        height={CANVAS_HEIGHT + "px"}
      />
    </AudioNodeElement>
  );
};
