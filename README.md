This portfolio is built with **Next.js (App Router)** and is ready to deploy on **Vercel**.

To run locally, clone the repo, install dependencies, and start the dev server:

`git clone https://github.com/harniiil/portfolio.git`  
`cd portfolio`  
`npm install`  
`npm run dev`

Open `http://localhost:3000` in your browser.

To deploy on Vercel:

1. Push this repository to GitHub (already done).
2. Go to Vercel → **Add New Project** → import `harniiil/portfolio`.
3. Use the default Next.js settings:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: (leave default)
4. Click **Deploy**.

Vercel will automatically redeploy on every push to the `main` branch.

If the deployment fails, run `npm run build` locally to reproduce the error and check the Vercel build logs for the exact TypeScript or dependency issue.

Contact:  
LinkedIn: https://www.linkedin.com/in/harnil-makwana  
Email: makwanaharnil@gmail.com
