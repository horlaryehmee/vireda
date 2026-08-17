import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PARTICLE_COUNT = 32000;

export function WovenHeroObject() {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return undefined;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
        mount.appendChild(renderer.domElement);

        const mouse = new THREE.Vector2(0, 0);
        const targetMouse = new THREE.Vector2(0, 0);
        const clock = new THREE.Clock();
        const geometry = new THREE.BufferGeometry();
        const torusKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 220, 36);
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const originalPositions = new Float32Array(PARTICLE_COUNT * 3);
        const colors = new Float32Array(PARTICLE_COUNT * 3);
        const velocities = new Float32Array(PARTICLE_COUNT * 3);

        for (let index = 0; index < PARTICLE_COUNT; index += 1) {
            const vertexIndex = index % torusKnot.attributes.position.count;
            const x = torusKnot.attributes.position.getX(vertexIndex);
            const y = torusKnot.attributes.position.getY(vertexIndex);
            const z = torusKnot.attributes.position.getZ(vertexIndex);
            const color = new THREE.Color();

            positions[index * 3] = x;
            positions[index * 3 + 1] = y;
            positions[index * 3 + 2] = z;
            originalPositions[index * 3] = x;
            originalPositions[index * 3 + 1] = y;
            originalPositions[index * 3 + 2] = z;

            color.setHSL(0.105 + Math.random() * 0.055, 0.86, 0.58 + Math.random() * 0.26);
            colors[index * 3] = color.r;
            colors[index * 3 + 1] = color.g;
            colors[index * 3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.021,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.9,
            depthWrite: false,
        });

        const points = new THREE.Points(geometry, material);
        points.rotation.x = -0.25;
        scene.add(points);

        const resize = () => {
            const { width, height } = mount.getBoundingClientRect();
            const resolvedWidth = Math.max(1, Math.floor(width));
            const resolvedHeight = Math.max(1, Math.floor(height));

            camera.aspect = resolvedWidth / resolvedHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(resolvedWidth, resolvedHeight, false);
        };

        const handlePointerMove = (event) => {
            const bounds = mount.getBoundingClientRect();
            targetMouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
            targetMouse.y = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
        };

        let frameId;
        const animate = () => {
            frameId = window.requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            mouse.lerp(targetMouse, 0.16);
            const mouseWorld = new THREE.Vector3(mouse.x * 3.2, mouse.y * 3.2, 0);

            for (let index = 0; index < PARTICLE_COUNT; index += 1) {
                const ix = index * 3;
                const iy = ix + 1;
                const iz = ix + 2;
                const dx = positions[ix] - mouseWorld.x;
                const dy = positions[iy] - mouseWorld.y;
                const dz = positions[iz] - mouseWorld.z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (distance < 2.1 && distance > 0.001) {
                    const force = (2.1 - distance) * 0.028;
                    velocities[ix] += (dx / distance) * force;
                    velocities[iy] += (dy / distance) * force;
                    velocities[iz] += (dz / distance) * force;
                }

                velocities[ix] += (originalPositions[ix] - positions[ix]) * 0.0014;
                velocities[iy] += (originalPositions[iy] - positions[iy]) * 0.0014;
                velocities[iz] += (originalPositions[iz] - positions[iz]) * 0.0014;

                velocities[ix] *= 0.91;
                velocities[iy] *= 0.91;
                velocities[iz] *= 0.91;

                positions[ix] += velocities[ix];
                positions[iy] += velocities[iy];
                positions[iz] += velocities[iz];
            }

            geometry.attributes.position.needsUpdate = true;
            points.rotation.y = elapsedTime * 0.08;
            points.rotation.z = Math.sin(elapsedTime * 0.22) * 0.12;
            renderer.render(scene, camera);
        };

        resize();
        animate();
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('resize', resize);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('resize', resize);
            geometry.dispose();
            torusKnot.dispose();
            material.dispose();
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, []);

    return <div className="woven-hero-object" ref={mountRef} aria-hidden="true" />;
}
