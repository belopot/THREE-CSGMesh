import * as THREE from "../lib/three.module.js";
import CSG from "../three-csg.js";
import app from "../v2/app3.js";
let { scene } = app;

let mkMat = (color) =>
  new THREE.MeshStandardMaterial({
    color: color,
    roughness: 1,
    metalness: 0.8,
    // wireframe: true,
  });

let box = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 100, 100, ),
  mkMat("grey")
);
scene.add(box);
let b1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.5), mkMat("blue"));
b1.position.x = 0;
scene.add(b1);

let b2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.5), mkMat("grey"));
b2.position.x = 0.5;
// scene.add(b2);

function doCSG(a, b, op, mat) {
  let bspA = CSG.fromMesh(a);
  let bspB = CSG.fromMesh(b);
  let bspC = bspA[op](bspB);
  let result = CSG.toMesh(bspC, a.matrix, mat);
  result.castShadow = result.receiveShadow = true;
  return result;
}

let subMaterial = mkMat("red");
let results = [];

function recompute() {
  for (let i = 0; i < results.length; i++) {
    let m = results[i];
    m.parent.remove(m);
    m.geometry.dispose();
  }
  results = [];

  box.updateMatrix();
  b1.updateMatrix();
  b2.updateMatrix();

  const a = doCSG(box, b1, "subtract", subMaterial);
  // const b = doCSG(a, b2, "subtract", subMaterial);

  results.push(a);

  for (let i = 0; i < results.length; i++) {
    let r = results[i];
    r.castShadow = r.receiveShadow = true;
    scene.add(r);

    r.position.z += -5 + (i % 3) * 5;
    r.position.x += -5 + ((i / 3) | 0) * 10;
  }
}
recompute();

document.addEventListener("afterRender", () => {
  let time = performance.now();
  //   sphere.position.x = Math.sin(time * 0.001) * 2;
  //   sphere.position.z = Math.cos(time * 0.0011) * 0.5;
  //   sphere.position.t = Math.sin(time * -0.0012) * 0.5;
  //   recompute();
});
