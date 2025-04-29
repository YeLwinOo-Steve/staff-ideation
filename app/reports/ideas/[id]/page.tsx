"use client";

import { useEffect } from "react";
import { useApiStore } from "@/store/apiStore";
import { AlertTriangle, ArrowLeft, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar } from "@/app/components/Avatar";
import { useRouter } from "next/navigation";
import { use } from "react";
import NavBar from "@/app/ideas/components/navBar";

interface ReportedIdeaDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const ReportedIdeaDetails = ({ params }: ReportedIdeaDetailsProps) => {
  const { id } = use(params);
  const router = useRouter();
  const {
    reportedIdeas: { data: reportedIdeas },
    reportDetails,
    fetchReportDetails,
    fetchReportedIdeas,
  } = useApiStore();

  const idea = reportedIdeas.find((idea) => idea.id === parseInt(id));

  useEffect(() => {
    const loadData = async () => {
      if (!idea) {
        await fetchReportedIdeas();
      }
      await fetchReportDetails(parseInt(id));
    };
    loadData();
  }, [id, idea, fetchReportedIdeas, fetchReportDetails]);

  if (!idea) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="px-6 py-4">
        <div className="bg-base-100 z-30 -mx-6 px-6 py-4">
          <div className="flex justify-between max-w-6xl mx-auto">
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-md"
              onClick={() => router.back()}
            >
              <ChevronLeft size={20} />
              <span className="font-bold">Idea Details</span>
            </motion.button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 pt-4">

          {/* Main Content */}
          <div className="space-y-8">
            {/* Idea Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-base-200/50 rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16">
                  <Avatar src={idea.photo} alt={idea.user_name} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{idea.user_name}</h2>
                  <p className="text-base-content/60">{idea.department}</p>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-medium">{idea.title}</h3>
                <p className="text-base-content/80 leading-relaxed">
                  {idea.content}
                </p>
              </div>
            </motion.div>

            {/* Reports Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Reports</h2>
                <span className="badge badge-error badge-lg">
                  {reportDetails.length} reports
                </span>
              </div>

              <div className="space-y-4">
                {reportDetails.map((report, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-base-200/50 rounded-xl p-6 space-y-4"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar src={report.user_photo} alt={report.user_name} />
                      <div>
                        <h3 className="font-medium">{report.user_name}</h3>
                        <p className="text-sm text-base-content/60">
                          {report.user_department}
                        </p>
                      </div>
                    </div>
                    <div className="pl-16">
                      <p className="text-base-content/80">{report.reason}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportedIdeaDetails;
