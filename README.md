# 💻 Developer Trends Tracker

**Author:** [Jeremy McCulley](#)  
**Live Demo:** [developer-trends-tracking.ct.ws](#)  
**Website:** [pixelbypixeldesigns.ca](#)  
**Portfolio:** [dev-portfolio.ct.ws](#)  
**LinkedIn:** [www.linkedin.com/in/jermcculley](#)

---

## 🧩 Description

**Developer Trends Tracker** is a dynamic dashboard built with **React** and **TypeScript** to track and visualize the **top 10 trending programming languages on GitHub**.  
It leverages the **GitHub Search API** to gather repositories created in the **last 30 days**, with powerful filtering and visualization features.

---

## 🚀 Features

- **⚡ Real-time Data:** Fetches trending repository data directly from the GitHub Search API.  
- **🕒 Time-Bounded Results:** Focuses on repositories created within the last 30 days.  
- **🎯 Dynamic Filtering:** Filter by **location** (e.g., California) and **topic** (e.g., TypeScript, LLM).  
- **⌛ Debounced Search:** Custom React hook delays API calls until typing stops — boosting performance.  
- **🔁 Efficient State Management:** Built with **TanStack Query (React Query)** for caching and background updates.  
- **📊 Data Visualization:** Interactive bar charts powered by **Recharts**.

---

## 🧰 Project Setup & Installation

### 1️⃣ Initialize Project and Install Dependencies

```bash
# Create a new React + TypeScript project with Vite
npm create vite@latest developer-trends-tracker -- --template react-ts

# Install core dependencies
npm install @tanstack/react-query recharts

# Install LESS for styling (optional)
npm install less --save-dev

### 2️⃣ File Structure Setup
```bash
# Create project directories
mkdir 'src/api' 'src/components' 'src/hooks' 'src/pages' 'src/types'
mkdir src/components/trends

# Create core files (Windows PowerShell commands shown)
New-Item -Path src/types/index.ts -ItemType File
New-Item -Path src/api/github.ts -ItemType File
New-Item -Path src/hooks/useDebounce.ts -ItemType File
New-Item -Path src/hooks/useTrendingRepos.ts -ItemType File
New-Item -Path src/components/trends/TrendChart.tsx -ItemType File
New-Item -Path src/pages/Dashboard.tsx -ItemType File

### 3️⃣ Configure GitHub Token
```bash
To avoid GitHub’s rate limits, use a Personal Access Token:
Create a file named .env in your project’s root directory.
Add the following line:
VITE_GITHUB_TOKEN="YOUR_PERSONAL_ACCESS_TOKEN_HERE"

| Category           | Technology                |
| ------------------ | ------------------------- |
| Frontend Framework | React (Vite + TypeScript) |
| State Management   | TanStack Query            |
| Charts             | Recharts                  |
| Styling            | LESS                      |
| API                | GitHub Search API         |

# 🪪 License
This project is open source under the MIT License.
Feel free to use, modify, and share.

### ⭐ Acknowledgements
GitHub REST API
TanStack Query
Recharts
Vite
