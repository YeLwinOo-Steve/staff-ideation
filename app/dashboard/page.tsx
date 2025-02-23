"use client"

import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { CSVLink } from "react-csv"
import JSZip from "jszip";
import { saveAs } from "file-saver"

const zip = new JSZip();
const downloadZipFile = async () => {
  const urls = [
    'https://i.pinimg.com/736x/7e/f3/00/7ef3009e0efeb251f1d6d16f56ddff64.jpg',
    'https://i.pinimg.com/236x/ac/0d/b7/ac0db732637f7a08231ea4cd23d411a9.jpg',
  ];

  const promises = urls.map(async (url, index) => {
    const proxyUrl = "https://api.allorigins.win/raw?url=";
    const res = await fetch(proxyUrl + encodeURIComponent(url));
    const blob = await res.blob();
    zip.file(`file${index + 1}.${blob.type.split("/")[1]}`, blob);
  });
  await Promise.all(promises);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, 'downloaded_documents.zip');
}

const ZipDownloadBtn = () => (
  <div>
    <button
      onClick={downloadZipFile}
      className="btn btn-outline mb-8"
    >
      Download Zip Files
    </button>
  </div>
);

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

