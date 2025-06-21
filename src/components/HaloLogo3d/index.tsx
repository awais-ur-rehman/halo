import { useRef, useEffect } from "react";
import * as THREE from "three";

export const HaloLogo3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(300, 300);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const outerRingGeometry = new THREE.TorusGeometry(2, 0.1, 16, 100);
    const innerRingGeometry = new THREE.TorusGeometry(1.2, 0.08, 16, 100);
    const coreGeometry = new THREE.SphereGeometry(0.5, 32, 16);

    const outerRingMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b5cf6,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.8,
    });

    const innerRingMaterial = new THREE.MeshPhongMaterial({
      color: 0x3b82f6,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.9,
    });

    const coreMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x6366f1,
      emissiveIntensity: 0.4,
    });

    const outerRing = new THREE.Mesh(outerRingGeometry, outerRingMaterial);
    const innerRing = new THREE.Mesh(innerRingGeometry, innerRingMaterial);
    const core = new THREE.Mesh(coreGeometry, coreMaterial);

    scene.add(outerRing);
    scene.add(innerRing);
    scene.add(core);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x8b5cf6, 1, 100);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    camera.position.z = 6;

    sceneRef.current = scene;
    rendererRef.current = renderer;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      outerRing.rotation.x += 0.005;
      outerRing.rotation.z += 0.01;

      innerRing.rotation.x -= 0.008;
      innerRing.rotation.y += 0.012;

      core.rotation.y += 0.015;

      const time = Date.now() * 0.001;
      pointLight.position.x = Math.cos(time) * 3;
      pointLight.position.y = Math.sin(time) * 3;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="flex items-center justify-center" />;
};
