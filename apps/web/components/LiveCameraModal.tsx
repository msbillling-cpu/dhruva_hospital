'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, RefreshCw, AlertCircle } from 'lucide-react';

export interface LiveCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (capturedFile: File) => void;
}

export default function LiveCameraModal({
  isOpen,
  onClose,
  onCapture,
}: LiveCameraModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopStream();
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setErrorMsg(null);

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setErrorMsg('Webcam access is not supported by your browser. Please use "Upload File".');
        setIsLoading(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            facingMode: 'environment',
          },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setIsLoading(false);
      } catch (err: any) {
        if (!isMounted) return;
        setIsLoading(false);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setErrorMsg('Camera permission was denied. Please allow camera access in your browser settings.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setErrorMsg('No camera or webcam detected on this device. Please connect a webcam or use "Upload File".');
        } else {
          setErrorMsg(`Unable to access camera: ${err.message || 'Unknown error'}`);
        }
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      stopStream();
    };
  }, [isOpen]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `camera-snap-${Date.now()}.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        stopStream();
        onCapture(file);
      },
      'image/jpeg',
      0.95
    );
  };

  const handleClose = () => {
    stopStream();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 select-none animate-fadeIn">
      <div className="w-full max-w-xl bg-[#0a1d16] rounded-2xl border border-emerald-900/60 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 bg-[#071711] border-b border-emerald-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880]">
              <Camera size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Live Camera Scanner
              </h3>
              <p className="text-[11px] text-emerald-200/70">
                Hold your Aadhaar card in front of your camera
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 flex items-center justify-center transition-all cursor-pointer"
            title="Close camera"
          >
            <X size={18} />
          </button>
        </div>

        {/* Video Viewport */}
        <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#c5a880]">
              <RefreshCw size={24} className="animate-spin" />
              <span className="text-xs font-semibold">Starting camera...</span>
            </div>
          )}

          {errorMsg ? (
            <div className="p-6 text-center text-rose-300 space-y-3 max-w-md">
              <AlertCircle size={32} className="mx-auto text-rose-400" />
              <p className="text-xs leading-relaxed">{errorMsg}</p>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold rounded-xl border border-stone-700 transition-all cursor-pointer"
              >
                Use File Upload Instead
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Card Alignment Overlay Frame */}
              {!isLoading && (
                <div className="absolute inset-6 sm:inset-10 border-2 border-dashed border-[#c5a880]/80 rounded-2xl pointer-events-none flex flex-col justify-between p-3 shadow-inner">
                  <div className="flex justify-between items-start">
                    <span className="bg-black/60 text-[#c5a880] text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs border border-[#c5a880]/40">
                      Align Aadhaar Card Here
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="bg-black/60 text-white/90 text-[10px] px-2.5 py-1 rounded-full backdrop-blur-xs">
                      Keep text flat and glare-free
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer / Controls */}
        <div className="p-4 bg-[#071711] border-t border-emerald-900/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-800 transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleCapture}
            disabled={isLoading || !!errorMsg}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#c5a880] text-[#0a1d16] hover:bg-[#d8be97] active:scale-95 transition-all shadow-lg font-serif disabled:opacity-50 cursor-pointer"
          >
            <Camera size={16} />
            <span>Capture Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
