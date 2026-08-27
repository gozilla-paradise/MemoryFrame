export interface SampleImage {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  url: string;
}

// Generate realistic vibrant procedural sample pictures so the app works offline/client-side 100% reliably
function createSampleDataUrl(
  type: 'sunset_mountains' | 'couple_portrait' | 'golden_dog' | 'vintage_monument' | 'cherry_blossom'
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1400;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  if (type === 'sunset_mountains') {
    // Majestic golden hour sunset over lake and mountains
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 900);
    skyGrad.addColorStop(0, '#1e1b4b');
    skyGrad.addColorStop(0.3, '#4338ca');
    skyGrad.addColorStop(0.6, '#f97316');
    skyGrad.addColorStop(0.85, '#fde047');
    skyGrad.addColorStop(1, '#ffedd5');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 1200, 900);

    // Glowing sun
    ctx.beginPath();
    ctx.arc(600, 650, 120, 0, Math.PI * 2);
    ctx.fillStyle = '#fffbeb';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 80;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Distant mountains
    ctx.fillStyle = '#312e81';
    ctx.beginPath();
    ctx.moveTo(0, 750);
    ctx.lineTo(250, 500);
    ctx.lineTo(500, 720);
    ctx.lineTo(750, 480);
    ctx.lineTo(1050, 680);
    ctx.lineTo(1200, 600);
    ctx.lineTo(1200, 900);
    ctx.lineTo(0, 900);
    ctx.fill();

    // Foreground mountain ridge
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.moveTo(0, 820);
    ctx.lineTo(380, 580);
    ctx.lineTo(700, 800);
    ctx.lineTo(950, 620);
    ctx.lineTo(1200, 780);
    ctx.lineTo(1200, 900);
    ctx.lineTo(0, 900);
    ctx.fill();

    // Lake water with reflection
    const waterGrad = ctx.createLinearGradient(0, 900, 0, 1400);
    waterGrad.addColorStop(0, '#f97316');
    waterGrad.addColorStop(0.4, '#312e81');
    waterGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, 900, 1200, 500);

    // Light ripples
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
    ctx.lineWidth = 4;
    for (let y = 920; y < 1350; y += 30) {
      ctx.beginPath();
      ctx.moveTo(350 - (y - 900) * 0.4, y);
      ctx.lineTo(850 + (y - 900) * 0.4, y);
      ctx.stroke();
    }

    // Silhouette pines
    ctx.fillStyle = '#090d16';
    for (let x = 40; x < 300; x += 35) {
      const h = 160 + (x % 50) * 2;
      ctx.beginPath();
      ctx.moveTo(x, 1000);
      ctx.lineTo(x + 20, 1000 - h);
      ctx.lineTo(x + 40, 1000);
      ctx.fill();
    }
  } else if (type === 'couple_portrait') {
    // Romantic warm golden portrait backdrop
    const grad = ctx.createRadialGradient(600, 600, 100, 600, 700, 800);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.4, '#fb923c');
    grad.addColorStop(0.8, '#be185d');
    grad.addColorStop(1, '#3b0764');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 1400);

    // Bokeh lights
    const colors = ['rgba(254, 240, 138, 0.35)', 'rgba(251, 146, 60, 0.3)', 'rgba(244, 114, 182, 0.3)'];
    for (let i = 0; i < 45; i++) {
      const bx = (i * 137.5) % 1200;
      const by = (i * 93.3) % 1400;
      const r = 25 + (i % 5) * 18;
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI * 2);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
    }

    // Silhouette of happy couple holding hands under fairy lights
    ctx.fillStyle = '#18021f';
    // Person 1
    ctx.beginPath();
    ctx.arc(520, 620, 70, 0, Math.PI * 2); // head
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(510, 950, 140, 260, 0, 0, Math.PI * 2); // body
    ctx.fill();

    // Person 2
    ctx.beginPath();
    ctx.arc(680, 640, 65, 0, Math.PI * 2); // head
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(690, 960, 130, 250, 0, 0, Math.PI * 2); // body
    ctx.fill();

    // Heart sparkle in between
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(600, 540, 20, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'golden_dog') {
    // Vibrant meadow with playful golden retriever silhouette
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1400);
    bgGrad.addColorStop(0, '#38bdf8');
    bgGrad.addColorStop(0.5, '#bae6fd');
    bgGrad.addColorStop(0.65, '#86efac');
    bgGrad.addColorStop(1, '#15803d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 1400);

    // Sun flare
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(200, 250, 160, 0, Math.PI * 2);
    ctx.fill();

    // Rolling green hill
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.moveTo(0, 900);
    ctx.bezierCurveTo(400, 800, 800, 950, 1200, 850);
    ctx.lineTo(1200, 1400);
    ctx.lineTo(0, 1400);
    ctx.fill();

    // Golden pet silhouette
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.ellipse(600, 880, 160, 110, 0.1, 0, Math.PI * 2); // body
    ctx.arc(740, 800, 75, 0, Math.PI * 2); // head
    ctx.arc(770, 770, 30, 0, Math.PI * 2); // snout
    ctx.ellipse(710, 810, 25, 45, 0.4, 0, Math.PI * 2); // ear
    ctx.fill();
  } else if (type === 'cherry_blossom') {
    // Soft pastel Japanese garden blossom
    const sky = ctx.createLinearGradient(0, 0, 0, 1400);
    sky.addColorStop(0, '#fbcfe8');
    sky.addColorStop(0.5, '#fed7aa');
    sky.addColorStop(1, '#e0e7ff');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 1200, 1400);

    // Floating petals
    ctx.fillStyle = '#f43f5e';
    for (let i = 0; i < 70; i++) {
      const px = (i * 79) % 1200;
      const py = (i * 123) % 1400;
      const pr = 8 + (i % 7) * 4;
      ctx.beginPath();
      ctx.ellipse(px, py, pr, pr * 0.6, (i * 30 * Math.PI) / 180, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Vintage architectural monument
    const sepiaGrad = ctx.createLinearGradient(0, 0, 1200, 1400);
    sepiaGrad.addColorStop(0, '#fde68a');
    sepiaGrad.addColorStop(0.5, '#d97706');
    sepiaGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = sepiaGrad;
    ctx.fillRect(0, 0, 1200, 1400);

    // Architectural columns
    ctx.fillStyle = '#451a03';
    for (let c = 150; c < 1100; c += 180) {
      ctx.fillRect(c, 400, 90, 800);
    }
    ctx.fillRect(100, 320, 1000, 80);
    ctx.beginPath();
    ctx.moveTo(100, 320);
    ctx.lineTo(600, 120);
    ctx.lineTo(1100, 320);
    ctx.fill();
  }

  return canvas.toDataURL('image/jpeg', 0.92);
}

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'sunset',
    name: 'Sunset Alps Lake',
    category: 'Travel & Nature',
    thumbnail: '',
    url: '',
  },
  {
    id: 'couple',
    name: 'Golden Hour Couple',
    category: 'Portrait & Wedding',
    thumbnail: '',
    url: '',
  },
  {
    id: 'dog',
    name: 'Faithful Companion',
    category: 'Pets & Family',
    thumbnail: '',
    url: '',
  },
  {
    id: 'cherry',
    name: 'Spring Blossoms',
    category: 'Aesthetic & Flora',
    thumbnail: '',
    url: '',
  },
  {
    id: 'vintage',
    name: 'Heritage Pantheon',
    category: 'Architecture & Art',
    thumbnail: '',
    url: '',
  },
];

// Lazy generator for the sample URLs to avoid blocking initialization
export function getSampleImageUrl(id: string): string {
  switch (id) {
    case 'sunset':
      return createSampleDataUrl('sunset_mountains');
    case 'couple':
      return createSampleDataUrl('couple_portrait');
    case 'dog':
      return createSampleDataUrl('golden_dog');
    case 'cherry':
      return createSampleDataUrl('cherry_blossom');
    case 'vintage':
    default:
      return createSampleDataUrl('vintage_monument');
  }
}
