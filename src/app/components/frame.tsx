"use client";
import { useState, useEffect } from "react";
import sdk from "@farcaster/frame-sdk";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

// Definición del tipo para el resultado de addFrame, basado en la documentación
type AddFrameResult =
  | { added: true; notificationDetails?: { url: string; token: string } }
  | { added: false; reason: "invalid_domain_manifest" | "rejected_by_user" };

export default function Analizador() {
  const [showWarning, setShowWarning] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jobType, setJobType] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  // Inicializa el SDK de Farcaster
  useEffect(() => {
    sdk.actions.ready();
    sdk.actions.addFrame().then((result) => {
      const res = result as AddFrameResult;
      if (res.added) {
        console.log("Frame agregado", res.notificationDetails);
      } else {
        console.log("Frame no agregado:", res.reason);
      }
    });
  }, []);

  // Funciones para manejar la advertencia
  const handleAccept = () => {
    setShowWarning(false);
  };

 

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

  // Captura el archivo seleccionado
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Envía el formulario para analizar el CV
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a CV.");
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
      console.error("Error parsing the CV:", error);
      setFeedback("An error occurred while parsing the resume.");
    }
    setLoading(false);
  };

  // Renderiza la landing page con la advertencia como card en la parte superior
  if (!showForm) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-violet-100 relative">
        {/* Card de advertencia en la parte superior */}
        {showWarning && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded shadow-lg max-w-md z-50">
            <button
              onClick={handleAccept}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              X
            </button>
            <h2 className="text-xl font-bold mb-4 text-red-800">Privacy Notice</h2>
            <p className="mb-4 text-black">
            We don’t use your data. This app is simply for you to experience the mini-app, 
            where Skinner provides feedback and helps you improve your CV.
            </p>
            <div className="flex justify-end">
            </div>
          </div>
        )}

        {/* Contenido de la landing page */}
        <div className="mb-8">
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

  // Pantalla con el formulario para subir el archivo y mostrar el feedback
  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl text-purple-800">CV Analyser</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Custom file input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Select your CV (PDF or DOCX):
          </label>

          <div className="flex items-center">
            <label
              htmlFor="fileInput"
              className="cursor-pointer px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded"
            >
              Choose File
            </label>
            <input
              id="fileInput"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="ml-2 text-gray-300">
              {file ? file.name : "No file selected"}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Ask Skinner about your CV:
          </label>
          <input
            type="text"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            placeholder="Ex: Could you check if my CV is well designed?"
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

        <button
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded"
        >
          Back
        </button>
      </form>

      {feedback && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h2 className="font-bold mb-2 text-gray-800">Feedback:</h2>
          <div className="text-gray-700">
            <ReactMarkdown>{feedback}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
