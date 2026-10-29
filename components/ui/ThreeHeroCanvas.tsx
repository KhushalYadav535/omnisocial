'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeHeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return; // WebGL not supported, graceful fallback
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.8;

    // Lights for luxury light theme (iridescent pastel highlights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x6366f1, 2.5); // Indigo
    dirLight1.position.set(5, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 2.0); // Cyan
    dirLight2.position.set(-5, -3, 3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xf43f5e, 2.0, 10); // Rose
    pointLight.position.set(0, 3, 2);
    scene.add(pointLight);

    // Create Organic Fluid 3D Mesh
    // High detail Icosahedron for smooth simplex ripple
    const geometry = new THREE.IcosahedronGeometry(1.6, 64);
    const pos = geometry.attributes.position;
    const origPos = new Float32Array(pos.array); // Keep reference to base vertices

    // Luxury pearlescent material (light theme)
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.08,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      transmission: 0.45, // Glassy translucency
      ior: 1.45,
      transparent: true,
      opacity: 0.88,
      wireframe: false,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add delicate outer wireframe halo
    const wireGeom = new THREE.IcosahedronGeometry(1.85, 4);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.07,
    });
    const wireMesh = new THREE.Mesh(wireGeom, wireMat);
    scene.add(wireMesh);

    // Add ambient floating stardust particles
    const particleCount = 70;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Mouse tracking with smooth lerp
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      targetMouseX = (x / width) * 2 - 1;
      targetMouseY = -(y / height) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Handle Resize
    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', onResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth mouse lerping
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // Rotate meshes
      sphere.rotation.y = time * 0.12 + mouseX * 0.5;
      sphere.rotation.x = time * 0.08 + mouseY * 0.4;

      wireMesh.rotation.y = -time * 0.06;
      wireMesh.rotation.z = time * 0.04;

      particles.rotation.y = time * 0.02;

      // Deform sphere vertices dynamically (Simplex-like fluid ripple)
      const currentPos = geometry.attributes.position;
      const count = currentPos.count;

      for (let i = 0; i < count; i++) {
        const u = origPos[i * 3];
        const v = origPos[i * 3 + 1];
        const w = origPos[i * 3 + 2];

        // 3D waves calculation
        const distance = Math.sqrt(u * u + v * v + w * w);
        const wave =
          Math.sin(u * 2.2 + time * 1.5) * 0.12 +
          Math.cos(v * 2.5 + time * 1.2) * 0.11 +
          Math.sin(w * 2.0 + time * 0.8) * 0.09;

        const factor = (distance + wave) / distance;
        currentPos.setXYZ(i, u * factor, v * factor, w * factor);
      }

      currentPos.needsUpdate = true;
      geometry.computeVertexNormals();

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      wireGeom.dispose();
      wireMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}

