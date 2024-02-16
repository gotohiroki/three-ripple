import { Color, PerspectiveCamera, OrthographicCamera, Scene, Vector3, WebGLRenderer } from "three";

export class Stage {
  constructor(selector, params) {
    this.container = document.querySelector(selector);
    this.params = params;

    this.renderParam = {
      clearColor: 0x081640,
      width: this.params.w,
      height: this.params.h,
    };

    this.cameraParam = {
      fov: 45,
      aspect: this.params.aspect,
      near: 0.1,
      far: 100,
      fovRad: null,
      dist: null,
      lookAt: new Vector3(0, 0, 0),
      x: 0,
      y: 0,
      z: 2,
    };

    this.scene = null;
    this.scene1 = null;
    this.camera = null;
    this.renderer = null;

    this.init();
  }

  init() {
    this.setRenderer();
    this.setScene();
    this.setCamera();
  }

  setScene() {
    this.scene = new Scene();
    this.scene1 = new Scene();
  }

  updateRenderer() {
    this.renderer.setSize(this.renderParam.width, this.renderParam.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // this.renderer.sortObjects = false;
    // this.renderer.outputEncoding = sRGBEncoding;
  }

  setRenderer() {
    this.renderer = new WebGLRenderer({
      antialias: true,
      transparent: true,
    });
    this.renderer.setClearColor(new Color(this.renderParam.clearColor));
    this.updateRenderer();

    this.container.appendChild(this.renderer.domElement);
  }

  updateCamera() {
    this.camera.aspect = this.cameraParam.aspect;
    this.camera.updateProjectionMatrix();
  }

  setCamera() {
    // ウィンドウとwebGLの座標を一致させるため、描画がウィンドウぴったりになるようカメラを調整
    // this.camera = new PerspectiveCamera(
    //   this.cameraParam.fov, 
    //   this.cameraParam.aspect, 
    //   this.cameraParam.near, 
    //   this.cameraParam.far
    // );

    this.camera = new OrthographicCamera (
      this.renderParam.height * this.cameraParam.aspect / - 2,
      this.renderParam.height * this.cameraParam.aspect / 2,
      this.renderParam.height / 2,
      this.renderParam.height / - 2,
      -1000,
      1000
    );

    this.camera.position.set(
      this.cameraParam.x,
      this.cameraParam.y,
      this.cameraParam.z
    );

    // this.cameraParam.fovRad = (this.cameraParam.fov / 2) * (Math.PI / 180);
    // this.cameraParam.dist = this.renderParam.height / 2 / Math.tan(this.cameraParam.fovRad);
    // this.camera.position.z = this.cameraParam.dist;
    this.updateCamera();
  }

  onUpdate() {
    if(this.renderer != null) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  onResize(props) {
    this.params.w = props.w;
    this.params.h = props.h;
    this.params.aspect = props.aspect;
    this.updateRenderer();
    this.updateCamera();
  }
}
