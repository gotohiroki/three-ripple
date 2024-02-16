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

export default class webGL {
  // コンストラクタ
  constructor(containerSelector) {
    // canvasタグが配置されるコンテナを取得
    this.container = document.querySelector(containerSelector);

    this.renderParam = {
      clearColor: 0x000000,
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.cameraParam = {
      fov: 45,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 100,
      fovRad: null,
      dist: null,
      lookAt: new Vector3(0, 0, 0),
      x: 0,
      y: 0,
      z: 2,
    };

    this.brush = "assets/img/burash01.png";
    this.image = "assets/img/image.jpg";

    this.mouse = new Vector2(0, 0);
    this.prevMouse = new Vector2(0, 0);
    this.currentWave = 0;

    this.scene = null;
    this.scene1 = null;
    this.camera = null;
    this.renderer = null;
    this.loader = null;
    this.texture = null;
    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.uniforms = null;
    this.clock = new Clock();
  }

  init() {
    this._setScene();
    this._setRender();
    this._setCamera();
    this._setGui();
    // this._setContorols();
    this._setTexture();
    this._createMesh();
    this._ripple();
    this.mouseEvents();
  }

  _setScene() {
    this.scene = new Scene();
    this.scene1 = new Scene();
  }

  _setRender() {
    this.renderer = new WebGLRenderer({
      antialias: true,
      transparent: true,
    });
    this.renderer.setClearColor(new Color(this.renderParam.clearColor));
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.renderParam.width, this.renderParam.height);

    this.baseTexture = new WebGLRenderTarget(this.renderParam.width, this.renderParam.height, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
    });

    this.container.appendChild(this.renderer.domElement);
  }

  _setCamera() {
    this.camera = new OrthographicCamera(
      (this.renderParam.height * this.cameraParam.aspect) / -2,
      (this.renderParam.height * this.cameraParam.aspect) / 2,
      this.renderParam.height / 2,
      this.renderParam.height / -2,
      -1000,
      1000,
    );
    this.camera.position.set(this.cameraParam.x, this.cameraParam.y, this.cameraParam.z);
  }

  _setGui() {
    let that = this;
    this.settings = {
      progress: 0,
    };
    this.gui = new GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  _setContorols() {
    this.contorols = new OrbitControls(this.camera, this.renderer.domElement);
  }

  _setTexture() {
    this.texture = new TextureLoader().load(this.image);
  }

  _createMesh() {
    this.geometry = new PlaneGeometry(this.renderParam.width, this.renderParam.height, 32, 32);
    this.material = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDisplacement: { value: null },
        uTexture: { value: this.texture },
        uAspect: { value: this.renderParam.height / this.renderParam.width },
      },
      vertexShader,
      fragmentShader,
      // wireframe: true,
      side: DoubleSide,
    });
    console.log(this.material.uniforms.uTexture.value);
    this.mesh = new Mesh(this.geometry, this.material);
    this.scene1.add(this.mesh);
  }

  mouseEvents() {
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX - this.renderParam.width / 2;
      this.mouse.y = this.renderParam.height / 2 - e.clientY;
    });
  }

  _ripple() {
    this.max = 100;

    this.rippleGeometry = new PlaneGeometry(64, 64, 1, 1);
    this.rippleMesh = [];
    for (let i = 0; i < this.max; i++) {
      let mate = new MeshBasicMaterial({
        color: 0xffffff,
        map: new TextureLoader().load(this.brush),
        transparent: true,
        blending: AdditiveBlending,
        depthTest: false,
        depthWrite: false,
      });
      let rMesh = new Mesh(this.rippleGeometry, mate);
      rMesh.visible = false;
      rMesh.rotation.z = 2 * Math.PI * Math.random();
      this.scene.add(rMesh);
      this.rippleMesh.push(rMesh);
    }
  }

  _render() {
    this.renderer.setRenderTarget(this.baseTexture);
    this.renderer.render(this.scene, this.camera);
    this.material.uniforms.uDisplacement.value = this.baseTexture.texture;
    this.renderer.setRenderTarget(null);
    this.renderer.clear();
    this.renderer.render(this.scene1, this.camera);
  }

  setNewWave(x, y, index) {
    let mesh = this.rippleMesh[index];
    mesh.visible = true;
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.scale.x = mesh.scale.y = 1.0;
    mesh.material.opacity = 0.5;
  }

  trackMousePos() {
    if (Math.abs(this.mouse.x - this.prevMouse.x) < 4 && Math.abs(this.mouse.y - this.prevMouse.y) < 4) {
    } else {
      this.currentWave = (this.currentWave + 1) % this.max;
      this.setNewWave(this.mouse.x, this.mouse.y, this.currentWave);
    }

    this.prevMouse.x = this.mouse.x;
    this.prevMouse.y = this.mouse.y;
  }

  // 毎フレーム呼び出す
  update() {
    // this.material.uniforms.uTime.value = this.clock.getElapsedTime();
    requestAnimationFrame(this.update.bind(this));
    this.rippleMesh.forEach((mesh) => {
      if (mesh.visible) {
        mesh.rotation.z += 0.02;
        mesh.material.opacity *= 0.96;
        mesh.scale.x = 0.982 * mesh.scale.x + 0.108;
        mesh.scale.y = mesh.scale.x;
        if (mesh.material.opacity < 0.002) {
          mesh.visible = false;
        }
      }
    });

    this.trackMousePos();
    this._render();
  }

  onResize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    this.camera.aspect = windowWidth / windowHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(windowWidth, windowHeight);
    // this.cameraParam.fovRad = (this.cameraParam.fov / 2) * (Math.PI / 180);
    // this.cameraParam.dist = windowHeight / 2 / Math.tan(this.cameraParam.fovRad);
    // this.camera.position.z = this.cameraParam.dist;
    this._render();
    // this.mesh.scale.x = windowWidth;
    // this.mesh.scale.y = windowHeight;
  }
}
