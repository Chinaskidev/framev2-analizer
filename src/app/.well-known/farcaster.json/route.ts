export async function GET() {
 
  const config = {
  "accountAssociation": {
    "header": "eyJmaWQiOjM4NjI1MiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEJDNjQ0MmZCMTc3MzBlZDJCQ2Q1NmNENzQyOWU4MkYyQTE5ZTc4YzYifQ",
    "payload": "eyJkb21haW4iOiJmcmFtZXYyLWFuYWxpemVyLnZlcmNlbC5hcHAifQ",
    "signature": "MHg2OWE3Yzk4YmUxY2FhNTE4NDRkMDdkNzZjYmE0ZDVhODFiOTRiOTlkMTYxOWZmM2ViNDA1YzFiNmVkMmE4ODA1NzhhNjlmNzczODJmZGEwODAxYTQzMzdiYzczMDA1YmRmYzUzYTRlOTk1YjA1MzQzMWUyNmI4MTRmMWVlNjQyMjFi"
  },
  "frame": {
    "version": "0.0.1",
    "name": "Skinner: A Bot to Analyse CVs",
    "iconUrl": "https://framev2-analizer.vercel.app/skinner-logo5.png",
    "homeUrl": "https://framev2-analizer.vercel.app",
    "imageUrl": "https://framev2-analizer.vercel.app/skinner-logo5.png",
    "buttonTitle": "Start",
    "splashImageUrl": "https://framev2-analizer.vercel.app/splash.png",
    "splashBackgroundColor": "#eeccff",
    "webhookUrl": "https://framev2-analizer.vercel.app/api/webhook"
  },
};
    return Response.json(config);
}