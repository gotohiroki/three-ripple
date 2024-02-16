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
} from "three";
import { TextureLoad } from "./TextureLoad";
import vertexShader from "../shader/vertex.glsl";
import fragmentShader from "../shader/fragment.glsl";

export class Plane {
  constructor(stage, params) {
    this.stage = stage;
    this.params = params;

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.uniforms = null;
    this.clock = new Clock();

    this.baseTexture = new WebGLRenderTarget(this.params.w, this.params.h, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
    });

    this.setMesh();
    // this.setGui();
  }

  setMesh() {
    this.geometry = new PlaneGeometry(this.params.w, this.params.h, 32, 32);
    this.material = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDisplacement: { value: null },
        uTexture: { value: TextureLoad("assets/img/image.jpg") },
        uAspect: { value: window.innerHeight / window.innerWidth },
      },
      vertexShader,
      fragmentShader,
      // wireframe: true,
      // side: DoubleSide,
    });
    console.log(this.material.uniforms.uTexture.value);
    this.mesh = new Mesh(this.geometry, this.material);
    this.stage.scene1.add(this.mesh);
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
    this.stage.renderer.setRenderTarget(this.baseTexture);
    this.stage.renderer.render(this.stage.scene, this.stage.camera);
    this.material.uniforms.uDisplacement.value = this.baseTexture.texture;
    this.stage.renderer.setRenderTarget(null);
    this.stage.renderer.clear();
    this.stage.renderer.render(this.stage.scene1, this.stage.camera);
  }

  onResize(props) {
    this.params.w = props.w;
    this.params.h = props.h;
    // this.material.uniforms.uResolution.value.x = this.params.w;
    // this.material.uniforms.uResolution.value.y = this.params.y;
    // this.mesh.scale.set(this.params.w, this.params.h, 0);
  }
  
}