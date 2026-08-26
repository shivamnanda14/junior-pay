"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QrScanner from "qr-scanner";

export default function QRScanner() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  
  const [scanError, setScanError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);

  // Clean up completely when leaving the page
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
      }
    };
  }, []);

  // Camera scanner (Parked for now, but structurally ready for later)
  const handleStartCamera = () => {
    setScanError(null);
    if (!videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        scanner.stop();
        processPayload(result.data);
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
        highlightCodeOutline: true,
        maxScansPerSecond: 10,
      }
    );
    
    scannerRef.current = scanner;

    scanner.start()
      .then(() => {
        setCameraStarted(true);
      })
      .catch((err) => {
        console.error("Camera start failed:", err);
        setScanError("Camera access blocked. Please use the gallery upload for now.");
      });
  };

  // The Flawless Gallery / Screenshot Scanner
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setScanError(null);

    try {
      const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
      processPayload(result.data);
    } catch (err) {
      setIsProcessing(false);
      setScanError("Could not read this QR code. Please upload a clearer screenshot.");
    }
  };

  // Safe UPI deep-link parser
  const processPayload = (decodedText: string) => {
    let vpa = "";
    let name = "";
    let amount = "";

    try {
      const text = decodedText.trim();
      if (text.toLowerCase().startsWith("upi://")) {
        const url = new URL(text);
        vpa = url.searchParams.get("pa") || "";
        name = url.searchParams.get("pn") || "Merchant";
        amount = url.searchParams.get("am") || "";
      } else {
        vpa = text;
        name = "Scanned UPI ID";
      }

      const params = new URLSearchParams({ manual: "true", vpa, name });
      if (amount) params.append("amount", amount);

      // Route to the payment form with the extracted data
      router.push(`/junior-hub/scan?${params.toString()}`);
    } catch (error) {
      setScanError("Scanned successfully, but the QR code is not a valid UPI format.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 max-w-sm mx-auto pb-10">
      {scanError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-bold text-center">
          {scanError}
        </div>
      )}

      {/* Camera Viewport (Parked) */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-black shadow-inner aspect-square flex items-center justify-center">
        
        <video 
          ref={videoRef}
          className="w-full h-full object-cover absolute inset-0 z-0"
        />
        
        {!cameraStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10 p-6 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-2xl">
              📷
            </div>
            <button 
              type="button"
              onClick={handleStartCamera}
              className="bg-purple-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-purple-600 active:scale-95 transition"
            >
              Test Camera (WIP)
            </button>
          </div>
        )}
      </div>

      {/* The Working Gallery Scanner */}
      <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 text-center space-y-2">
        <p className="text-xs font-bold text-purple-900">Scan from Gallery</p>
        <label className="block w-full bg-[#5f259f] text-white py-3 rounded-xl font-bold text-xs cursor-pointer hover:bg-purple-800 transition shadow">
          {isProcessing ? "Decoding..." : "Upload QR Screenshot"}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageUpload}
            disabled={isProcessing}
          />
        </label>
      </div>

      <div className="text-center pt-1">
        <a 
          href="/junior-hub/scan?manual=true" 
          className="text-xs text-slate-500 font-bold hover:underline"
        >
          Or Enter UPI ID Manually →
        </a>
      </div>
    </div>
  );
}