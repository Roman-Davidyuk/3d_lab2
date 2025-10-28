import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// --- 1. Налаштування Сцени ---
const gui = new dat.GUI();
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const sizes = { width: window.innerWidth, height: window.innerHeight };
const clock = new THREE.Clock();

// --- 2. Текстури та Завантажувачі (Використовуємо відносні шляхи './folder/') ---
const textureLoader = new THREE.TextureLoader();

// --- Підлога ---
const floorAlphaTexture = textureLoader.load("./floor/alpha.jpg");
const floorColorTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg"
);
const floorARMTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg"
);
const floorNormalTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg"
);
const floorDisplacementTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg"
);

// Налаштування повторення
const repeatSettings = new THREE.Vector2(8, 8);
[
  floorColorTexture,
  floorARMTexture,
  floorNormalTexture,
  floorDisplacementTexture,
].forEach((texture) => {
  texture.repeat.copy(repeatSettings);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
});
floorColorTexture.colorSpace = THREE.SRGBColorSpace;

// --- Стіни ---
const wallColorTexture = textureLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg"
);
wallColorTexture.colorSpace = THREE.SRGBColorSpace;
const wallARMTexture = textureLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg"
);
const wallNormalTexture = textureLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg"
);

// --- Дах ---
const roofColorTexture = textureLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg"
);
roofColorTexture.colorSpace = THREE.SRGBColorSpace;
const roofARMTexture = textureLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg"
);
const roofNormalTexture = textureLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg"
);

// Налаштування повторення даху
roofColorTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);
roofColorTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;

// --- Кущі ---
const bushColorTexture = textureLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg"
);
bushColorTexture.colorSpace = THREE.SRGBColorSpace;
const bushARMTexture = textureLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg"
);
const bushNormalTexture = textureLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg"
);

// --- Могили ---
const graveColorTexture = textureLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg"
);
const graveARMTexture = textureLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg"
);
const graveNormalTexture = textureLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg"
);

// --- Двері ---
const doorColorTexture = textureLoader.load("./door/color.jpg");
const doorAlphaTexture = textureLoader.load("./door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("./door/height.jpg");
const doorNormalTexture = textureLoader.load("./door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("./door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("./door/roughness.jpg");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

// --- 3. Об'єкти Сцени ---

// --- 3.1. Підлога ---
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    map: floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: -0.2,
    alphaMap: floorAlphaTexture,
    transparent: true,
  })
);
floor.rotation.x = -Math.PI * 0.5;
floor.receiveShadow = true;
scene.add(floor);

// Налаштування для Debug UI (Підлога)
gui
  .add(floor.material, "displacementScale")
  .min(0)
  .max(1)
  .step(0.001)
  .name("floorDisplacementScale");
gui
  .add(floor.material, "displacementBias")
  .min(-1)
  .max(1)
  .step(0.001)
  .name("floorDisplacementBias");

// --- 3.2. Контейнер Будинку та Стіни ---
const house = new THREE.Group();
scene.add(house);

// Стіни
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
    depthWrite: true,
  })
);
walls.position.y = 1.25;
walls.castShadow = true;
house.add(walls);

// --- 3.3. Дах ---
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  })
);
roof.position.y = 2.5 + 0.75;
roof.rotation.y = Math.PI * 0.25;
roof.castShadow = true;
house.add(roof);

// --- 3.4. Двері (Виправлено UV2 та матеріал) ---
const doorGeometry = new THREE.PlaneGeometry(2.2, 2.2, 100, 100);
doorGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(doorGeometry.attributes.uv.array, 2)
);

const doorMaterial = new THREE.MeshStandardMaterial({
  map: doorColorTexture,
  alphaMap: doorAlphaTexture,

  aoMap: doorAmbientOcclusionTexture,
  metalness: 0,
  roughness: 1,
});

const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.y = 1;
door.position.z = 2.05;
door.castShadow = true;
door.renderOrder = 1;

house.add(door);

// --- 3.5. Кущі ---
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);
[bush1, bush2, bush3, bush4].forEach((bush) => (bush.castShadow = true));

// --- 3.6. Могили (Виправлено UV2 для текстур) ---
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);

