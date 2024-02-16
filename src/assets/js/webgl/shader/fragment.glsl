varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uDisplacement;

#define PI 3.14159265359;

void main() {
  vec4 disp = texture2D(uDisplacement, vUv);
  float theta = disp.r * 2.0 * PI;

  vec2 dir = vec2(sin(theta), cos(theta));

  vec2 uv = vUv + dir * disp.r * 0.1;
  
  vec4 color = texture2D(uTexture, uv);
  // float a = disp.r * 1.4;

  gl_FragColor = vec4(color.rgb, 1.0);;
}