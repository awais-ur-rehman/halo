// import { useRef, useEffect } from "react";
// import * as THREE from "three";
// import earthTexture from "../../assets/earth-texture.jpg";

// export const Earth3D = () => {
//   const mountRef = useRef<HTMLDivElement>(null);
//   const sceneRef = useRef<THREE.Scene>();
//   const rendererRef = useRef<THREE.WebGLRenderer>();
//   const frameRef = useRef<number>();
//   const cameraRef = useRef<THREE.PerspectiveCamera>();
//   const earthRef = useRef<THREE.Mesh>();
//   const mouseRef = useRef({ x: 0, y: 0 });
//   const isDraggingRef = useRef(false);
//   const previousMouseRef = useRef({ x: 0, y: 0 });
//   const rotationVelocityRef = useRef({ x: 0, y: 0 });

//   useEffect(() => {
//     if (!mountRef.current) return;

//     const scene = new THREE.Scene();

//     // Add animated gradient background
//     const gradientGeometry = new THREE.PlaneGeometry(20, 20);
//     const gradientMaterial = new THREE.ShaderMaterial({
//       uniforms: {
//         time: { value: 0 },
//         color1: { value: new THREE.Color(0x0a0a0a) },
//         color2: { value: new THREE.Color(0x1a1a2e) },
//         color3: { value: new THREE.Color(0x16213e) },
//       },
//       vertexShader: `
//         varying vec2 vUv;
//         void main() {
//           vUv = uv;
//           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//         }
//       `,
//       fragmentShader: `
//         uniform float time;
//         uniform vec3 color1;
//         uniform vec3 color2;
//         uniform vec3 color3;
//         varying vec2 vUv;

//         void main() {
//           vec2 uv = vUv;
//           float wave1 = sin(uv.x * 3.0 + time * 0.3) * 0.5 + 0.5;
//           float wave2 = sin(uv.y * 2.0 + time * 0.2) * 0.5 + 0.5;
//           float wave3 = sin((uv.x + uv.y) * 2.5 + time * 0.25) * 0.5 + 0.5;

//           vec3 color = mix(color1, color2, wave1);
//           color = mix(color, color3, wave2 * wave3);

//           gl_FragColor = vec4(color, 1.0);
//         }
//       `,
//     });

//     const gradientMesh = new THREE.Mesh(gradientGeometry, gradientMaterial);
//     gradientMesh.position.z = -10;
//     scene.add(gradientMesh);

//     const camera = new THREE.PerspectiveCamera(
//       75,
//       mountRef.current.clientWidth / mountRef.current.clientHeight,
//       0.1,
//       100
//     );
//     camera.position.z = 8;
//     cameraRef.current = camera;

//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setSize(
//       mountRef.current.clientWidth,
//       mountRef.current.clientHeight
//     );
//     renderer.setPixelRatio(window.devicePixelRatio);
//     mountRef.current.appendChild(renderer.domElement);

//     const earthGeometry = new THREE.SphereGeometry(2.5, 64, 64);
//     const textureLoader = new THREE.TextureLoader();

//     textureLoader.load(earthTexture, (texture) => {
//       const earthMaterial = new THREE.MeshPhongMaterial({
//         map: texture,
//         shininess: 0.1,
//       });
//       const earth = new THREE.Mesh(earthGeometry, earthMaterial);
//       earth.userData.isEarth = true;
//       earth.position.set(0, 0, 0);
//       earthRef.current = earth;
//       scene.add(earth);

//       // Add subtle floating animation
//       const originalY = earth.position.y;
//       earth.userData.originalY = originalY;
//     });

//     // Enhanced lighting with subtle animation
//     scene.add(new THREE.AmbientLight(0x404040, 0.4));
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//     directionalLight.position.set(5, 3, 5);
//     scene.add(directionalLight);

//     // Add subtle rim lighting
//     const rimLight = new THREE.DirectionalLight(0x4a90e2, 0.3);
//     rimLight.position.set(-5, -3, -5);
//     scene.add(rimLight);

//     // Add floating particles
//     const particleGeometry = new THREE.BufferGeometry();
//     const particleCount = 100;
//     const positions = new Float32Array(particleCount * 3);
//     const velocities = new Float32Array(particleCount * 3);

//     for (let i = 0; i < particleCount * 3; i += 3) {
//       positions[i] = (Math.random() - 0.5) * 20;
//       positions[i + 1] = (Math.random() - 0.5) * 20;
//       positions[i + 2] = (Math.random() - 0.5) * 20;

