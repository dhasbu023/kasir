import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  Camera,
  Image,
  Package,
  Barcode,
  ScanLine
} from "lucide-react";

import { getProduct } from "../services/api";

export default function CashierPage() {
  const [product, setProduct] = useState(null);
  const [barcode, setBarcode] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);

  const scannerRef = useRef(null);

  const searchProduct = async (code) => {
    try {
      const result = await getProduct(code);

      if (result.success) {
        setProduct(result);
      } else {
        setProduct(null);
        alert("Produk tidak ditemukan");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const startCamera = async () => {
    try {
      setCameraOpen(true);

      const scanner = new Html5Qrcode("reader");

      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 250,
        },
        async (decodedText) => {
          setBarcode(decodedText);

          await searchProduct(decodedText);

          await stopCamera();
        }
      );
    } catch (err) {
      console.error(err);
      alert("Gagal membuka kamera");
    }
  };

  const stopCamera = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      }

      setCameraOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const scanner = new Html5Qrcode("temp-reader");

      const decodedText =
        await scanner.scanFile(file, true);

      setBarcode(decodedText);

      await searchProduct(decodedText);

    } catch (err) {
      alert("Barcode tidak ditemukan pada gambar");
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="max-w-4xl mx-auto p-6">

        <div className="flex items-center gap-3 mb-8">

          <ScanLine size={36} />

          <div>
            <h1 className="text-3xl font-bold">
              Kasir Barcode
            </h1>

            <p className="text-slate-400">
              Scan produk menggunakan kamera
            </p>
          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <button
            onClick={startCamera}
            className="
              flex items-center justify-center gap-3
              bg-blue-600 hover:bg-blue-700
              rounded-xl p-4
              transition
            "
          >
            <Camera />
            Scan Kamera
          </button>

          <label
            className="
              flex items-center justify-center gap-3
              bg-slate-800 hover:bg-slate-700
              rounded-xl p-4
              cursor-pointer
            "
          >
            <Image />
            Upload Gambar

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </label>

        </div>

        {cameraOpen && (

          <div
            className="
              mt-6
              bg-slate-900
              border border-slate-800
              rounded-2xl
              p-4
            "
          >
            <div id="reader" />
          </div>

        )}

        {barcode && (

          <div
            className="
              mt-6
              bg-slate-900
              border border-slate-800
              rounded-2xl
              p-5
            "
          >

            <div className="flex items-center gap-2 mb-2">

              <Barcode size={20} />

              <span className="font-semibold">
                Barcode
              </span>

            </div>

            <p className="text-slate-300">
              {barcode}
            </p>

          </div>

        )}

        {product && (

          <div
            className="
              mt-6
              bg-slate-900
              border border-slate-800
              rounded-2xl
              p-6
            "
          >

            <div className="flex items-center gap-2 mb-5">

              <Package />

              <h2 className="text-xl font-bold">
                Produk Ditemukan
              </h2>

            </div>

            <div className="space-y-4">

              <div>

                <p className="text-slate-400">
                  Barcode
                </p>

                <p>{product.barcode}</p>

              </div>

              <div>

                <p className="text-slate-400">
                  Nama Produk
                </p>

                <p className="text-lg">
                  {product.nama}
                </p>

              </div>

              <div>

                <p className="text-slate-400">
                  Harga
                </p>

                <p
                  className="
                    text-4xl
                    font-bold
                    text-green-400
                  "
                >
                  Rp{" "}
                  {Number(
                    product.harga
                  ).toLocaleString("id-ID")}
                </p>

              </div>

            </div>

          </div>

        )}

        <div id="temp-reader" className="hidden" />

      </div>

    </div>
  );
}