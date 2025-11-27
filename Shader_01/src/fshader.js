export default `

varying vec2 vUv;
varying vec3 pos;
uniform float uTime;
uniform sampler2D myTexture;

void main() {

    vec2 uv = vUv;

    //vec4 texColor = texture2D( myTexture, vec2(uv.x, uv.y) );
    vec4 texColor = texture2D( myTexture, uv );
    
    //gl_FragColor = vec4(texColor.r, texColor.g, texColor.b, 1.0);
    gl_FragColor = vec4(texColor.rgb, 1.0);

    /* Divide the mesh into 2 colors based on x position (not used with texture)
    if (pos.x >= 0.0) {
        gl_FragColor = vec4(abs(sin(uTime)), 0.0, 0.0, 1.0);
    } else {
        gl_FragColor = vec4(0.0, abs(cos(uTime)), 0.0, 1.0);
    }*/
}
`;