//       velocities[i] = (Math.random() - 0.5) * 0.02;
//       velocities[i + 1] = (Math.random() - 0.5) * 0.02;
//       velocities[i + 2] = (Math.random() - 0.5) * 0.02;
//     }

//     particleGeometry.setAttribute(
//       "position",
//       new THREE.BufferAttribute(positions, 3)
//     );
//     particleGeometry.userData.velocities = velocities;

//     const particleMaterial = new THREE.PointsMaterial({
//       color: 0x4a90e2,
//       size: 0.05,
//       transparent: true,
//       opacity: 0.6,
//       blending: THREE.AdditiveBlending,
//     });

//     const particles = new THREE.Points(particleGeometry, particleMaterial);
//     scene.add(particles);

//     // Mouse event handlers
//     const handleMouseDown = (event: MouseEvent) => {
//       isDraggingRef.current = true;
//       previousMouseRef.current = {
//         x: event.clientX,
//         y: event.clientY,
//       };
//       renderer.domElement.style.cursor = "grabbing";
//     };

//     const handleMouseMove = (event: MouseEvent) => {
//       mouseRef.current = {
//         x: (event.clientX / window.innerWidth) * 2 - 1,
//         y: -(event.clientY / window.innerHeight) * 2 + 1,
//       };

//       if (isDraggingRef.current && earthRef.current) {
//         const deltaX = event.clientX - previousMouseRef.current.x;
//         const deltaY = event.clientY - previousMouseRef.current.y;

//         rotationVelocityRef.current.y = deltaX * 0.01;
//         rotationVelocityRef.current.x = deltaY * 0.01;

//         previousMouseRef.current = {
//           x: event.clientX,
//           y: event.clientY,
//         };
//       }
//     };

//     const handleMouseUp = () => {
//       isDraggingRef.current = false;
//       renderer.domElement.style.cursor = "grab";
//     };

//     const handleMouseEnter = () => {
//       renderer.domElement.style.cursor = "grab";
//     };

//     const handleMouseLeave = () => {
//       isDraggingRef.current = false;
//       renderer.domElement.style.cursor = "default";
//     };

//     // Add event listeners
//     renderer.domElement.addEventListener("mousedown", handleMouseDown);
//     renderer.domElement.addEventListener("mousemove", handleMouseMove);
//     renderer.domElement.addEventListener("mouseup", handleMouseUp);
//     renderer.domElement.addEventListener("mouseenter", handleMouseEnter);
//     renderer.domElement.addEventListener("mouseleave", handleMouseLeave);

//     const animate = () => {
//       frameRef.current = requestAnimationFrame(animate);
//       const time = Date.now() * 0.001;

//       // Update gradient background
//       if (gradientMaterial.uniforms.time) {
//         gradientMaterial.uniforms.time.value = time;
//       }

//       // Animate particles
//       const positions = particles.geometry.attributes.position
//         .array as Float32Array;
//       const velocities = particles.geometry.userData.velocities;

//       for (let i = 0; i < positions.length; i += 3) {
//         positions[i] += velocities[i];
//         positions[i + 1] += velocities[i + 1];
//         positions[i + 2] += velocities[i + 2];

//         // Wrap particles around
//         if (Math.abs(positions[i]) > 10) velocities[i] *= -1;
//         if (Math.abs(positions[i + 1]) > 10) velocities[i + 1] *= -1;
//         if (Math.abs(positions[i + 2]) > 10) velocities[i + 2] *= -1;
//       }
//       particles.geometry.attributes.position.needsUpdate = true;

//       // Earth animations
//       scene.children.forEach((child) => {
//         if (child.userData.isEarth && earthRef.current) {
//           // Continuous rotation
//           if (!isDraggingRef.current) {
//             child.rotation.y += 0.005;
//           }

//           // Apply mouse interaction rotation
//           child.rotation.y += rotationVelocityRef.current.y;
//           child.rotation.x += rotationVelocityRef.current.x;

//           // Apply damping to rotation velocity
//           rotationVelocityRef.current.y *= 0.95;
//           rotationVelocityRef.current.x *= 0.95;

//           // Subtle floating animation
//           child.position.y =
//             child.userData.originalY + Math.sin(time * 0.5) * 0.1;

//           // Subtle mouse-following tilt
//           const targetRotationX = mouseRef.current.y * 0.1;
//           const targetRotationZ = mouseRef.current.x * 0.1;

//           child.rotation.z += (targetRotationZ - child.rotation.z) * 0.02;

