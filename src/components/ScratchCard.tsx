import { useEffect, useRef, useState } from 'react';
import { Coupon } from '../types';

interface ScratchCardProps {
  coupon: Coupon;
  onReveal: () => void;
}

export function ScratchCard({ coupon, onReveal }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#10b981');
    gradient.addColorStop(1, '#14b8a6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Scratch Here!', rect.width / 2, rect.height / 2 - 20);

    ctx.font = '16px sans-serif';
    ctx.fillText('Drag to reveal your prize', rect.width / 2, rect.height / 2 + 20);
  }, []);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(
      (x - rect.left) * scaleX,
      (y - rect.top) * scaleY,
      30 * window.devicePixelRatio,
      0,
      Math.PI * 2
    );
    ctx.fill();

    checkScratchPercentage(ctx, canvas);
  };

  const checkScratchPercentage = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) {
        transparent++;
      }
    }

    const percentage = (transparent / (pixels.length / 4)) * 100;
    setScratchPercentage(percentage);

    if (percentage > 50 && !isRevealed) {
      setIsRevealed(true);
      onReveal();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScratching(true);
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isScratching) {
      scratch(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsScratching(true);
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isScratching) {
      e.preventDefault();
      const touch = e.touches[0];
      scratch(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
  };

  const getRewardDisplay = () => {
    switch (coupon.rewardType) {
      case 'better_luck':
        return {
          text: 'Better Luck Next Time!',
          emoji: '😔',
          color: 'text-gray-700',
          bg: 'bg-gradient-to-br from-gray-100 to-gray-200'
        };
      case 'points_10':
        return {
          text: 'You Won 10 Points!',
          emoji: '🎉',
          color: 'text-blue-700',
          bg: 'bg-gradient-to-br from-blue-100 to-blue-200'
        };
      case 'points_50':
        return {
          text: 'You Won 50 Points!',
          emoji: '🎊',
          color: 'text-purple-700',
          bg: 'bg-gradient-to-br from-purple-100 to-purple-200'
        };
      case 'points_100':
        return {
          text: 'You Won 100 Points!',
          emoji: '🏆',
          color: 'text-amber-700',
          bg: 'bg-gradient-to-br from-amber-100 to-amber-200'
        };
    }
  };

  const reward = getRewardDisplay();

  return (
    <div className="relative w-full max-w-2xl aspect-[3/2] mx-auto">
      <div className={`absolute inset-0 rounded-3xl shadow-2xl ${reward.bg} flex flex-col items-center justify-center p-8`}>
        <div className="text-8xl mb-6 animate-[bounce_1s_ease-in-out]">
          {reward.emoji}
        </div>
        <h2 className={`${reward.color} text-4xl md:text-5xl font-bold text-center`}>
          {reward.text}
        </h2>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full rounded-3xl cursor-pointer touch-none"
        style={{
          opacity: isRevealed ? 0 : 1,
          transition: 'opacity 0.5s ease-out'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {scratchPercentage > 0 && scratchPercentage < 50 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          <p className="text-sm font-semibold text-gray-700">
            {Math.round(scratchPercentage)}% scratched
          </p>
        </div>
      )}
    </div>
  );
}