// *** ДОДАНО UV2 ДЛЯ КОРЕКТНОГО ВІДОБРАЖЕННЯ AO MAP ***
graveGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(graveGeometry.attributes.uv.array, 2)
);
// *************************************************

const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
});

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;

  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0.4 - Math.random() * 0.25, z);
  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;

  grave.castShadow = true;
  graves.add(grave);
}

// ----------------------------------------------------------------
// --- 3.7. ГАРБУЗИ (Без текстур, лише колір) ---
// ----------------------------------------------------------------
const pumpkins = new THREE.Group();
scene.add(pumpkins);

const pumpkinGeometry = new THREE.SphereGeometry(0.3, 16, 16);

const pumpkinMaterial = new THREE.MeshStandardMaterial({
  // ВИКОРИСТОВУЄМО ТІЛЬКИ КОЛІР
  color: "#ff7d00", // Яскравий помаранчевий
  metalness: 0,
  roughness: 0.9, // Матовий вигляд
});

// Створюємо 50 рандомних гарбузів
for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 2 + Math.random() * 6;

  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  // Запобігаємо спавну безпосередньо в будинку
  if (Math.abs(x) < 2 && Math.abs(z) < 2) continue;

  const pumpkin = new THREE.Mesh(pumpkinGeometry, pumpkinMaterial);

  // Рандомна висота та нахил для реалістичності
  pumpkin.scale.set(1, Math.random() * 0.3 + 0.7, 1); // Приплюснутий
  pumpkin.position.set(x, 0.15 * pumpkin.scale.y, z);
  pumpkin.rotation.y = Math.random() * Math.PI * 2;

  pumpkin.castShadow = true;
  pumpkins.add(pumpkin);
}

// --- 4. Освітлення ---

// А. Ambient Light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
gui
  .add(ambientLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("ambientIntensity");
scene.add(ambientLight);

// Б. Directional Light (Місячне світло)
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.2);
moonLight.position.set(4, 5, -2);
moonLight.castShadow = true;

// Налаштування тіней
moonLight.shadow.mapSize.width = 256;
moonLight.shadow.mapSize.height = 256;
moonLight.shadow.camera.far = 15;
scene.add(moonLight);

gui
  .add(moonLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("moonLightIntensity");
gui
  .add(moonLight.position, "x")
  .min(-10)
  .max(10)
  .step(0.001)
  .name("moonLightX");
gui
  .add(moonLight.position, "y")
  .min(-10)
  .max(10)
  .step(0.001)
  .name("moonLightY");
gui
  .add(moonLight.position, "z")
  .min(-10)
  .max(10)
  .step(0.001)
  .name("moonLightZ");

// В. Point Light (Ліхтар над дверима)
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
doorLight.castShadow = true;

doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;
house.add(doorLight);

gui
  .add(doorLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("doorLightIntensity");
gui.add(doorLight.position, "y").min(-5).max(5).step(0.001).name("doorLightY");
gui.add(doorLight.position, "z").min(-5).max(5).step(0.001).name("doorLightZ");

// Г. Ghost Light (Анімація привидів)
const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
const ghost3 = new THREE.PointLight("#ffff00", 2, 3);

// Увімкнення тіней для привидів
[ghost1, ghost2, ghost3].forEach((ghost) => {
  ghost.castShadow = true;
  ghost.shadow.mapSize.width = 256;
  ghost.shadow.mapSize.height = 256;
  ghost.shadow.camera.near = 0.1;
  ghost.shadow.camera.far = 5;
});

scene.add(ghost1, ghost2, ghost3);

// --- 5. Туман та Нічне Небо ---
const fogColor = "#262837";
scene.background = new THREE.Color(fogColor);
scene.fog = new THREE.Fog(fogColor, 1, 15);

// --- 6. Камера та Рендерер ---
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(6, 4, 8);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Увімкнення тіней та їх типу
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// --- 7. Цикл Анімації (Tick Function) ---

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Анімація привидів (коливання та рух по колу)
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3) + 1;

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 3.5);

  // Оновлення контролів та рендеринг
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

// --- 8. Обробка зміни розміру вікна ---
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