//           // Subtle scale pulse
//           const scale = 1 + Math.sin(time * 0.3) * 0.02;
//           child.scale.setScalar(scale);
//         }
//       });

//       // Camera gentle movement
//       if (cameraRef.current && !isDraggingRef.current) {
//         cameraRef.current.position.x +=
//           (mouseRef.current.x * 0.5 - cameraRef.current.position.x) * 0.02;
//         cameraRef.current.position.y +=
//           (mouseRef.current.y * 0.5 - cameraRef.current.position.y) * 0.02;
//         cameraRef.current.lookAt(0, 0, 0);
//       }

//       renderer.render(scene, camera);
//     };

//     animate();

//     const handleResize = () => {
//       if (mountRef.current && renderer && camera) {
//         const width = mountRef.current.clientWidth;
//         const height = mountRef.current.clientHeight;
//         renderer.setSize(width, height);
//         camera.aspect = width / height;
//         camera.updateProjectionMatrix();
//       }
//     };

//     window.addEventListener("resize", handleResize);

//     sceneRef.current = scene;
//     rendererRef.current = renderer;

//     return () => {
//       if (frameRef.current) cancelAnimationFrame(frameRef.current);
//       window.removeEventListener("resize", handleResize);

//       // Remove mouse event listeners
//       renderer.domElement.removeEventListener("mousedown", handleMouseDown);
//       renderer.domElement.removeEventListener("mousemove", handleMouseMove);
//       renderer.domElement.removeEventListener("mouseup", handleMouseUp);
//       renderer.domElement.removeEventListener("mouseenter", handleMouseEnter);
//       renderer.domElement.removeEventListener("mouseleave", handleMouseLeave);

//       if (
//         renderer.domElement &&
//         mountRef.current?.contains(renderer.domElement)
//       ) {
//         mountRef.current.removeChild(renderer.domElement);
//       }
//       renderer.dispose();
//     };
//   }, []);

//   return (
//     <div
//       ref={mountRef}
//       className="w-full h-full flex justify-center items-center overflow-hidden bg-black"
//     />
//   );
// };

//new
import { useRef, useEffect } from "react";
import * as THREE from "three";
import earthTexture from "../../assets/earth-texture2.jpg";

