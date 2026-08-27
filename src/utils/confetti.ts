import confetti from 'canvas-confetti';

export const triggerExportConfetti = () => {
  // Sleek Interface vibrant confetti palette: Indigo, Pink, Amber, Emerald, Violet
  const colors = ['#6366f1', '#4f46e5', '#818cf8', '#f472b6', '#fbbf24', '#34d399', '#38bdf8'];

  // Left burst
  confetti({
    particleCount: 50,
    angle: 60,
    spread: 60,
    origin: { x: 0.15, y: 0.75 },
    colors,
    ticks: 240,
    gravity: 1.1,
    scalar: 1.05,
    shapes: ['square', 'circle'],
  });

  // Right burst
  confetti({
    particleCount: 50,
    angle: 120,
    spread: 60,
    origin: { x: 0.85, y: 0.75 },
    colors,
    ticks: 240,
    gravity: 1.1,
    scalar: 1.05,
    shapes: ['square', 'circle'],
  });

  // Center starburst
  setTimeout(() => {
    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.6 },
      colors,
      ticks: 280,
      gravity: 0.9,
      scalar: 1.15,
    });
  }, 180);
};
