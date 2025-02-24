"use client"

import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CSVLink } from "react-csv"
import JSZip from "jszip";
import { saveAs } from "file-saver"

const zip = new JSZip();

const ZipDownloadBtn = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'downloading' | 'zipping' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const urls = [
    'https://i.pinimg.com/736x/7e/f3/00/7ef3009e0efeb251f1d6d16f56ddff64.jpg',
    'https://i.pinimg.com/236x/ac/0d/b7/ac0db732637f7a08231ea4cd23d411a9.jpg',
  ];

  const downloadZipFile = async () => {
    try {
      setIsLoading(true);
      setStatus('downloading')
      setError(null);

      for (const [index, url] of urls.entries()) {
        try {
          const proxyUrl = "https://api.allorigins.win/raw?url=";
          const res = await fetch(proxyUrl + encodeURIComponent(url));
          if (!res.ok) throw new Error(`Failed to download file ${index + 1}`);

          const blob = await res.blob();
          zip.file(`file${index + 1}.${blob.type.split("/")[1]}`, blob);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
          throw new Error(`Error downloading file ${index + 1}: ${errorMessage}`)
        }
      }
      setStatus('zipping')
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'downloaded_documents.zip');
      setStatus('idle')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage)
      setStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonText = () => {
    switch (status) {
      case 'downloading':
        return (
          <>
            <span className="loading loading-spinner"></span>
            <span className="ml-2">Downloading files...</span>
          </>
        )
      case 'zipping':
        return (
          <>
            <span className="loading loading-spinner"></span>
            <span className="ml-2">Creating ZIP file...</span>
          </>
        )
      case 'error':
        return 'Try Again'
      default:
        return 'Download Zip Files'
    }
  }

  return (
    <div>
      <button
        onClick={downloadZipFile}
        className={`btn btn-outline mb-2 ${status === 'error' ? 'btn-error' : ''}`} disabled={isLoading}
      >
        {getButtonText()}
      </button>
      {
        error && (
          <div className="txt-error text-base">
            {error}
          </div>
        )
      }
    </div>
  )
};

export default function Dashboard() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const data = [
    { name: "John", age: 30, city: "New York" },
    { name: "Jane", age: 25, city: "Los Angeles" },
  ];


  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Welcome, {user.name}!</h1>
          <p className="py-6">You have successfully logged in to your dashboard.</p>
          <div className="stats-horizontal">
            <div className="stats shadow mx-4 my-8">
              <div className="stat">
                <div className="stat-title">Total Ideas</div>
                <div className="stat-value">25</div>
                <div className="stat-desc">Number of unique ideas</div>
              </div>
            </div>
            <div className="stats shadow mx-4">
              <div className="stat">
                <div className="stat-title">Total Staff</div>
                <div className="stat-value">18</div>
                <div className="stat-desc">Staff in EWSD Dep</div>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <CSVLink data={data} filename="data.csv" className="btn btn-link">
              Download CSV
            </CSVLink>
          </div>

          <ZipDownloadBtn />
          <button
            onClick={() => {
              logout()
              router.push("/")
            }}
            className="btn btn-primary"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

