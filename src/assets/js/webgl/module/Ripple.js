import {
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Vector2,
  DoubleSide,
  Clock,
  WebGLRenderTarget,
  LinearFilter,
  RGBAFormat,
  MeshBasicMaterial,
  AdditiveBlending,
} from "three";
import { TextureLoad } from "./TextureLoad";

export class Ripple {
  constructor(stage, params, mouse, prevMouse) {
    this.stage = stage;
    this.params = params;
    this.mouse = mouse;
    this.prevMouse = prevMouse;

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.uniforms = null;
    this.clock = new Clock();
    this.max = 100;
    this.rippleMesh = [];
    
    this.currentWave = 0;

    this.setMesh();
    // this.setGui();
  }

  setMesh() {
    this.geometry = new PlaneGeometry(64, 64, 1, 1);
    for (let i = 0; i < this.max; i++) {
      let mate = new MeshBasicMaterial({
        color: 0xffffff,
        map: TextureLoad("assets/img/burash.png"),
        transparent: true,
        blending: AdditiveBlending,
        depthTest: false,
        depthWrite: false,
      });
      let rMesh = new Mesh(this.geometry, mate);
      rMesh.visible = false;
      rMesh.rotation.z = 2 * Math.PI * Math.random();
      this.stage.scene.add(rMesh);
      this.rippleMesh.push(rMesh);
      // console.log(mate.map);
    }
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

  // setGui() {
  //   if (GUI != null) {
  //     this.settings = {
  //       uColorFirst: [75 / 255, 141 / 255, 100 / 255],
  //       uColorSecond: [5 / 255, 19 / 255, 20 / 255],
  //     }
  //     const bgFolder = GUI.addFolder('BackGround');
  //     bgFolder.close();
  //     bgFolder.addColor(this.settings, 'uColorFirst').name('Color01').onChange(() => {
  //       this.material.uniforms.uColorFirst.value = this.settings.uColorFirst;
  //     });
  //     bgFolder.addColor(this.settings, 'uColorSecond').name('Color02').onChange(() => {
  //       this.material.uniforms.uColorSecond.value = this.settings.uColorSecond;
  //     });
  //   }
  // }

  onUpdate() {  
    // this.material.uniforms.uTime.value = this.clock.getElapsedTime();

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

    // this.stage.renderer.render(this.stage.scene1, this.stage.camera);
    this.trackMousePos();

  }

  onResize(props) {
    this.params.w = props.w;
    this.params.h = props.h;
    // this.material.uniforms.uResolution.value.x = this.params.w;
    // this.material.uniforms.uResolution.value.y = this.params.y;
    // this.mesh.scale.set(this.params.w, this.params.h, 0);
  }
  
}