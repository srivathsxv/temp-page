const canvas = document.getElementById("background");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Gradient moving background
const geometry = new THREE.PlaneGeometry(10, 10);
const material = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 1.0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        void main() {
            vec3 color1 = vec3(0.2, 0.6, 1.0);
            vec3 color2 = vec3(1.0, 0.0, 0.8);
            float gradient = sin(vUv.y * 4.0 + time) * 0.5 + 0.5;
            gl_FragColor = vec4(mix(color1, color2, gradient), 1.0);
        }
    `
});

const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = Math.PI * -0.5;
scene.add(plane);

camera.position.z = 5;

// Animate background
function animate() {
    requestAnimationFrame(animate);
    material.uniforms.time.value += 0.01;
    renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
