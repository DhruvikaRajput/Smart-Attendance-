import { useRef, useEffect, useState } from 'react';
import { Camera } from 'lucide-react';

export default function WebcamCapture({ onCapture, disabled = false }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mediaStream = null;

    const startCamera = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Failed to access camera. Please check permissions.');
      }
    };

    startCamera();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capture = () => {
    if (!videoRef.current || !stream) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    onCapture(imageData);
  };

  if (error) {
    return (
      <div className="bg-background rounded-card p-8 text-center border border-border">
        <p className="text-text-secondary">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative bg-background rounded-card overflow-hidden border border-border">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-auto"
        style={{ display: stream ? 'block' : 'none' }}
      />
      {!stream && (
        <div className="w-full h-64 flex items-center justify-center">
          <div className="text-text-secondary">Loading camera...</div>
        </div>
      )}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <button
          onClick={capture}
          disabled={disabled || !stream}
          className="btn btn-primary flex items-center gap-2 shadow-lg"
        >
          <Camera size={18} />
          Capture
        </button>
      </div>
    </div>
  );
}

