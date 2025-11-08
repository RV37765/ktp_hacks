// components/AnimatedCamera.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * AnimatedCamera Component
 * Props:
 * - cameraId: number
 * - cameraName: string
 * - peopleCount: number
 * - isFocused: boolean
 * - hasAlert: boolean
 * - floorMap: { width, height, obstacles: [{x, y, width, height}], zones: [...] }
 * - onSuspiciousActivity: function(dot) => void
 */
const AnimatedCamera = ({
  cameraId,
  cameraName,
  peopleCount,
  isFocused,
  hasAlert,
  floorMap,
  onSuspiciousActivity
}) => {
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const [dots, setDots] = useState([]);

  // Configuration
  const minDots = 10;
  const maxDots = 35;
  const speedThreshold = 0.025; // below this considered slow - very low to catch only truly stationary dots
  const suspiciousTime = 8000; // ms to turn red (12 seconds - people naturally pause to view art)

  // Initialize dots once
  useEffect(() => {
    const initialDots = Array.from(
      { length: Math.floor(Math.random() * (maxDots - minDots + 1) + minDots) },
      () => ({
        x: Math.random() * floorMap.width,
        y: Math.random() * floorMap.height,
        radius: 5,
        speedX: Math.random() * 0.2 - 0.1,
        speedY: Math.random() * 0.2 - 0.1,
        color: "green",
        lastMovedTime: Date.now()
      })
    );
    setDots(initialDots);
    dotsRef.current = initialDots;
  }, [floorMap.width, floorMap.height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function drawObstacles() {
      ctx.fillStyle = "#333";
      floorMap.obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      });
    }

    function drawZones() {
      ctx.strokeStyle = "#555";
      ctx.lineWidth = 1;
      floorMap.zones.forEach(zone => {
        ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawZones();
      drawObstacles();

      // Timestamp
      ctx.fillStyle = "red";
      ctx.font = "14px monospace";
      ctx.fillText(new Date().toLocaleTimeString(), 10, 20);

      // Camera label
      ctx.fillStyle = "white";
      ctx.font = "12px monospace";
      ctx.fillText(`${cameraName} | ${dotsRef.current.length} DETECTED`, 10, canvas.height - 10);

      // Update dots
      const updatedDots = dotsRef.current.map(dot => {
        let nextX = dot.x + dot.speedX;
        let nextY = dot.y + dot.speedY;

        // Bounce walls
        if (nextX + dot.radius >= floorMap.width || nextX - dot.radius <= 0) dot.speedX *= -1;
        if (nextY + dot.radius >= floorMap.height || nextY - dot.radius <= 0) dot.speedY *= -1;

        // Bounce obstacles
        floorMap.obstacles.forEach(obs => {
          if (
            nextX + dot.radius > obs.x &&
            nextX - dot.radius < obs.x + obs.width &&
            nextY + dot.radius > obs.y &&
            nextY - dot.radius < obs.y + obs.height
          ) {
            dot.speedX *= -1;
            dot.speedY *= -1;
          }
        });

        dot.x += dot.speedX;
        dot.y += dot.speedY;

        // Suspicious detection
        const now = Date.now();
        const movedDistance = Math.sqrt(dot.speedX ** 2 + dot.speedY ** 2);

        if (movedDistance < speedThreshold) {
          // stationary for long enough → red
          if (now - dot.lastMovedTime > suspiciousTime) {
            dot.color = "red";
            if (onSuspiciousActivity) onSuspiciousActivity(dot);
          }
        } else {
          // moving again → green
          dot.color = "green";
          dot.lastMovedTime = now;
        }

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.fill();

        return dot;
      });

      dotsRef.current = updatedDots;

      requestAnimationFrame(animate);
    }

    animate();
  }, [cameraName, floorMap, onSuspiciousActivity]);

  return (
    <canvas
      ref={canvasRef}
      width={floorMap.width}
      height={floorMap.height}
      className={`border ${isFocused ? "border-green-400" : "border-gray-700"} ${
        hasAlert ? "shadow-lg shadow-red-500/50" : ""
      }`}
    />
  );
};

export default AnimatedCamera;