export const Earth3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const frameRef = useRef<number>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const earthRef = useRef<THREE.Mesh>();
  const isMouseDown = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const mouseRotation = useRef({ x: 0, y: 0 });
  const autoRotationY = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();

    const gradientGeometry = new THREE.PlaneGeometry(50, 50);
    const gradientMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x000011) },
        color2: { value: new THREE.Color(0x001122) },
        color3: { value: new THREE.Color(0x000033) },
        color4: { value: new THREE.Color(0x000000) },
        color5: { value: new THREE.Color(0x220044) },
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
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform vec3 color4;
        uniform vec3 color5;
        varying vec2 vUv;

        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
          vec2 uv = vUv;
          vec2 center = vec2(0.5, 0.5);
          float dist = length(uv - center);
          
          float angle = atan(uv.y - 0.5, uv.x - 0.5);
          float spiral = sin(angle * 3.0 + dist * 8.0 + time * 0.1) * 0.5 + 0.5;
          
          float cloud1 = sin(uv.x * 4.0 + time * 0.05) * sin(uv.y * 3.0 + time * 0.03);
          float cloud2 = sin((uv.x + uv.y) * 2.0 + time * 0.02) * 0.3;
          
          float layer1 = noise(uv * 8.0 + time * 0.01);
          float layer2 = noise(uv * 16.0 + time * 0.005);
          
          float galaxyMask = smoothstep(0.8, 0.2, dist) * spiral;
          float nebula = (cloud1 + cloud2) * 0.3;
          
          vec3 color = mix(color4, color1, layer1 * 0.5);
          color = mix(color, color2, galaxyMask * 0.7);
          color = mix(color, color3, nebula);
          color = mix(color, color5, layer2 * galaxyMask * 0.4);

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const gradientMesh = new THREE.Mesh(gradientGeometry, gradientMaterial);
    gradientMesh.position.z = -25;
    scene.add(gradientMesh);

    // Fixed camera setup for proper aspect ratio
    const camera = new THREE.PerspectiveCamera(
      65,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 0.4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const createGalaxyStars = () => {
      const group = new THREE.Group();
      const starCount = 4000;

      const starTypes = [
        { size: 0.03, color: 0xffffff, opacity: 0.9, brightness: 1.2 },
        { size: 0.05, color: 0xaaccff, opacity: 0.8, brightness: 1.0 },
        { size: 0.04, color: 0xffffaa, opacity: 0.85, brightness: 1.1 },
        { size: 0.035, color: 0xffaacc, opacity: 0.7, brightness: 0.9 },
        { size: 0.08, color: 0xccccff, opacity: 0.6, brightness: 0.8 },
        { size: 0.025, color: 0xffffff, opacity: 1.0, brightness: 1.3 },
        { size: 0.045, color: 0xccffcc, opacity: 0.75, brightness: 1.0 },
        { size: 0.07, color: 0xffccaa, opacity: 0.65, brightness: 0.85 },
      ];

      // Create realistic star shapes using points or small spheres
      for (let i = 0; i < starCount; i++) {
        const starType =
          starTypes[Math.floor(Math.random() * starTypes.length)];

        // Create star using SphereGeometry for 3D effect
        const starGeometry = new THREE.SphereGeometry(starType.size, 8, 6);
        const starMaterial = new THREE.MeshBasicMaterial({
          color: starType.color,
          transparent: true,
          opacity: starType.opacity,
          emissive: starType.color,
          emissiveIntensity: starType.brightness * 0.3,
        });

        const star = new THREE.Mesh(starGeometry, starMaterial);

        // Position stars in a sphere around the scene
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        const radius = Math.random() * 25 + 15; // Increased distance range

        star.position.set(
          radius * Math.sin(theta) * Math.cos(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(theta)
        );

        star.userData.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.002,
          (Math.random() - 0.5) * 0.002,
          (Math.random() - 0.5) * 0.002
        );

        star.userData.twinkleSpeed = Math.random() * 0.02 + 0.01;
        star.userData.baseOpacity = star.material.opacity;
        star.userData.maxOpacity = star.material.opacity;
        star.userData.minOpacity = star.material.opacity * 0.3;

        group.add(star);
      }

      // Add some brighter "star clusters" with cross-shaped glow
      for (let i = 0; i < 50; i++) {
        const brightStarGroup = new THREE.Group();

        // Main bright star
        const mainStar = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 8, 6),
          new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.9,
            emissive: 0xffffff,
            emissiveIntensity: 0.5,
          })
        );

        // Add cross-shaped glow effect
        const glowGeometry = new THREE.PlaneGeometry(0.8, 0.05);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.3,
          blending: THREE.AdditiveBlending,
        });

        const horizontalGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        const verticalGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        verticalGlow.rotation.z = Math.PI / 2;

        brightStarGroup.add(mainStar);
        brightStarGroup.add(horizontalGlow);
        brightStarGroup.add(verticalGlow);

        // Position bright stars
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        const radius = Math.random() * 30 + 20;

        brightStarGroup.position.set(
          radius * Math.sin(theta) * Math.cos(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(theta)
        );

        brightStarGroup.userData.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.001,
          (Math.random() - 0.5) * 0.001,
          (Math.random() - 0.5) * 0.001
        );

        brightStarGroup.userData.twinkleSpeed = Math.random() * 0.015 + 0.005;

        group.add(brightStarGroup);
      }

      // Keep nebulae and dust as they were
      for (let i = 0; i < 30; i++) {
        const nebulaGeometry = new THREE.CircleGeometry(
          Math.random() * 0.4 + 0.15,
          8
        );
        const nebulaColors = [0x4444ff, 0xff44aa, 0x44ff44, 0xff6644, 0xaa44ff];
        const nebulaColor =
          nebulaColors[Math.floor(Math.random() * nebulaColors.length)];

        const nebulaMaterial = new THREE.MeshBasicMaterial({
          color: nebulaColor,
          transparent: true,
          opacity: Math.random() * 0.08 + 0.03,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        });

        const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);

        nebula.position.set(
          (Math.random() - 0.5) * 35,
          (Math.random() - 0.5) * 35,
          (Math.random() - 0.5) * 35
        );

        nebula.userData.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.001,
          (Math.random() - 0.5) * 0.001,
          (Math.random() - 0.5) * 0.001
        );

        nebula.userData.rotationSpeed = (Math.random() - 0.5) * 0.003;
        nebula.userData.twinkleSpeed = Math.random() * 0.008 + 0.002;
        nebula.userData.baseOpacity = nebula.material.opacity;

        group.add(nebula);
      }

      for (let i = 0; i < 100; i++) {
        const dustGeometry = new THREE.CircleGeometry(
          Math.random() * 0.08 + 0.02,
          4
        );
        const dustMaterial = new THREE.MeshBasicMaterial({
          color: 0x666699,
          transparent: true,
          opacity: Math.random() * 0.15 + 0.05,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        });

        const dust = new THREE.Mesh(dustGeometry, dustMaterial);

        dust.position.set(
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40
        );

        dust.userData.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.0005,
          (Math.random() - 0.5) * 0.0005,
          (Math.random() - 0.5) * 0.0005
        );

        dust.userData.rotationSpeed = (Math.random() - 0.5) * 0.001;

        group.add(dust);
      }

      return group;
    };

    const stars = createGalaxyStars();
    scene.add(stars);

    // FIXED: Perfect circle Earth with proper proportions
    const earthRadius = 2.4;
    const atmosphereRadius = earthRadius * 1.15; // Only 15% larger for realistic atmosphere

    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64); // Increased segments for smoother sphere
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(earthTexture, (texture) => {
      const earthMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 0.1,
      });
      const earth = new THREE.Mesh(earthGeometry, earthMaterial);
      earth.userData.isEarth = true;
      earth.position.set(-5, 0, 2);
      earthRef.current = earth;
      scene.add(earth);

      // FIXED: Atmosphere with correct proportional radius
      const atmosphereGeometry = new THREE.SphereGeometry(
        atmosphereRadius,
        64,
        64
      );
      const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          sunPosition: { value: new THREE.Vector3(5, 3, 5) },
          cameraPosition: { value: camera.position },
          planetRadius: { value: earthRadius }, // Updated to match actual earth radius
          atmosphereRadius: { value: atmosphereRadius }, // Updated to match actual atmosphere radius
        },
        vertexShader: `
          uniform vec3 sunPosition;
          uniform vec3 cameraPosition;
          uniform float planetRadius;
          uniform float atmosphereRadius;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec3 vWorldPosition;
          varying float vRimIntensity;
          varying float vSunAngle;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
            
            vec3 viewDirection = normalize(cameraPosition - worldPosition.xyz);
            float rimFactor = 1.0 - max(0.0, dot(vNormal, viewDirection));
            vRimIntensity = pow(rimFactor, 2.5);
            
            vec3 toSun = normalize(sunPosition - worldPosition.xyz);
            vSunAngle = dot(vNormal, toSun);
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 sunPosition;
          uniform vec3 cameraPosition;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec3 vWorldPosition;
          varying float vRimIntensity;
          varying float vSunAngle;
          
          void main() {
            vec3 toSun = normalize(sunPosition - vWorldPosition);
            vec3 toCamera = normalize(cameraPosition - vWorldPosition);
            
            float sunDot = max(0.0, vSunAngle);
            float cameraDot = max(0.0, dot(vNormal, toCamera));
            
            float scattering = pow(1.0 - cameraDot, 3.0);
            float sunGlow = pow(sunDot, 0.8) * scattering;
            
            vec3 baseAtmosphere = vec3(0.4, 0.7, 1.0);
            vec3 sunsetColor = vec3(1.0, 0.6, 0.3);
            vec3 nightGlow = vec3(0.2, 0.4, 0.8);
            
            float dayNightMix = smoothstep(-0.2, 0.3, sunDot);
            vec3 atmosphereColor = mix(nightGlow, baseAtmosphere, dayNightMix);
            
            float sunsetFactor = smoothstep(0.0, 0.4, sunDot) * (1.0 - smoothstep(0.4, 0.8, sunDot));
            atmosphereColor = mix(atmosphereColor, sunsetColor, sunsetFactor * 0.6);
            
            float oxygenGlow = pow(scattering, 1.5) * (0.8 + 0.2 * sin(time * 2.0));
            float nitrogenScatter = pow(scattering, 2.2) * 0.6;
            
            vec3 finalColor = atmosphereColor * (oxygenGlow + nitrogenScatter);
            finalColor += sunsetColor * sunGlow * 0.8;
            
            float alpha = (scattering * 0.7 + sunGlow * 0.4) * (0.9 + 0.1 * sin(time * 1.5));
            alpha = clamp(alpha, 0.0, 0.8);
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      });

      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      atmosphere.userData.isAtmosphere = true;
      earth.add(atmosphere);

      const originalY = earth.position.y;
      earth.userData.originalY = originalY;
    });

    scene.add(new THREE.AmbientLight(0x112244, 0.3));
    const directionalLight = new THREE.DirectionalLight(0xffffee, 1.2);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0x4488ff, 0.4);
    rimLight.position.set(-5, -3, -5);
    scene.add(rimLight);

    const handleMouseDown = (event: MouseEvent) => {
      isMouseDown.current = true;
      mousePos.current = { x: event.clientX, y: event.clientY };
      renderer.domElement.style.cursor = "grabbing";
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
      renderer.domElement.style.cursor = "grab";
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };

      if (!isMouseDown.current || !earthRef.current) return;

      const deltaX = event.clientX - mousePos.current.x;
      const deltaY = event.clientY - mousePos.current.y;

      mouseRotation.current.y += deltaX * 0.01;
      mouseRotation.current.x += deltaY * 0.01;
      mouseRotation.current.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, mouseRotation.current.x)
      );

      mousePos.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseEnter = () => {
      renderer.domElement.style.cursor = "grab";
    };

    const handleMouseLeave = () => {
      isMouseDown.current = false;
      renderer.domElement.style.cursor = "default";
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        isMouseDown.current = true;
        mousePos.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
      }
    };

    const handleTouchEnd = () => {
      isMouseDown.current = false;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (
        !isMouseDown.current ||
        !earthRef.current ||
        event.touches.length !== 1
      )
        return;

      const deltaX = event.touches[0].clientX - mousePos.current.x;
      const deltaY = event.touches[0].clientY - mousePos.current.y;

      mouseRotation.current.y += deltaX * 0.01;
      mouseRotation.current.x += deltaY * 0.01;
      mouseRotation.current.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, mouseRotation.current.x)
      );

      mousePos.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    };

    const canvas = renderer.domElement;
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("touchmove", handleTouchMove);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      if (gradientMaterial.uniforms.time) {
        gradientMaterial.uniforms.time.value = time;
      }

      // Enhanced star animation with proper twinkling
      stars.children.forEach((star) => {
        if (star.userData.velocity) {
          star.position.add(star.userData.velocity);
        }

        if (star.userData.rotationSpeed) {
          star.rotation.z += star.userData.rotationSpeed;
        }

        // Enhanced twinkling for different star types
        if (star.userData.twinkleSpeed) {
          const twinkle =
            Math.sin(time * star.userData.twinkleSpeed) * 0.5 + 0.5;

          if (star.material) {
            // Single star
            const opacity =
              star.userData.minOpacity +
              (star.userData.maxOpacity - star.userData.minOpacity) * twinkle;
            star.material.opacity = opacity;
          } else {
            // Bright star group with cross glow
            star.children.forEach((child) => {
              if (child.material) {
                const baseOpacity = child.material.opacity;
                child.material.opacity = baseOpacity * (0.7 + 0.3 * twinkle);
              }
            });
          }
        }

        // Boundary check
        if (Math.abs(star.position.x) > 30) star.userData.velocity.x *= -1;
        if (Math.abs(star.position.y) > 30) star.userData.velocity.y *= -1;
        if (Math.abs(star.position.z) > 30) star.userData.velocity.z *= -1;
      });

      autoRotationY.current += 0.005;

      if (earthRef.current) {
        earthRef.current.rotation.x = mouseRotation.current.x;
        earthRef.current.rotation.y =
          autoRotationY.current + mouseRotation.current.y;

        earthRef.current.position.y = Math.sin(time * 0.5) * 0.05;

        const targetRotationZ = mouseRef.current.x * 0.05;
        earthRef.current.rotation.z +=
          (targetRotationZ - earthRef.current.rotation.z) * 0.02;

        const atmosphere = earthRef.current.children.find(
          (child) => child.userData.isAtmosphere
        );
        if (atmosphere && atmosphere.material.uniforms) {
          atmosphere.material.uniforms.time.value = time;
          atmosphere.material.uniforms.cameraPosition.value.copy(
            camera.position
          );
        }
      }

      if (cameraRef.current && !isMouseDown.current) {
        cameraRef.current.position.x +=
          (mouseRef.current.x * 0.3 + 3 - cameraRef.current.position.x) * 0.02;
        cameraRef.current.position.y +=
          (mouseRef.current.y * 0.3 - cameraRef.current.position.y) * 0.02;
        cameraRef.current.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (mountRef.current && renderer && camera) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener("resize", handleResize);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchmove", handleTouchMove);
      if (
        renderer.domElement &&
        mountRef.current?.contains(renderer.domElement)
      ) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full flex justify-end items-end h-full rounded-[12px] cursor-grab active:cursor-grabbing"
    />
  );
};
