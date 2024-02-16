import {
  Color,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Vector3,
  WebGLRenderer,
  DoubleSide,
  MeshBasicMaterial,
  Clock,
  Vector4,
  SphereGeometry,
  Vector2,
  AdditiveBlending,
  OrthographicCamera,
  LinearFilter,
  RGBAFormat,
  WebGLRenderTarget,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertexShader from "./shader/vertex.glsl";
import fragmentShader from "./shader/fragment.glsl";
import GUI from "lil-gui";

import { Stage } from "./module/Stage";
import { Plane } from "./module/Plane";
import { Ripple } from "./module/Ripple";

export class WebGL {
  // コンストラクタ
  constructor(body, params) {
    this.body = body;
    this.params = params;

    this.stage = null;
    this.plane = null;
    this.ripple = null;

    this.mouse = new Vector2(0, 0);
    this.prevMouse = new Vector2(0, 0);

    this.mouseEvents();
    this.setModule();

  }

  setModule() {
    this.stage = new Stage("#webgl", this.params);
    this.plane = new Plane(this.stage, this.params);
    this.ripple = new Ripple(this.stage, this.params, this.mouse, this.prevMouse);
  } 

  mouseEvents() {
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX - this.params.w / 2;
      this.mouse.y = this.params.h / 2 - e.clientY;
    });
  }

  // 毎フレーム呼び出す
  onUpdate() {
    requestAnimationFrame(this.onUpdate.bind(this));
    this.stage.onUpdate();
    this.plane.onUpdate();
    this.ripple.onUpdate();
  }

  onResize(props) {
    this.params.w = props.w;
    this.params.h = props.h;
    this.params.aspect = props.aspect;

    this.stage.onResize(props);
    this.plane.onUpdate();
    this.ripple.onUpdate();
  }
}
