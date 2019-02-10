function testFabrik() {
  // console.log('testing FABRIK');
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 10;
  renderer = new THREE.WebGLRenderer(antialias = true);
  renderer.setSize(window.innerWidth, window.innerHeight);

  function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
  }

  const point0 = createPoint({ x: 0, y: 0, z: 0, size: 3});
  const point1 = createPoint({ x: 0, y: 1, z: 0, size: 3});
  const point2 = createPoint({ x: 0, y: 2, z: 0, size: 3});

  point0.traverse((childObj) => {
    childObj.frustumCulled = false;
  });

  scene.add(point0);

  point1.traverse((childObj) => {
    childObj.frustumCulled = false;
  });

  scene.add(point1);

  point2.traverse((childObj) => {
    childObj.frustumCulled = false;
  });

  scene.add(point2);

  let points = [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 2, z: 0 }
  ];

  console.log(points[0].x, points[0].y, points[0].z, points[1].x, points[1].y, points[1].z);

  const line0 = createLine({
    x0: points[0].x,
    y0: points[0].y,
    z0: points[0].z,
    x1: points[1].x,
    y1: points[1].y,
    z1: points[1].z,
  });

  const line1 = createLine({
    x0: points[1].x,
    y0: points[1].y,
    z0: points[1].z,
    x1: points[2].x,
    y1: points[2].y,
    z1: points[2].z,
  });

  line0.traverse((childObj) => {
    childObj.frustumCulled = false;
  });

  console.log(line0);

  scene.add(line0);

  line1.traverse((childObj) => {
    childObj.frustumCulled = false;
  });

  scene.add(line1);

  document.body.appendChild(renderer.domElement);

  animate();

  let xVal = 0;
  let yVal = 2;
  let zVal = 0;

  const moveSpeed = 0.01;


  const positionUp = { x: 0, y: 2, z: 0 };
  const positionDown = { x: 0.2, y: 0.75, z: 0 };

  const goalPositions = [
    positionUp,
    positionDown
  ];

  let currentPosition = 0;

  window.setInterval(function() {
    const goalPos = goalPositions[currentPosition];

    const xMove = moveTowards(xVal, goalPos.x, moveSpeed);
    xVal = xMove.newVal;
    const yMove = moveTowards(yVal, goalPos.y, moveSpeed);
    yVal = yMove.newVal;
    const zMove = moveTowards(zVal, goalPos.z, moveSpeed);
    zVal = zMove.newVal;

    const intermediateGoalPos = { x: xVal, y: yVal, z: zVal };

    points = fabrik(points, intermediateGoalPos, 1);

    point0.geometry.vertices[0].x = points[0].x;
    point0.geometry.vertices[0].y = points[0].y;
    point0.geometry.vertices[0].z = points[0].z;
    point0.geometry.verticesNeedUpdate = true;

    point1.geometry.vertices[0].x = points[1].x;
    point1.geometry.vertices[0].y = points[1].y;
    point1.geometry.vertices[0].z = points[1].z;
    point1.geometry.verticesNeedUpdate = true;

    point2.geometry.vertices[0].x = points[2].x;
    point2.geometry.vertices[0].y = points[2].y;
    point2.geometry.vertices[0].z = points[2].z;
    point2.geometry.verticesNeedUpdate = true;

    line0.geometry.vertices[0].x = points[0].x;
    line0.geometry.vertices[0].y = points[0].y;
    line0.geometry.vertices[0].z = points[0].z;
    line0.geometry.vertices[1].x = points[1].x;
    line0.geometry.vertices[1].y = points[1].y;
    line0.geometry.vertices[1].z = points[1].z;
    line0.geometry.verticesNeedUpdate = true;

    line1.geometry.vertices[0].x = points[1].x;
    line1.geometry.vertices[0].y = points[1].y;
    line1.geometry.vertices[0].z = points[1].z;
    line1.geometry.vertices[1].x = points[2].x;
    line1.geometry.vertices[1].y = points[2].y;
    line1.geometry.vertices[1].z = points[2].z;
    line1.geometry.verticesNeedUpdate = true;

    if (xMove.reached && yMove.reached && zMove.reached) {
      currentPosition = (currentPosition + 1) % 2;
    }

  }, 10);
}

testFabrik();
