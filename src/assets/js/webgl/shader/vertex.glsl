uniform float uAspect;

varying vec2 vUv;
float PI = 3.1415926535897932384626433832795;

void main() {
  vUv = uv - 0.5;
  vUv.y *= uAspect;
  vUv += 0.5;

  vec3 pos = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}