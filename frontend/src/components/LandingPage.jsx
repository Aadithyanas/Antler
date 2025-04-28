import { useContext, useEffect, useState } from "react"
import { datacontext } from "../context/AIContext"
import Header from "./Header"
import Robot from "./Robot"
import ChatArea from "./ChatArea"
import InputForm from "./InputForm"
import BackgroundCanvas from "./BackgroundCanvas"
import AnimationStyles from "./AnimationStyles"
import FileIcon from "./FileIcon"
import FileSummarizerModal from "./FileSummarizerModel"
import Sidebar from "./Sidebar"

function LandingPage() {
  // Get context safely with fallback default values
  const contextData = useContext(datacontext) || {};
  const { status = "Ready" } = contextData;

  const [showFileSummary, setshowFileSummary] = useState(false)
  const [showRobot, setShowRobot] = useState(false)
  const [particleCount, setParticleCount] = useState(0)
  const [selectedSessionId, setSelectedSessionId] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoadingSession, setIsLoadingSession] = useState(false)

  const userId = "guest"

  // Toggle robot visibility
  const toggleRobot = () => {
    setShowRobot(!showRobot)
  }

  const toogleFileSummary = () => {
    setshowFileSummary(!showFileSummary)
  }

  // Handle session selection
  const handleSessionSelect = async (sessionId) => {
    if (sessionId === selectedSessionId) return // Skip if same session

    setIsLoadingSession(true)
    setSelectedSessionId(sessionId)

    // Create visual effect when selecting a session
    const particleEffect = () => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => createSpecialParticle(), i * 100)
      }
    }

    particleEffect()
    setIsLoadingSession(false)
  }

  // Add createSpecialParticle function
  const createSpecialParticle = () => {
    const particle = document.createElement("div");
    particle.className = "ai-particle";
    const size = Math.random() * 10 + 8;
    const x = 100 + Math.random() * 150;
    const y = Math.random() * window.innerHeight;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.backgroundColor = `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.3})`;
    particle.style.boxShadow = "0 0 10px rgba(59, 130, 246, 0.7)";
    particle.style.position = 'fixed';
    document.body.appendChild(particle);
    setParticleCount((prev) => prev + 1);
    setTimeout(() => {
      document.body.removeChild(particle);
      setParticleCount((prev) => prev - 1);
    }, 2000);
  };

  // Handle sidebar collapse state
  const handleSidebarCollapse = (collapsed) => {
    setSidebarCollapsed(collapsed)
  }

  // Create floating particles
  

  // Add useEffect for responsive handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(true);
      }
    };
    // Initial check
    handleResize();
    // Add event listener
    window.addEventListener('resize', handleResize);
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen text-white relative overflow-hidden bg-gray-900">
      <AnimationStyles />
      <BackgroundCanvas />

      {/* Sidebar Component */}
      <Sidebar userId={userId} onSessionSelect={handleSessionSelect} onCollapse={handleSidebarCollapse} isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />

      {/* Main Content Area */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'sm:ml-20' : 'sm:ml-64'
        } ml-20`}
      >
        {/* Header Container */}
        <div className={`fixed top-0 right-0 left-0 z-10 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'sm:pl-20' : 'sm:pl-64'
        } pl-20`}>
          <div className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/30">
            <div className="max-w-6xl mx-auto px-4">
              <Header toggleRobot={toggleRobot} />
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="flex-1 flex flex-col items-center mt-20 px-4 pb-32">
          <div className={`w-full transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'max-w-4xl' : 'max-w-3xl'
          } mx-auto`}>
            {showRobot && (
              <div className="mb-4">
                <Robot />
              </div>
            )}

            {/* Loading indicator when switching sessions */}
            {isLoadingSession ? (
              <div className="flex-1 flex justify-center items-center py-8">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <div className="min-h-[calc(100vh-15rem)]">
                <ChatArea sessionId={selectedSessionId} />
              </div>
            )}
          </div>
        </div>

        {/* Fixed Input Form at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 backdrop-blur-md transition-all duration-300 ease-in-out z-20">
          <div className={`mx-auto px-4 py-4 transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? 'sm:ml-20' : 'sm:ml-64'
          } ml-20`}>
            <div className={`mx-auto ${
              sidebarCollapsed ? 'max-w-4xl' : 'max-w-3xl'
            }`}>
              <InputForm sessionId={selectedSessionId} />
            </div>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-28 right-4 z-30 flex flex-col gap-3">
          <div className="transition-all duration-300">
            <FileIcon toogleFileSummary={toogleFileSummary} />
          </div>
        </div>
      </div>

      {showFileSummary && <FileSummarizerModal onClose={toogleFileSummary} />}

      <style jsx>{`
        .loading-spinner {
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 3px solid #fff;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default LandingPage