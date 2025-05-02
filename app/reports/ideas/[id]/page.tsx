"use client";

import { useEffect, useState, useCallback } from "react";
import { useApiStore } from "@/store/apiStore";
import {
  ChevronLeft,
  EyeOff,
  Eye,
  UserX,
  UserCheck,
  ShieldOff,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar } from "@/app/components/Avatar";
import { useRouter } from "next/navigation";
import { use } from "react";
import NavBar from "@/app/ideas/components/navBar";
import { useToast } from "@/components/toast";
import { hasPermission } from "@/app/lib/utils";

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
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();
  const { user: authUser } = useApiStore();
  const {
    reportedIdeas: { data: reportedIdeas },
    reportDetails,
    user,
    getUser,
    fetchReportDetails,
    fetchReportedIdeas,
    getHiddenIdeas,
    getHiddenUsers,
    getBannedUsers,
    hideIdea,
    hideUserIdeas,
    removeIdeaPermissions,
    giveIdeaPermissions,
  } = useApiStore();

  const [hiddenUsers, setHiddenUsers] = useState<number[]>([]);
  const [bannedUsers, setBannedUsers] = useState<number[]>([]);

  const idea = reportedIdeas.find((idea) => idea.id === parseInt(id));

  const canBanUser = hasPermission(user, "banned user");
  const loadData = useCallback(async () => {
    if (!idea) {
      await fetchReportedIdeas();
    }
    await fetchReportDetails(parseInt(id));
    if (authUser?.id) {
      await getUser(authUser.id);
    }
    // Load hidden/banned states
    try {
      const promises = [getHiddenIdeas(), getHiddenUsers()];
      if (canBanUser) {
        promises.push(getBannedUsers());
      }
      await Promise.all(promises);

      // Update states based on API responses
      const hiddenUserIds =
        useApiStore.getState().hiddenUsers?.data?.map((idea) => idea.id) || [];
      const bannedUserIds =
        useApiStore.getState().bannedUsers?.data?.map((user) => user.id) || [];

      setHiddenUsers(hiddenUserIds);
      setBannedUsers(bannedUserIds);
    } catch (error) {
      console.error("Failed to load states:", error);
      showErrorToast("Failed to load idea states");
    }
  }, [
    authUser?.id,
    canBanUser,
    fetchReportDetails,
    fetchReportedIdeas,
    getBannedUsers,
    getHiddenIdeas,
    getHiddenUsers,
    getUser,
    id,
    idea,
    showErrorToast,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isIdeaHidden = idea && idea.hidden ? true : false;
  const isUserHidden =
    idea && idea.user_id && hiddenUsers.includes(idea.user_id);
  const isUserBanned =
    idea && idea.user_id && bannedUsers.includes(idea.user_id);

  const handleIdeaVisibility = async () => {
    if (!idea) return;
    setIsLoading(true);
    try {
      await hideIdea(idea.id, isIdeaHidden ? 0 : 1);
      showSuccessToast(
        isIdeaHidden ? "Idea is now visible" : "Idea has been hidden",
      );
      // Refresh the idea to get updated hidden status
      await fetchReportedIdeas();
    } catch (error) {
      console.error("Failed to update idea visibility:", error);
      showErrorToast("Failed to update idea visibility");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserVisibility = async () => {
    if (!idea?.user_id) return;
    setIsLoading(true);
    try {
      await hideUserIdeas(idea.user_id, isUserHidden ? 0 : 1);
      showSuccessToast(
        isUserHidden
          ? "User's ideas are now visible"
          : "User's ideas have been hidden",
      );
      await getHiddenUsers();
      // Update local state with new hidden users
      const updatedHiddenUserIds =
        useApiStore.getState().hiddenUsers?.data?.map((idea) => idea.id) || [];
      setHiddenUsers(updatedHiddenUserIds);
    } catch (error) {
      console.error("Failed to update user visibility:", error);
      showErrorToast("Failed to update user visibility");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdeaPermissions = async () => {
    if (!idea?.user_id) return;
    setIsLoading(true);
    try {
      if (isUserBanned) {
        await giveIdeaPermissions(idea.user_id);
        showSuccessToast("Idea permissions restored for user");
      } else {
        await removeIdeaPermissions(idea.user_id);
        showSuccessToast("Idea permissions removed from user");
      }
      await getBannedUsers();
      // Update local state with new banned users
      const updatedBannedUserIds =
        useApiStore.getState().bannedUsers?.data?.map((user) => user.id) || [];
      setBannedUsers(updatedBannedUserIds);
    } catch (error) {
      console.error("Failed to update idea permissions:", error);
      showErrorToast("Failed to update idea permissions");
    } finally {
      setIsLoading(false);
    }
  };

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
              <span className="font-bold">All Ideas</span>
            </motion.button>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`btn btn-sm ${isIdeaHidden ? "btn-success" : "btn-warning"}`}
                onClick={handleIdeaVisibility}
                disabled={isLoading}
              >
                {isIdeaHidden ? (
                  <>
                    <Eye size={16} />
                    <span>Show Idea</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={16} />
                    <span>Hide Idea</span>
                  </>
                )}
              </motion.button>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`btn btn-sm ${isUserHidden ? "btn-success" : "btn-warning"}`}
                onClick={handleUserVisibility}
                disabled={isLoading}
              >
                {isUserHidden ? (
                  <>
                    <UserCheck size={16} />
                    <span>Show User Ideas</span>
                  </>
                ) : (
                  <>
                    <UserX size={16} />
                    <span>Hide User Ideas</span>
                  </>
                )}
              </motion.button>

              {canBanUser && (
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`btn btn-sm ${isUserBanned ? "btn-success" : "btn-error"}`}
                  onClick={handleIdeaPermissions}
                  disabled={isLoading}
                >
                  {isUserBanned ? (
                    <>
                      <Shield size={16} />
                      <span>Unban User</span>
                    </>
                  ) : (
                    <>
                      <ShieldOff size={16} />
                      <span>Ban User</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 pt-4">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Status Badges */}
            {(isIdeaHidden || isUserHidden || isUserBanned) && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2"
              >
                {isIdeaHidden && (
                  <span className="badge badge-warning gap-1">
                    <EyeOff size={14} />
                    Hidden Idea
                  </span>
                )}
                {isUserHidden ? (
                  <span className="badge badge-warning gap-1">
                    <UserX size={14} />
                    Hidden User
                  </span>
                ) : null}
                {isUserBanned && (
                  <span className="badge badge-error gap-1">
                    <ShieldOff size={14} />
                    Banned User
                  </span>
                )}
              </motion.div>
            )}

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
