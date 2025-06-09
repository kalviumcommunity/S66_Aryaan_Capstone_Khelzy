import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, UserCheck, LogIn, Mail, Loader } from "lucide-react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../config';

// Add axios default config
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';


const FaceAuth = () => {
    const videoRef = useRef(null);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkExistingToken();
        loadModels();
        return () => {
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const checkExistingToken = async () => {
        try {
            const response = await axios.get(`${API_URL}/faceAuth/verify-auth`);
            
            if (response.data.success) {
                navigate("/home");
            }
        } catch (error) {
            console.log("No valid session found", error);
        }
    };

    const loadModels = async () => {
        try {
            setIsLoading(true);
            await Promise.all([
                faceapi.nets.tinyFaceDetector.load('/models/tiny_face_detector_model-weights_manifest.json'),
                faceapi.nets.faceLandmark68Net.load('/models/face_landmark_68_model-weights_manifest.json'),
                faceapi.nets.faceRecognitionNet.load('/models/face_recognition_model-weights_manifest.json')
            ]);
            
            startCamera();
            setIsLoading(false);
        } catch (error) {
            console.error("Error loading models:", error);
            setVerificationStatus({
                success: false,
                message: "Error loading face recognition models. Please refresh the page."
            });
            setIsLoading(false);
        }
    };

    const startCamera = () => {
        navigator.mediaDevices.getUserMedia({ video: {} })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((err) => 
                console.error("Camera access error:", err),
                setVerificationStatus({
                    success:false,
                    message:"Camera access denied. Please allow camera permissions to use face authentication."
                })
        );
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const getFaceEmbedding = async () => {
        if (!videoRef.current || !videoRef.current.readyState || videoRef.current.readyState < 2) {
            console.error("Video not ready for face detection");
            return null; // Video not ready yet
        }
        const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();
        return detection ? Array.from(detection.descriptor) : null;
    };

    const register = async () => {
        if (!email){
            setVerificationStatus({
                success:false,
                message:"Please enter your email address"
            });
            return
        }
        setIsVerifying(true);

        try {
            const faceEmbedding = await getFaceEmbedding();
            if (!faceEmbedding) {
                setVerificationStatus({
                    success: false,
                    message: "No face detected in camera"
                });
                setIsVerifying(false);
                return;
            }

            const res = await axios.post(`${API_URL}/faceAuth/face/signup`, { 
                email, 
                faceEmbedding 
            });
            stopCamera();
            setVerificationStatus({
                success: true,
                message: res.data.message
            });
        } catch (error) {
            console.error("Registration error:", error);
            stopCamera();
            setVerificationStatus({
                success: false,
                message: error.response?.data?.message || "Registration failed"
            });
        } finally {
            setIsVerifying(false);
        }
    };

    const login = async () => {
        if (!email) return alert("Enter email!");
        if (!/\S+@\S+\.\S+/.test(email)) {
            setVerificationStatus({
            success: false,
            message: "Please enter a valid email address"
        });
        return;
        }
        setIsVerifying(true);
        setVerificationStatus(null);

        try {
            const faceEmbedding = await getFaceEmbedding();
            if (!faceEmbedding) {
                setVerificationStatus({ 
                    success: false, 
                    message: "No face detected in camera" 
                });
                setIsVerifying(false);
                return;
            }

            const loginResponse = await axios.post(`${API_URL}/faceAuth/face/login`, {
                email,
                faceEmbedding
            });

            const { verified, similarity, message, threshold } = loginResponse.data;

            setVerificationStatus({
                success: verified,
                similarity: similarity,
                message: `${message} ${verified ? 
                    `(Match: ${(similarity * 100).toFixed(2)}%)` : 
                    `(${(similarity * 100).toFixed(2)}% < required ${(threshold * 100)}%)`}`
            });

            if (verified) {
                stopCamera();
                // Wait for 1 second to ensure token is set
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Retry authentication check up to 3 times
                let attempts = 0;
                while (attempts < 3) {
                    try {
                        const authCheck = await axios.get(`${API_URL}/faceAuth/verify-auth`, {
                            withCredentials: true
                        });
                        
                        if (authCheck.data.success) {
                            navigate("/home");
                            return;
                        }
                    } catch (err) {
                        console.log(`Auth check attempt ${attempts + 1} failed`);
                    }
                    attempts++;
                    // Wait 500ms between attempts
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                throw new Error("Failed to verify authentication after login");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Face verification failed";
            setVerificationStatus({
                success: false,
                message: errorMessage
            });
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0b2d72] via-[#0f3b8f] to-[#0b2d72] flex items-center justify-center p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div 
                    className="absolute -top-40 -left-40 w-80 h-80 bg-[#06c1ff] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                    animate={{
                        scale: [1, 1.1, 0.9, 1],
                        x: [0, 30, -20, 0],
                        y: [0, -50, 20, 0],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div 
                    className="absolute top-0 -right-20 w-80 h-80 bg-[#ff3a7c] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                    animate={{
                        scale: [1, 1.1, 0.9, 1],
                        x: [0, 30, -20, 0],
                        y: [0, -50, 20, 0],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-5xl bg-white/10 backdrop-blur-sm rounded-2xl shadow-[0_0_40px_rgba(6,193,255,0.3)] border border-white/20 p-8"
            >
                <motion.h1 
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="text-4xl font-bold mb-8 text-center flex items-center justify-center gap-2 text-white"
                >
                    <Camera className="w-8 h-8 text-[#06c1ff]" />
                    Face Authentication
                </motion.h1>
                
                {isLoading ? (
                    <div className="text-center p-8">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <Loader className="w-12 h-12 mx-auto mb-4 text-[#06c1ff]" />
                        </motion.div>
                        <p className="text-white/80">Loading face recognition models...</p>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full md:w-1/2"
                        >
                            <video 
                                ref={videoRef} 
                                className="w-full rounded-lg shadow-lg border border-[#06c1ff]/30" 
                                autoPlay 
                                playsInline
                            ></video>
                        </motion.div>

                        <div className="w-full md:w-1/2 space-y-6">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#06c1ff]" />
                                <input 
                                    type="email" 
                                    placeholder="Enter Email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-[#06c1ff]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06c1ff] text-white placeholder-white/50"
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                <motion.button 
                                    whileHover={{ scale: 1.02, translateY: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={register} 
                                    className="w-full bg-[#06c1ff] text-[#0b2d72] py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-[#06c1ff]/40 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                                    disabled={isVerifying}
                                >
                                    <UserCheck className="w-5 h-5" />
                                    Sign Up with Face
                                </motion.button>
                                
                                <motion.button 
                                    whileHover={{ scale: 1.02, translateY: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={login} 
                                    className="w-full bg-[#06c1ff] text-[#0b2d72] py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-[#06c1ff]/40 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                                    disabled={isVerifying}
                                >
                                    {isVerifying ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="w-5 h-5" />
                                            Login with Face
                                        </>
                                    )}
                                </motion.button>

                                {verificationStatus && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-4 rounded-lg ${
                                            verificationStatus.success ? 'bg-[#06c1ff]/20' : 'bg-red-500/20'
                                        } border ${
                                            verificationStatus.success ? 'border-[#06c1ff]/30' : 'border-red-500/30'
                                        }`}
                                    >
                                        <p className="text-white">{verificationStatus.message}</p>
                                        {verificationStatus.similarity && (
                                            <p className="text-white/80 mt-1">
                                                Similarity Score: {(verificationStatus.similarity * 100).toFixed(2)}%
                                            </p>
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default FaceAuth;
