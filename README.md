## About

The [webaudio API](https://www.w3.org/TR/webaudio/) is a system for playing and manipulating audio in the browser. This playground demonstrates the webaudio API's ability to load audio files and apply effects such as spatial effects, compression, filtering, convolution and wave shaping.

## Try it out

- Visit the [playground](https://webaudio-playground.netlify.com)
- Click "setup" and then "play" to get started
- Enable and disable audio nodes and play with the controls
- View the source code to see how the audio nodes are configured using the webaudio API

> Warning: the playground produces sound and it get's loud sometimes. 

## Development

### Node

- Download the code: `git clone git@github.com:geeogi/webaudio-playground.git`
- Navigate to the project: `cd webaudio-playground` 
- Install dependencies: `npm install` 
- Start the development server: `npm run start` 

### Docker

- Download the code: `git clone git@github.com:geeogi/webaudio-playground.git`
- Navigate to the project: `cd webaudio-playground` 
- Start the container: `docker-compose up` 

## Deploy

- Build the project as a static website: `yarn build` 
- Serve the `/build` directory 

## References 

- https://www.w3.org/TR/webaudio/
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- https://padenot.github.io/web-audio-perf/