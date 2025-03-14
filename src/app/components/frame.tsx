"use client";
import { useState, useEffect } from "react";
import sdk from "@farcaster/frame-sdk";
import Image from "next/image";

// Definición del tipo para el resultado de addFrame, basado en la documentación
type AddFrameResult = 
  | { added: true; notificationDetails?: { url: string; token: string } }
  | { added: false; reason: "invalid_domain_manifest" | "rejected_by_user" };

export default function Analizador() {
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jobType, setJobType] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  // Notifica a Farcaster que el frame está listo y solicita agregar el frame
  useEffect(() => {
    sdk.actions.ready();
    sdk.actions.addFrame().then((result) => {
      // Forzamos el tipo para que TypeScript reconozca las propiedades
      const res = result as AddFrameResult;
      if (res.added) {
        console.log("Frame agregado", res.notificationDetails);
      } else {
        console.log("Frame no agregado:", res.reason);
      }
    });
  }, []);

  // Función para volver a la landing page (oculta el formulario)
  const handleBack = () => {
    setShowForm(false);
    setFeedback("");
    setFile(null);
    setJobType("");
  };

  // Cambia la vista al formulario
  const handleStart = () => {
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a Cv's.");
      return;
    }
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_URL}/analyzeResume`, {
        method: "POST",
        body: (() => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("job_type", jobType);
          return formData;
        })(),
      });
      const data = await res.json();
      setFeedback(data.feedback);
    } catch (error) {
      console.error("Error analising the CV:", error);
      setFeedback("An error occurred while parsing the resume.");
    }
    setLoading(false);
  };

  if (!showForm) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="mb-8">
          {/* Asegurate de tener tu imagen en la carpeta public, por ejemplo public/skinner-logo5.png */}
          <Image src="/skinner-logo5.png" alt="Logo" width={200} height={200} />
        </div>
        <button
          onClick={handleStart}
          className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded"
        >
          Analyse your CV
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl text-purple-800">CV Analyser</h1>
        
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Select your CV (PDF or DOCX):
          </label>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Type of work (optional):
          </label>
          <input
            type="text"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            placeholder="Ej: Developer, Marketing, etc."
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Analysing..." : "Analyse"}
        </button>

        {/* Botón para volver a la landing */}
        <button
          onClick={handleBack}
          className="mt-4 px-4 py-2  bg-purple-500 hover:bg-purple-600 text-white p-2 rounded"
        >
          Back
        </button>
      </form>
      {feedback && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h2 className="font-bold mb-2 text-gray-800">Feedback:</h2>
          <p className="text-gray-700">{feedback}</p>
        </div>
      )}
    </div>
  );
}
