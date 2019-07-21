export const setupNodes = async () => {
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

  // Configure analyserNode
  analyserNode.fftSize = 256;

  // Configure waveShaperNode
  const curve = new Float32Array(256);
  curve.forEach((_, i) => {
    const x = (i * 2) / 256 - 1;
    curve[i] = ((Math.PI + 15) * x) / (Math.PI + 15 * Math.abs(x));
  });
  waveShaperNode.curve = curve;
  waveShaperNode.oversample = "4x";

  // Configure bufferSourceNode
  const audioResponse = await fetch(new Request("viper.mp3"));
  const songAudioBuffer = await audioResponse.arrayBuffer();
  audioContextInstance.decodeAudioData(songAudioBuffer, decodedData => {
    bufferSourceNode.buffer = decodedData;
  });

  // Configure convolverNode
  const hallResponse = await fetch(new Request("hall.wav"));
  const hallAudioBuffer = await hallResponse.arrayBuffer();
  audioContextInstance.decodeAudioData(hallAudioBuffer, decodedData => {
    convolverNode.buffer = decodedData;
  });

  // Return node graph and audio context
  return {
    audioContextInstance,
    nodeGraph: {
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
    }
  };
};
