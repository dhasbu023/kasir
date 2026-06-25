import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { getProduct } from "../services/api";

export default function CashierPage() {
  const [product, setProduct] = useState(null);
  const [barcode, setBarcode] = useState("");

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    const onScanSuccess = async (decodedText) => {
      try {
        setBarcode(decodedText);

        const result = await getProduct(decodedText);

        if (result.success) {
          setProduct(result);
        } else {
          alert("Produk tidak ditemukan");
          setProduct(null);
        }
      } catch (error) {
        console.error(error);
      }
    };

    scanner.render(onScanSuccess);

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Kasir Barcode
        </h1>

        <div className="bg-white rounded-xl shadow p-4">
          <div id="reader"></div>
        </div>

        {barcode && (
          <div className="mt-4 bg-blue-50 p-4 rounded-lg">
            <p className="font-semibold">
              Barcode:
            </p>

            <p>{barcode}</p>
          </div>
        )}

        {product && (
          <div className="mt-6 bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-4">
              Produk Ditemukan
            </h2>

            <div className="space-y-2">

              <p>
                <strong>Barcode:</strong>{" "}
                {product.barcode}
              </p>

              <p>
                <strong>Nama:</strong>{" "}
                {product.nama}
              </p>

              <p className="text-3xl font-bold text-green-600">
                Rp{" "}
                {Number(product.harga).toLocaleString(
                  "id-ID"
                )}
              </p>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}