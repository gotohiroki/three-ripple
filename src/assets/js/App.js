import {WebGL} from "./webgl";
import "../scss/app.scss";


window.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const params = {
    w: window.innerWidth,
    h: window.innerHeight,
    aspect: 0,
  };
  params.aspect = params.w / params.h;
  const webgl = new WebGL(body, params);
  webgl.onUpdate();

  window.addEventListener("resize", () => {
    params.w = window.innerWidth;
    params.h = window.innerHeight;
    params.aspect = params.w / params.h;

    const props = {
      w: params.w,
      h: params.h,
      aspect: params.aspect,
    };

    webgl.onResize(props);
  });
});
