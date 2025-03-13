// pages/api/analyzeResume.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  //la URL de la API deployada desde la variable de entorno
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!NEXT_PUBLIC_API_URL) {
    return res.status(500).json({ message: "NEXT_PUBLIC_API_URL no está definida en las variables de entorno." });
  }

  try {
    // Redirigir la petición a la API deployada
    const apiResponse = await fetch(`${NEXT_PUBLIC_API_URL}/analyzeResume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Si el body es JSON, Next.js ya lo convierte en string; si no, usá JSON.stringify
      body: req.body,
    });

    const data = await apiResponse.json();
    // Devolver la respuesta con el status code de la API deployada
    res.status(apiResponse.status).json(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error al conectar con la API deployada:', error);
    res.status(500).json({ message: 'Error en la API desplegada', error: error.message });
  }
}