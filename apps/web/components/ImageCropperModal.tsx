'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCw, Check, X, RefreshCw, Crop as CropIcon } from 'lucide-react';

export interface ImageCropperModalProps {
  file: File | null;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
}

interface CropBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

type HandleType = 'nw' | 'ne' | 'se' | 'sw' | 'n' | 'e' | 's' | 'w' | 'move' | null;

export default function ImageCropperModal({
  file,
  isOpen,
  onClose,
  onCropComplete,
}: ImageCropperModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [isProcessing, setIsProcessing] = useState(false);

  // Crop box in percentages (0 to 100)
  const [crop, setCrop] = useState<CropBox>({ x: 5, y: 15, width: 90, height: 70 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Active dragging state
  const dragRef = useRef<{
    handle: HandleType;
    startX: number;
    startY: number;
    startCrop: CropBox;
    containerWidth: number;
    containerHeight: number;
  } | null>(null);

  // Load image object URL when file changes
  useEffect(() => {
    if (!file) {
      setImageUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setRotation(0);
    setCrop({ x: 5, y: 15, width: 90, height: 70 });

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
    // Reset crop box slightly to fit
    setCrop({ x: 5, y: 10, width: 90, height: 80 });
  };

  const handleReset = () => {
    setCrop({ x: 5, y: 15, width: 90, height: 70 });
  };

  // Start drag on handle or box body
  const onHandlePointerDown = (handle: HandleType, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    dragRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startCrop: { ...crop },
      containerWidth: rect.width,
      containerHeight: rect.height,
    };
  };

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    e.preventDefault();

    const { handle, startX, startY, startCrop, containerWidth, containerHeight } = dragRef.current;
    if (!containerWidth || !containerHeight) return;

    const dxPercent = ((e.clientX - startX) / containerWidth) * 100;
    const dyPercent = ((e.clientY - startY) / containerHeight) * 100;

    const minSize = 8; // minimum 8% width / height

    setCrop(() => {
      let nextX = startCrop.x;
      let nextY = startCrop.y;
      let nextW = startCrop.width;
      let nextH = startCrop.height;

      if (handle === 'move') {
        nextX = Math.max(0, Math.min(100 - nextW, startCrop.x + dxPercent));
        nextY = Math.max(0, Math.min(100 - nextH, startCrop.y + dyPercent));
        return { x: nextX, y: nextY, width: nextW, height: nextH };
      }

      // Edge: North (top)
      if (handle === 'n' || handle === 'nw' || handle === 'ne') {
        const potentialY = startCrop.y + dyPercent;
        const clampedY = Math.max(0, Math.min(startCrop.y + startCrop.height - minSize, potentialY));
        nextH = startCrop.height - (clampedY - startCrop.y);
        nextY = clampedY;
      }

      // Edge: South (bottom)
      if (handle === 's' || handle === 'sw' || handle === 'se') {
        const potentialH = startCrop.height + dyPercent;
        nextH = Math.max(minSize, Math.min(100 - startCrop.y, potentialH));
      }

      // Edge: West (left)
      if (handle === 'w' || handle === 'nw' || handle === 'sw') {
        const potentialX = startCrop.x + dxPercent;
        const clampedX = Math.max(0, Math.min(startCrop.x + startCrop.width - minSize, potentialX));
        nextW = startCrop.width - (clampedX - startCrop.x);
        nextX = clampedX;
      }

      // Edge: East (right)
      if (handle === 'e' || handle === 'ne' || handle === 'se') {
        const potentialW = startCrop.width + dxPercent;
        nextW = Math.max(minSize, Math.min(100 - startCrop.x, potentialW));
      }

      return {
        x: Math.round(nextX * 10) / 10,
        y: Math.round(nextY * 10) / 10,
        width: Math.round(nextW * 10) / 10,
        height: Math.round(nextH * 10) / 10,
      };
    });
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (dragRef.current) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      dragRef.current = null;
    }
  }, []);

  // Crop & generate full-resolution output
  const handleApplyCrop = async () => {
    if (!file || !imageRef.current) return;

    try {
      setIsProcessing(true);

      const img = new Image();
      const loaded = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = imageUrl || '';
      });
      await loaded;

      const naturalW = img.naturalWidth || img.width;
      const naturalH = img.naturalHeight || img.height;

      // 1. Create intermediate canvas to handle rotation
      const rotCanvas = document.createElement('canvas');
      const rotCtx = rotCanvas.getContext('2d');
      if (!rotCtx) throw new Error('Could not get canvas context');

      if (rotation === 90 || rotation === 270) {
        rotCanvas.width = naturalH;
        rotCanvas.height = naturalW;
      } else {
        rotCanvas.width = naturalW;
        rotCanvas.height = naturalH;
      }

      rotCtx.translate(rotCanvas.width / 2, rotCanvas.height / 2);
      rotCtx.rotate((rotation * Math.PI) / 180);
      rotCtx.drawImage(img, -naturalW / 2, -naturalH / 2);

      // 2. Extract the cropped box from the rotated canvas
      const cropPixelX = Math.round((crop.x / 100) * rotCanvas.width);
      const cropPixelY = Math.round((crop.y / 100) * rotCanvas.height);
      const cropPixelW = Math.max(50, Math.round((crop.width / 100) * rotCanvas.width));
      const cropPixelH = Math.max(50, Math.round((crop.height / 100) * rotCanvas.height));

      const outCanvas = document.createElement('canvas');
      outCanvas.width = cropPixelW;
      outCanvas.height = cropPixelH;
      const outCtx = outCanvas.getContext('2d');
      if (!outCtx) throw new Error('Could not get output canvas context');

      outCtx.drawImage(
        rotCanvas,
        cropPixelX,
        cropPixelY,
        cropPixelW,
        cropPixelH,
        0,
        0,
        cropPixelW,
        cropPixelH
      );

      // 3. Export to File
      outCanvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }

          const croppedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '-cropped.jpg', {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });

          setIsProcessing(false);
          onCropComplete(croppedFile);
        },
        'image/jpeg',
        0.95
      );
    } catch (err) {
      console.error('Cropping failed:', err);
      setIsProcessing(false);
    }
  };

  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex flex-col select-none touch-none animate-fadeIn">
      {/* Header */}
      <div className="px-4 py-3 bg-[#0a1d16] border-b border-emerald-900/60 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-900/80 border border-[#c5a880]/40 flex items-center justify-center text-[#c5a880]">
            <CropIcon size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
              Crop Aadhaar Card
            </h3>
            <p className="text-[11px] text-emerald-200/80">
              Adjust all corners &amp; edges around the Aadhaar card
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 flex items-center justify-center transition-all"
          title="Cancel"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Cropper Workspace */}
      <div className="flex-1 relative flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Relative wrapper sized to fit image */}
        <div
          ref={containerRef}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="relative max-w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-xl shadow-2xl border border-stone-800 touch-none"
        >
          {/* Displayed Image */}
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Captured Aadhaar"
            style={{
              transform: `rotate(${rotation}deg)`,
              maxHeight: '68vh',
              maxWidth: '92vw',
              objectFit: 'contain',
              display: 'block',
            }}
            className="transition-transform duration-200 pointer-events-none"
          />

          {/* Interactive Crop Box Overlay */}
          <div
            style={{
              left: `${crop.x}%`,
              top: `${crop.y}%`,
              width: `${crop.width}%`,
              height: `${crop.height}%`,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
            }}
            onPointerDown={(e) => onHandlePointerDown('move', e)}
            className="absolute border-2 border-[#c5a880] cursor-move touch-none z-10"
          >
            {/* Rule of Thirds Grid Lines */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
              <div className="border-r border-b border-white/25"></div>
              <div className="border-r border-b border-white/25"></div>
              <div className="border-b border-white/25"></div>
              <div className="border-r border-b border-white/25"></div>
              <div className="border-r border-b border-white/25"></div>
              <div className="border-b border-white/25"></div>
              <div className="border-r border-white/25"></div>
              <div className="border-r border-white/25"></div>
              <div></div>
            </div>

            {/* Instruction tag inside crop box */}
            <div className="absolute top-1 left-1.5 pointer-events-none bg-black/60 backdrop-blur-xs text-[#c5a880] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#c5a880]/30">
              Drag corners &amp; edges
            </div>

            {/* ─── 4 CORNER HANDLES (Large hit areas) ─── */}
            {/* Top-Left (nw) */}
            <div
              onPointerDown={(e) => onHandlePointerDown('nw', e)}
              className="absolute -top-3.5 -left-3.5 w-7 h-7 flex items-center justify-center cursor-nwse-resize touch-none z-20"
            >
              <div className="w-4 h-4 rounded-full bg-[#c5a880] border-2 border-white shadow-md active:scale-125 transition-transform" />
            </div>

            {/* Top-Right (ne) */}
            <div
              onPointerDown={(e) => onHandlePointerDown('ne', e)}
              className="absolute -top-3.5 -right-3.5 w-7 h-7 flex items-center justify-center cursor-nesw-resize touch-none z-20"
            >
              <div className="w-4 h-4 rounded-full bg-[#c5a880] border-2 border-white shadow-md active:scale-125 transition-transform" />
            </div>

            {/* Bottom-Right (se) */}
            <div
              onPointerDown={(e) => onHandlePointerDown('se', e)}
              className="absolute -bottom-3.5 -right-3.5 w-7 h-7 flex items-center justify-center cursor-nwse-resize touch-none z-20"
            >
              <div className="w-4 h-4 rounded-full bg-[#c5a880] border-2 border-white shadow-md active:scale-125 transition-transform" />
            </div>

            {/* Bottom-Left (sw) */}
            <div
              onPointerDown={(e) => onHandlePointerDown('sw', e)}
              className="absolute -bottom-3.5 -left-3.5 w-7 h-7 flex items-center justify-center cursor-nesw-resize touch-none z-20"
            >
              <div className="w-4 h-4 rounded-full bg-[#c5a880] border-2 border-white shadow-md active:scale-125 transition-transform" />
            </div>

            {/* ─── 4 EDGE HANDLES (Pill shaped with large touch zone) ─── */}
            {/* Top Edge (n) */}
            <div
              onPointerDown={(e) => onHandlePointerDown('n', e)}
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-6 flex items-center justify-center cursor-ns-resize touch-none z-20"
            >
              <div className="w-8 h-2 rounded-full bg-white border border-[#0a2e22] shadow active:scale-110 transition-transform" />
            </div>

            {/* Bottom Edge (s) */}
            <div
              onPointerDown={(e) => onHandlePointerDown('s', e)}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-14 h-6 flex items-center justify-center cursor-ns-resize touch-none z-20"
            >
              <div className="w-8 h-2 rounded-full bg-white border border-[#0a2e22] shadow active:scale-110 transition-transform" />
            </div>

            {/* Left Edge (w) */}
            <div
              onPointerDown={(e) => onHandlePointerDown('w', e)}
              className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-14 flex items-center justify-center cursor-ew-resize touch-none z-20"
            >
              <div className="w-2 h-8 rounded-full bg-white border border-[#0a2e22] shadow active:scale-110 transition-transform" />
            </div>

            {/* Right Edge (e) */}
            <div
              onPointerDown={(e) => onHandlePointerDown('e', e)}
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-14 flex items-center justify-center cursor-ew-resize touch-none z-20"
            >
              <div className="w-2 h-8 rounded-full bg-white border border-[#0a2e22] shadow active:scale-110 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Toolbar */}
      <div className="p-4 bg-[#0a1d16] border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xl">
        {/* Left Tools: Rotate & Reset */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRotate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-800 text-stone-200 hover:bg-stone-700 active:scale-95 transition-all border border-stone-700"
            title="Rotate 90 degrees clockwise"
          >
            <RotateCw size={14} />
            <span>Rotate 90°</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-800 text-stone-300 hover:bg-stone-700 active:scale-95 transition-all border border-stone-700"
            title="Reset crop frame"
          >
            <RefreshCw size={13} />
            <span>Reset</span>
          </button>
        </div>

        {/* Right Tools: Cancel & Crop & Scan */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-300 hover:text-white bg-transparent hover:bg-stone-800/80 transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={isProcessing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#c5a880] text-[#0a1d16] hover:bg-[#d8be97] active:scale-95 transition-all shadow-lg font-serif disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Cropping...</span>
              </>
            ) : (
              <>
                <Check size={15} className="stroke-[3]" />
                <span>Crop &amp; Scan Card</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
