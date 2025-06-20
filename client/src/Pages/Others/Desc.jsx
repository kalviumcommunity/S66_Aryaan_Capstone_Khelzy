import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import {
  Clock,
  Users,
  Star,
  Award,
  Share2,
  Heart,
  Eye,
  Maximize,
  Minimize,
  ChevronRight,
  MessageCircle,
  Download,
  Info,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { API_URL } from "../config";
import { ToastContainer, toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";

const Desc = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState();
  const [relatedGames, setRelatedGames] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [comments, setComments] = useState([]);
  const [addComments, setAddComments] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const gameFrameStyle = isFullscreen
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 50,
        border: "none",
      }
    : {
        width: "100%",
        height: "600px",
        borderRadius: "12px",
        border: "none",
      };

  //Games fetch
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const startTime = Date.now();
        delete axios.defaults.headers.common["Origin"];
        const response = await axios.get(`${API_URL}/games/${id}`, {
          withCredentials: true,
        });

        const game = response.data.game;
        setGame(game);

        if (game.category) {
          const relatedResponse = await axios.get(
            `${API_URL}/games/filter/${game.category}?limit=4`,
            { withCredentials: true }
          );
          console.log(game.category);

          const filteredGames = relatedResponse.data.games.filter(
            (g) => g._id !== id
          );
          // console.log(relatedResponse)
          setRelatedGames(filteredGames.slice(0, 3));

          const elapsedTime = Date.now() - startTime;
          const remainingDelay = Math.max(0, 3000 - elapsedTime);
          setTimeout(() => {
            setLoading(false);
          }, remainingDelay);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "An error occurred");
      }
    };

    fetchGame();
    window.scrollTo(0, 0);
  }, [id]);

  // Add useEffect to fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/me`, {
          withCredentials: true,
        });
        setCurrentUser(response.data.user);
        console.log(response.data.user);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Failed to fetch user:", error);
        }
      }
    };

    fetchUser();
  }, []);

  //Fetch Comments
  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await axios.get(`${API_URL}/comments/${id}`, {
          withCredentials: true,
        });

        setComments(response.data);
      } catch (error) {
        console.error("Fetch error", error);
        setError(error.message || "An error occurred");
      }
    };
    fetchComment();
  }, [id]);

  //Esc button function
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isFullscreen]);

  // Update the checkIsLiked function
  useEffect(() => {
    const checkIsLiked = async () => {
        if (!currentUser) return;
        try {
            const response = await axios.get(
                `${API_URL}/fav/check/${id}`,
                { withCredentials: true }
            );
            // Set isLiked to false if there's no status
            setIsLiked(response.data.status || false);
        } catch (error) {
            console.error("Error checking like status:", error);
            setIsLiked(false);
        }
    };

    checkIsLiked();
  }, [currentUser, id]);


  const postComments = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please login to post comments");
      return;
    }

    if (!addComments.trim()) return;

    setCommentLoading(true);
    try {
      // Post the new comment
      await axios.post(
        `${API_URL}/comments/${id}`,
        { text: addComments },
        { withCredentials: true }
      );

      // Fetch updated comments
      const updatedCommentsResponse = await axios.get(
        `${API_URL}/comments/${id}`,
        { withCredentials: true }
      );

      // Update comments state with new data
      setComments(updatedCommentsResponse.data);

      // Clear the input field
      setAddComments("");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login to post comments");
      } else {
        toast.error(error.message || "Failed to post comment");
      }
      console.error("Failed to post comment:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  // Update the handleLike function
  const handleLike = async () => {
    if (!currentUser) {
      toast.error("Please login to like games");
      return;
    }

    try {
      if (!isLiked) {
        const response = await axios.post(
          `${API_URL}/fav/like/${id}`,
          {},
          { withCredentials: true }
        );
        if (response.data.liked) {
          setIsLiked(true);
          toast.success(response.data.message);
        }
      } else {
        const response = await axios.delete(
          `${API_URL}/fav/unlike/${id}`,  // Changed to match backend route
          { withCredentials: true }
        );
        setIsLiked(false);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error updating like status:", error);
      toast.error("Failed to update like status");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    const manualCopy = () => {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        toast("URL copied to clipboard!");
      } catch (err) {
        toast("Failed to copy URL.", err);
      }
      document.body.removeChild(textArea);
    };

    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: "Check this out!",
          url: url,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        if (err.name === "AbortError") {
          // User cancelled sharing - no action needed
          return;
        }
        console.error("Error sharing:", err);
        if (err.name === "NotAllowedError") {
          toast.error("Permission denied for sharing");
        } else if (err.name === "DataError") {
          toast.error("Invalid share data");
        } else {
          toast.error("Failed to share");
        }
      }
    } else {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(url)
          .then(() => toast("URL copied to clipboard!"))
          .catch(() => manualCopy());
      } else {
        manualCopy();
      }
    }
  };

  const deleteComment = async (commentId) => {
    if (!currentUser) {
      toast.error("Please login to delete comments");
      return;
    }

    setCommentToDelete(commentId);
    setIsConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/comments/${commentToDelete}`, {
        withCredentials: true,
      });

      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentToDelete)
      );

      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      setError(error.message || "Failed to delete comment");
      toast.error("Failed to delete comment");
    } finally {
      setIsConfirmationOpen(false);
      setCommentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmationOpen(false);
    setCommentToDelete(null);
  };

  const updateComment = async (commentId) => {
    if (!currentUser) {
      toast.error("Please login to edit comments");
      return;
    }

    if (!editText.trim()) return;

    try {
      await axios.put(
        `${API_URL}/comments/${commentId}`,
        { text: editText },
        { withCredentials: true }
      );

      // Fetch updated comments
      const updatedCommentsResponse = await axios.get(
        `${API_URL}/comments/${id}`,
        { withCredentials: true }
      );

      setComments(updatedCommentsResponse.data);
      setEditingCommentId(null);
      setEditText("");
      toast.success("Comment updated successfully");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login to edit comments");
      } else {
        toast.error(error.message || "Failed to update comment");
      }
      setError(error.message || "Failed to update comment");
    }
  };

  const GameSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div
        className={`${theme.cardBg} backdrop-blur-sm rounded-2xl p-8 animate-pulse ${theme.border} border-2`}
      >
        <div className="h-10 w-3/4 bg-[#06c1ff]/10 rounded mb-4"></div>
        <div className="flex items-center gap-4 mb-6">
          <div className="h-6 w-24 bg-[#06c1ff]/10 rounded-full"></div>
          <div className="h-6 w-16 bg-[#06c1ff]/10 rounded"></div>
        </div>
        <div className="h-96 w-full bg-[#06c1ff]/10 rounded-xl mb-8"></div>
        <div className="flex gap-4 mb-8">
          <div className="h-12 w-36 bg-[#06c1ff]/10 rounded-lg"></div>
          <div className="h-12 w-36 bg-[#06c1ff]/10 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-[#06c1ff]/10 rounded-lg"></div>
          <div className="h-32 bg-[#06c1ff]/10 rounded-lg"></div>
          <div className="h-32 bg-[#06c1ff]/10 rounded-lg"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`min-h-screen ${theme.background}`}>
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-[#06c1ff]/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-[#06c1ff] rounded-full animate-spin"></div>
          </div>
        </div>
        <GameSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${theme.background}`}>
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.background}`}>
      <Header />{" "}
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-16">
        {/* Breadcrumbs */}
        {!isFullscreen && (
          <div className="flex items-center gap-2 text-[#06c1ff]/70 mb-6 text-sm">
            <Link to="/home" className="hover:text-[#06c1ff] transition-colors">
              Games
            </Link>
            <ChevronRight size={16} />
            <Link
              to={`/games/filter/${game.category}`}
              className="hover:text-[#06c1ff] transition-colors"
            >
              {game.category}
            </Link>
            <ChevronRight size={16} />
            <span className="text-[#06c1ff] font-medium">{game.title}</span>
          </div>
        )}

        {/* Main content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
          <div
            className={`xl:col-span-2 ${
              isFullscreen ? "fixed inset-0 z-50 bg-black" : ""
            }`}
          >
            {/* Game title and details */}
            <div
              className={`rounded-2xl shadow-lg hover:shadow-[#06c1ff]/10 ${theme.cardBg} backdrop-blur-sm ${theme.border} border-2 hover:border-[#06c1ff]/30 transition-all duration-300 p-6 mb-6`}
            >
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="bg-[#06c1ff]/20 text-[#06c1ff] px-3 py-1 rounded-full text-sm font-medium">
                  {game.category}
                </span>
                {game.featured && (
                  <span className="bg-[#06c1ff]/20 text-[#06c1ff] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Award size={14} /> Featured
                  </span>
                )}
              </div>
              <h1 className={`text-3xl font-bold ${theme.primary}`}>
                {game.title}
              </h1>
            </div>

            {/* Game iframe container */}
            {game.url && (
              <div
                className={`relative w-full rounded-2xl overflow-hidden ${theme.border} border-2 hover:border-[#06c1ff]/30 shadow-2xl bg-black mb-6 transition-all duration-300`}
              >
                <button
                  onClick={toggleFullscreen}
                  className="absolute top-4 right-4 p-2 bg-black/70 rounded-lg hover:bg-black text-white transition-colors z-10"
                  title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize size={20} />
                  ) : (
                    <Maximize size={20} />
                  )}
                </button>
                <iframe
                  src={game.url}
                  title={game.title}
                  className="w-full"
                  style={gameFrameStyle}
                  allow="autoplay; fullscreen"
                />
              </div>
            )}

            {/* Game stats */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <div className="flex flex-wrap items-center gap-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#06c1ff]/20 rounded-lg">
                    <Users size={18} className="text-[#06c1ff]" />
                  </div>
                  <span className={theme.secondary}>
                    {game.count || 0} plays
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-[#06c1ff]/20 rounded-lg">
                    <Clock size={18} className="text-[#06c1ff]" />
                  </div>
                  <span className={theme.secondary}>
                    {game.avgPlayTime || "5 min"}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleLike}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                    isLiked
                      ? "bg-[#06c1ff]/20 text-[#06c1ff] border border-[#06c1ff]/30"
                      : `${theme.cardBg} ${theme.border} ${theme.secondary} border hover:bg-[#06c1ff]/10 hover:border-[#06c1ff]/30 hover:text-[#06c1ff]`
                  }`}
                >
                  <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                  <span>{isLiked ? "Liked" : "Like"}</span>
                </button>
                <button
                  onClick={handleShare}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${theme.cardBg} ${theme.border} ${theme.secondary} border hover:bg-[#06c1ff]/10 hover:border-[#06c1ff]/30 hover:text-[#06c1ff] transition-all duration-300`}
                >
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className={`border-b ${theme.border} mb-6`}>
              <div className="flex overflow-x-auto hide-scrollbar">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === "description"
                      ? "text-[#06c1ff] border-b-2 border-[#06c1ff]"
                      : `${theme.secondary} hover:text-[#06c1ff]`
                  }`}
                >
                  About This Game
                </button>
                <button
                  onClick={() => setActiveTab("comments")}
                  className={`px-6 py-3 font-medium flex items-center gap-2 transition-colors ${
                    activeTab === "comments"
                      ? "text-[#06c1ff] border-b-2 border-[#06c1ff]"
                      : `${theme.secondary} hover:text-[#06c1ff]`
                  }`}
                >
                  <span>Comments</span>
                  <span className="bg-[#06c1ff]/20 text-[#06c1ff] text-xs px-2 py-1 rounded-full">
                    {comments.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("instructions")}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === "instructions"
                      ? "text-[#06c1ff] border-b-2 border-[#06c1ff]"
                      : `${theme.secondary} hover:text-[#06c1ff]`
                  }`}
                >
                  How to Play
                </button>
              </div>
            </div>

            {/* Tab content */}
            <div
              className={`rounded-2xl shadow-lg ${theme.cardBg} backdrop-blur-sm ${theme.border} border-2 p-6`}
            >
              {activeTab === "description" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#06c1ff]/20 rounded-lg">
                      <Info size={20} className="text-[#06c1ff]" />
                    </div>
                    <h3 className={`text-xl font-semibold ${theme.primary}`}>
                      About This Game
                    </h3>
                  </div>
                  <div
                    className={`bg-[#06c1ff]/5 rounded-xl p-6 border border-[#06c1ff]/10`}
                  >
                    <p className={`leading-relaxed text-lg ${theme.secondary}`}>
                      {game.description}
                    </p>
                  </div>
                  {/* Tags section */}
                  <div
                    className={`rounded-xl p-6 ${theme.cardBg} ${theme.border} border`}
                  >
                    <h3
                      className={`text-lg font-semibold mb-4 ${theme.primary}`}
                    >
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {game.tags?.map((tag, index) => (
                        <Link
                          key={index}
                          to={`/games/filter/${tag}`}
                          className="px-3 py-1.5 rounded-lg bg-[#06c1ff]/10 text-[#06c1ff] text-sm font-medium hover:bg-[#06c1ff]/20 transition-colors border border-[#06c1ff]/20"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "comments" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#06c1ff]/20 rounded-lg">
                      <MessageCircle size={20} className="text-[#06c1ff]" />
                    </div>
                    <h3 className={`text-xl font-semibold ${theme.primary}`}>
                      Comments ({comments.length})
                    </h3>
                  </div>

                  <div className="mb-6">
                    <form onSubmit={postComments} className="flex gap-3">
                      <input
                        type="text"
                        value={addComments}
                        disabled={commentLoading}
                        onChange={(e) => setAddComments(e.target.value)}
                        placeholder="Add a comment..."
                        className={`flex-1 px-4 py-2.5 rounded-xl ${theme.cardBg} ${theme.border} border focus:border-[#06c1ff]/50 focus:outline-none ${theme.primary} placeholder:${theme.muted}`}
                      />
                      <button
                        type="submit"
                        disabled={!addComments.trim() || commentLoading}
                        className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                          !addComments.trim() || commentLoading
                            ? "bg-[#06c1ff]/20 text-[#06c1ff]/50 cursor-not-allowed"
                            : "bg-[#06c1ff] text-white hover:bg-[#06c1ff]/90 active:scale-95"
                        }`}
                      >
                        {commentLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          "Post"
                        )}
                      </button>
                    </form>
                  </div>
                  {comments.length === 0 ? (
                    <div
                      className={`text-center py-12 ${theme.secondary} bg-[#06c1ff]/5 rounded-xl border border-[#06c1ff]/10`}
                    >
                      <MessageCircle
                        size={40}
                        className="text-[#06c1ff]/30 mx-auto mb-3"
                      />
                      <p className="text-lg">
                        No comments yet. Be the first to comment!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div
                          key={comment._id}
                          className={`p-5 rounded-xl ${theme.cardBg} ${theme.border} border hover:border-[#06c1ff]/30 transition-all duration-300 hover:shadow-lg`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#06c1ff]/20 flex items-center justify-center ring-2 ring-[#06c1ff]/20">
                              {comment.user.profilePicture ? (
                                <img
                                  src={comment.user.profilePicture}
                                  alt={comment.user.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-[#06c1ff] font-semibold text-lg">
                                  {comment.user?.name?.[0] || "U"}
                                </span>
                              )}
                            </div>
                            <div className="flex-1">
                              {editingCommentId === comment._id ? (
                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    updateComment(comment._id);
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) =>
                                      setEditText(e.target.value)
                                    }
                                    className={`flex-1 px-4 py-2.5 rounded-xl ${theme.cardBg} ${theme.border} border focus:border-[#06c1ff]/50 focus:outline-none ${theme.primary}`}
                                  />
                                  <div className="flex gap-2 mt-2">
                                    <button
                                      type="submit"
                                      className="px-4 py-1.5 rounded-lg bg-[#06c1ff] text-white hover:bg-[#06c1ff]/90"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingCommentId(null);
                                        setEditText("");
                                      }}
                                      className="px-4 py-1.5 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </form>
                              ) : (
                                <>
                                  <div className="flex items-center gap-3 mb-2">
                                    <span
                                      className={`font-se
                                      mibold text-lg ${theme.primary}`}
                                    >
                                      {comment.user?.name}
                                    </span>
                                    <span
                                      className={`text-sm ${theme.muted} bg-[#06c1ff]/10 px-2 py-0.5 rounded-full`}
                                    >
                                      {new Date(
                                        comment.createdAt
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p
                                    className={`${theme.secondary} text-base leading-relaxed`}
                                  >
                                    {comment.text}
                                  </p>
                                  {comment.user._id === currentUser?.id && (
                                    <div className="flex items-center gap-4 mt-2">
                                      <button
                                        onClick={() => {
                                          setEditingCommentId(comment._id);
                                          setEditText(comment.text);
                                        }}
                                        className="text-[#06c1ff] text-sm hover:text-[#06c1ff]/70 hover:underline flex items-center gap-1"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="14"
                                          height="14"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                        Edit
                                      </button>
                                      <button
                                        onClick={() =>
                                          deleteComment(comment._id)
                                        }
                                        className="text-red-500 text-sm hover:text-red-400 hover:underline flex items-center gap-1"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="14"
                                          height="14"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <path d="M3 6h18" />
                                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        </svg>
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "instructions" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#06c1ff]/20 rounded-lg">
                      <Info size={20} className="text-[#06c1ff]" />
                    </div>
                    <h3 className={`text-xl font-semibold ${theme.primary}`}>
                      How to Play
                    </h3>
                  </div>
                  <div
                    className={`bg-[#06c1ff]/5 rounded-xl p-6 border border-[#06c1ff]/10`}
                  >
                    <p
                      className={`${theme.secondary} text-lg leading-relaxed whitespace-pre-wrap`}
                    >
                      {game.instructions ||
                        "No instructions available for this game."}
                    </p>
                  </div>
                  {game.controls && (
                    <div
                      className={`mt-6 rounded-xl p-6 ${theme.cardBg} ${theme.border} border`}
                    >
                      <h4
                        className={`text-lg font-semibold mb-4 ${theme.primary}`}
                      >
                        Controls
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(game.controls).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1.5 rounded-lg bg-[#06c1ff]/10 text-[#06c1ff] font-medium`}
                            >
                              {key}
                            </span>
                            <span className={theme.secondary}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="xl:col-span-1">
            {/* Developer section */}
            <div
              className={`rounded-xl p-6 shadow-xl hover:shadow-[#06c1ff]/20 ${theme.cardBg} backdrop-blur-md ${theme.border} border overflow-hidden relative group transition-all duration-300 mb-6`}
            >
              {/* Left border accent */}
              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[#06c1ff] to-[#06c1ff]/30 group-hover:h-full group-hover:w-1.5 transition-all duration-500"></div>

              {/* Top gradient line */}
              <div className="absolute left-0 top-0 h-0.5 w-0 bg-gradient-to-r from-[#06c1ff]/80 to-transparent group-hover:w-full transition-all duration-700 delay-100"></div>

              {/* Content wrapper */}
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#06c1ff] to-[#06c1ff]/30 flex items-center justify-center shadow-lg shadow-[#06c1ff]/10 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white w-5 h-5"
                    >
                      <path d="M12 12c0-3 2.5-5 5-5a5 5 0 0 1 5 5c0 3-2.5 5-5 5"></path>
                      <path d="M7 12c0-3-2.5-5-5-5a5 5 0 0 0-5 5c0 3 2.5 5 5 5"></path>
                      <path d="M12 3C9.5 3 7 5.5 7 9c0 3.5 2.5 6 5 6s5-2.5 5-6c0-3.5-2.5-6-5-6"></path>
                      <path d="M7 21v-3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3"></path>
                    </svg>
                  </div>
                  <h3
                    className={`text-xl font-bold ${theme.primary} transition-colors duration-300 group-hover:text-[#06c1ff]`}
                  >
                    About the Developer
                  </h3>
                </div>

                <div className="ml-1">
                  <p className={`${theme.secondary} mb-3 text-lg font-medium`}>
                    {game.developer || "Game Studio"}
                  </p>

                  <div
                    className={`flex items-center gap-2 ${theme.secondary} opacity-70 text-sm`}
                  >
                    <span className="inline-block px-3 py-1 rounded-full bg-[#06c1ff]/10 border border-[#06c1ff]/20">
                      Game Developer
                    </span>
                    {game.developerWebsite && (
                      <a
                        href={game.developerWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#06c1ff] hover:underline"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-3 h-3"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom gradient decoration */}
              <div className="absolute bottom-0 right-0 w-32 h-24 bg-gradient-to-tl from-[#06c1ff]/5 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Similar games section */}
            {relatedGames.length > 0 && (
              <div>
                <h3 className={`text-xl font-bold mb-6 ${theme.primary}`}>
                  Similar Games You Might Like
                </h3>
                <div className="grid gap-4">
                  {relatedGames.map((relatedGame) => (
                    <Link
                      to={`/games/${relatedGame._id}`}
                      key={relatedGame._id}
                    >
                      <div
                        className={`rounded-2xl overflow-hidden shadow-lg hover:shadow-[#06c1ff]/10 ${theme.cardBg} backdrop-blur-sm ${theme.border} border-2 hover:border-[#06c1ff]/30 transition-all duration-300 group`}
                      >
                        <div className="aspect-video bg-gradient-to-r from-[#06c1ff]/20 to-[#0b8fd8]/20 relative">
                          {relatedGame.imageUrl ? (
                            <img
                              src={relatedGame.imageUrl}
                              alt={relatedGame.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-4xl font-bold text-[#06c1ff]">
                                {relatedGame.title?.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
                            <span className="bg-[#06c1ff] text-[#0b2d72] px-4 py-2 rounded-lg font-medium">
                              Play Now
                            </span>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3
                            className={`font-semibold text-lg mb-2 ${theme.primary} group-hover:text-[#06c1ff] transition-colors`}
                          >
                            {relatedGame.title}
                          </h3>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#06c1ff]">
                              {relatedGame.category}
                            </span>
                            <div className="flex items-center gap-1">
                              <Star
                                size={14}
                                fill="currentColor"
                                className="text-[#06c1ff]"
                              />
                              <span className={theme.primary}>
                                {relatedGame.rating || 4}
                              </span>
                              <span className={theme.muted}>
                                ({relatedGame.ratingCount || 24})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        message="Are you sure you want to delete this comment?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        theme={theme}
      />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme.mode}
        toastStyle={{
          backgroundColor:
            theme.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#ffffff",
          color: theme.mode === "dark" ? "#ffffff" : "#000000",
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: "rgba(6, 193, 255, 0.2)",
          borderRadius: "12px",
          backdropFilter: "blur(8px)",
        }}
        progressStyle={{
          background: "#06c1ff",
        }}
        closeButton={({ closeToast }) => (
          <button
            onClick={closeToast}
            className="p-1 rounded-lg hover:bg-[#06c1ff]/10 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      />
    </div>
  );
};

export default Desc;
