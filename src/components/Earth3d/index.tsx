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
//       className="w-full h-full flex justify-end items-end rounded-[12px] overflow-hidden bg-black"
//     />
//   );
// };

import { useRef, useEffect } from "react";
import * as THREE from "three";
import earthTexture from "../../assets/earth-texture.jpg";

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

    // Add animated gradient background with orange theme
    const gradientGeometry = new THREE.PlaneGeometry(20, 20);
    const gradientMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x0a0a0a) }, // Deep black
        color2: { value: new THREE.Color(0x2d1810) }, // Dark orange-brown
        color3: { value: new THREE.Color(0x4a2c17) }, // Medium orange-brown
        color4: { value: new THREE.Color(0x1a0f0a) }, // Very dark orange
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
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv;
          float wave1 = sin(uv.x * 3.0 + time * 0.3) * 0.5 + 0.5;
          float wave2 = sin(uv.y * 2.0 + time * 0.2) * 0.5 + 0.5;
          float wave3 = sin((uv.x + uv.y) * 2.5 + time * 0.25) * 0.5 + 0.5;
          float wave4 = sin(length(uv - 0.5) * 4.0 + time * 0.4) * 0.5 + 0.5;
          
          vec3 color = mix(color1, color2, wave1);
          color = mix(color, color3, wave2 * wave3);
          color = mix(color, color4, wave4 * 0.3);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const gradientMesh = new THREE.Mesh(gradientGeometry, gradientMaterial);
    gradientMesh.position.z = -10;
    scene.add(gradientMesh);

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.z = 8;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Create circular/oval particle system with orange theme
    const createCircularParticles = () => {
      const group = new THREE.Group();
      const particleCount = 80;

      // Create different sized circular particles
      const sizes = [0.08, 0.12, 0.16, 0.06];
      const colors = [0xff6600, 0xff8833, 0xffaa55, 0xcc4400]; // Orange gradient

      for (let i = 0; i < particleCount; i++) {
        const sizeIndex = Math.floor(Math.random() * sizes.length);
        const size = sizes[sizeIndex];
        const color = colors[sizeIndex];

        // Create circular geometry
        const particleGeometry = new THREE.CircleGeometry(size, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: Math.random() * 0.3 + 0.3,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        });

        const particle = new THREE.Mesh(particleGeometry, particleMaterial);

        // Random position
        particle.position.set(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        );

        // Random velocity
        particle.userData.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        );

        // Random rotation speed
        particle.userData.rotationSpeed = (Math.random() - 0.5) * 0.02;

        // Twinkling effect
        particle.userData.twinkleSpeed = Math.random() * 0.02 + 0.01;
        particle.userData.baseOpacity = particle.material.opacity;

        group.add(particle);
      }

      return group;
    };

    const particles = createCircularParticles();
    scene.add(particles);

    // Create Earth
    const earthGeometry = new THREE.SphereGeometry(2.5, 64, 64);
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(earthTexture, (texture) => {
      const earthMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 0.1,
      });
      const earth = new THREE.Mesh(earthGeometry, earthMaterial);
      earth.userData.isEarth = true;
      earth.position.set(0, 0, 0);
      earthRef.current = earth;
      scene.add(earth);

      // Add subtle floating animation
      const originalY = earth.position.y;
      earth.userData.originalY = originalY;
    });

    // Enhanced lighting with orange theme
    scene.add(new THREE.AmbientLight(0x402010, 0.4)); // Warm amber ambient
    const directionalLight = new THREE.DirectionalLight(0xffaa66, 1); // Warm orange light
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Add subtle rim lighting with orange tint
    const rimLight = new THREE.DirectionalLight(0xcc6600, 0.3); // Deep orange rim light
    rimLight.position.set(-5, -3, -5);
    scene.add(rimLight);

    // Mouse interaction
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
      // Update mouse position for camera and Earth tilt effects
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

    // Touch support
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

    // Event listeners
    const canvas = renderer.domElement;
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("touchmove", handleTouchMove);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      // Update gradient background
      if (gradientMaterial.uniforms.time) {
        gradientMaterial.uniforms.time.value = time;
      }

      // Animate circular particles
      particles.children.forEach((particle) => {
        // Move particles
        particle.position.add(particle.userData.velocity);

        // Rotate particles
        particle.rotation.z += particle.userData.rotationSpeed;

        // Twinkling effect
        const twinkle =
          Math.sin(time * particle.userData.twinkleSpeed) * 0.3 + 0.7;
        particle.material.opacity = particle.userData.baseOpacity * twinkle;

        // Wrap particles around
        if (Math.abs(particle.position.x) > 10)
          particle.userData.velocity.x *= -1;
        if (Math.abs(particle.position.y) > 10)
          particle.userData.velocity.y *= -1;
        if (Math.abs(particle.position.z) > 10)
          particle.userData.velocity.z *= -1;
      });

      // Always auto-rotate Earth
      autoRotationY.current += 0.005;

      // Update Earth rotation and effects
      if (earthRef.current) {
        // Combined auto + mouse rotation
        earthRef.current.rotation.x = mouseRotation.current.x;
        earthRef.current.rotation.y =
          autoRotationY.current + mouseRotation.current.y;

        // Subtle floating animation
        earthRef.current.position.y = Math.sin(time * 0.5) * 0.1;

        // Subtle mouse-following tilt
        const targetRotationZ = mouseRef.current.x * 0.1;
        earthRef.current.rotation.z +=
          (targetRotationZ - earthRef.current.rotation.z) * 0.02;

        // Subtle scale pulse
        const scale = 1 + Math.sin(time * 0.3) * 0.02;
        earthRef.current.scale.setScalar(scale);
      }

      // Camera gentle movement based on mouse position
      if (cameraRef.current && !isMouseDown.current) {
        cameraRef.current.position.x +=
          (mouseRef.current.x * 0.5 - cameraRef.current.position.x) * 0.02;
        cameraRef.current.position.y +=
          (mouseRef.current.y * 0.5 - cameraRef.current.position.y) * 0.02;
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
      className="w-full h-full flex justify-end items-end rounded-[12px] cursor-grab active:cursor-grabbing bg-black"
    />
  );
};
