import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

import {
  Camera,
  Image,
  Package,
  Barcode,
  ScanLine,
  Search,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { getProduct } from "../services/api";
import CustomModal from "../components/CustomModal";

export default function CashierPage() {

  const [product, setProduct] = useState(null);
  const [barcode, setBarcode] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    type: "error",
  });

  const scannerRef = useRef(null);

  const showModal = (
    title,
    message,
    type = "error"
  ) => {

    setModal({
      open: true,
      title,
      message,
      type,
    });

  };

  const searchProduct = async (code) => {

    try {

      setLoading(true);

      const result =
        await getProduct(code);

      if (result.success) {

        setProduct(result);

        showModal(
          "Produk Ditemukan",
          `${result.nama} berhasil ditemukan`,
          "success"
        );

      } else {

        setProduct(null);

        showModal(
          "Produk Tidak Ditemukan",
          `Barcode ${code} tidak tersedia pada database`
        );

      }

    } catch (error) {

      console.error(error);

      showModal(
        "Koneksi Gagal",
        "Tidak dapat terhubung ke server"
      );

    } finally {

      setLoading(false);

    }

  };

  const startCamera = async () => {

    try {

      setCameraOpen(true);

      const scanner =
        new Html5Qrcode("reader");

      scannerRef.current = scanner;

      await scanner.start(
        {
          facingMode: "environment",
        },
        {
          fps: 10,
          qrbox: 250,
        },
        async (decodedText) => {

          setBarcode(decodedText);

          await searchProduct(
            decodedText
          );

          await stopCamera();

        }
      );

    } catch (err) {

      console.error(err);

      showModal(
        "Kamera Error",
        "Tidak dapat membuka kamera"
      );

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

  const handleUpload = async (
    event
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) return;

    try {

      const scanner =
        new Html5Qrcode(
          "temp-reader"
        );

      const decodedText =
        await scanner.scanFile(
          file,
          true
        );

      setBarcode(decodedText);

      await searchProduct(
        decodedText
      );

    } catch (err) {

      showModal(
        "Scan Gagal",
        "Barcode tidak ditemukan pada gambar"
      );

    }

  };

  useEffect(() => {

    return () => {
      stopCamera();
    };

  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">

      <CustomModal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={() =>
          setModal({
            ...modal,
            open: false,
          })
        }
      />

      <div className="max-w-5xl mx-auto p-6">

        <div className="mb-10">

          <div className="flex items-center gap-3">

            <Sparkles
              className="text-cyan-400"
            />

            <h1 className="text-4xl font-bold">
              Smart Kasir
            </h1>

          </div>

          <p className="text-slate-400 mt-2">
            Scan barcode produk dengan
            kamera atau upload gambar
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">

          <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl p-5">

            <p className="text-slate-400">
              Status
            </p>

            <p className="text-xl font-bold">
              {loading
                ? "Mencari..."
                : "Siap"}
            </p>

          </div>

          <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl p-5">

            <p className="text-slate-400">
              Barcode Terakhir
            </p>

            <p className="truncate">
              {barcode || "-"}
            </p>

          </div>

          <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl p-5">

            <p className="text-slate-400">
              Produk
            </p>

            <p>
              {product?.nama || "-"}
            </p>

          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <button
            onClick={startCamera}
            className="
              bg-blue-600
              hover:bg-blue-700
              rounded-2xl
              p-5
              flex items-center justify-center gap-3
              text-lg font-semibold
              transition
            "
          >
            <Camera />
            Scan Kamera
          </button>

          <label
            className="
              bg-slate-800
              hover:bg-slate-700
              rounded-2xl
              p-5
              flex items-center justify-center gap-3
              cursor-pointer
              text-lg font-semibold
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

          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-3xl p-4">

            <div className="flex items-center gap-2 mb-4">

              <Camera />

              <span>
                Kamera Scanner
              </span>

            </div>

            <div id="reader" />

          </div>

        )}

        {product && (

          <div className="mt-8 bg-slate-900 border border-green-700 rounded-3xl p-8">

            <div className="flex items-center gap-3 mb-6">

              <CheckCircle2
                className="text-green-400"
              />

              <h2 className="text-2xl font-bold">
                Produk Ditemukan
              </h2>

            </div>

            <div className="grid md:grid-cols-3 gap-6">

              <div>

                <div className="flex items-center gap-2 mb-2">

                  <Barcode size={18} />

                  <span>
                    Barcode
                  </span>

                </div>

                <p>
                  {product.barcode}
                </p>

              </div>

              <div>

                <div className="flex items-center gap-2 mb-2">

                  <Package size={18} />

                  <span>
                    Nama Produk
                  </span>

                </div>

                <p className="text-xl">
                  {product.nama}
                </p>

              </div>

              <div>

                <div className="flex items-center gap-2 mb-2">

                  <Search size={18} />

                  <span>
                    Harga
                  </span>

                </div>

                <p className="text-4xl font-bold text-green-400">
                  Rp{" "}
                  {Number(
                    product.harga
                  ).toLocaleString(
                    "id-ID"
                  )}
                </p>

              </div>

            </div>

          </div>

        )}

        <div
          id="temp-reader"
          className="hidden"
        />

      </div>

    </div>
  );
}