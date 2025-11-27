export  default `

varying vec2 vUv;
varying vec3 pos;
uniform float uTime, waveAmplitude;

void main()   {

    vUv = uv;
    pos = position;

    // projectionMatrix, modelViewMatrix, position -> passed in from Three.js
    gl_Position = projectionMatrix
        * modelViewMatrix
        * vec4(position.x, position.y/8.0 + waveAmplitude * sin(position.z/2.0 + uTime), position.z, 1.0);
}`