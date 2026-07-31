import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  Wand2,
  ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AmbientBackground from "../components/AmbientBackground";
import Particles from "../components/Particles";

const API_BASE = "http://localhost:5000/api/image";

const loadingMessages = [
  "Understanding your vision...",
  "Mixing creativity and intelligence...",
  "Painting pixels with AI...",
  "Adding final details...",
  "Almost ready...",
];

const suggestions = [
  "Cyberpunk city at night",
  "Fantasy mountain landscape",
  "Futuristic AI robot",
];

export default function ImagePage() {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingMessage, setLoadingMessage] = useState(
    loadingMessages[0]
  );

  useEffect(() => {
    if (!loading) return;

    let index = 0;

    const timer = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[index]);
    }, 1800);

    return () => clearInterval(timer);
  }, [loading]);

  async function handleGenerate(e) {
    e.preventDefault();

    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setImage(null);
    setLoadingMessage(loadingMessages[0]);

    try {
      const response = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Image generation failed");
      }

      setImage(data.image);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen relative px-6 py-10 max-w-5xl mx-auto">
      <AmbientBackground />
      <Particles count={20} />

      <button
        onClick={() => navigate("/")}
        className="
          flex items-center gap-2
          text-muted-steel
          hover:text-white
          transition
          mb-10
          text-sm
        "
      >
        <ArrowLeft size={16} />
        Back to Lab
      </button>


      <motion.section
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold">
            AI Image Studio
          </h1>

          <Sparkles
            size={28}
            className="text-violet-accent"
          />
        </div>

        <p className="text-muted-steel font-mono text-sm mb-8">
          Transform your imagination into visuals using Gemini AI
        </p>


        <form
          onSubmit={handleGenerate}
          className="
            flex
            gap-3
            bg-glass-surface
            backdrop-blur-xl
            border
            border-white/10
            rounded-2xl
            p-3
          "
        >
          <input
            value={prompt}
            onChange={(e) =>
              setPrompt(e.target.value)
            }
            placeholder="Describe your dream image..."
            className="
              flex-1
              bg-transparent
              px-4
              outline-none
              text-sm
            "
          />

          <button
            disabled={loading}
            className="
              px-5
              rounded-xl
              bg-violet-accent/20
              border
              border-violet-accent/40
              hover:bg-violet-accent/40
              transition
              disabled:opacity-50
            "
          >
            {loading ? (
              <Loader2
                size={20}
                className="animate-spin"
              />
            ) : (
              <Wand2 size={20} />
            )}
          </button>
        </form>


        <div className="flex flex-wrap gap-3 mt-5">
          {suggestions.map((item) => (
            <button
              key={item}
              onClick={() => setPrompt(item)}
              className="
                px-4
                py-2
                rounded-full
                text-xs
                border
                border-white/10
                bg-white/5
                hover:bg-white/10
                transition
              "
            >
              {item}
            </button>
          ))}
        </div>
      </motion.section>


      {error && (
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="
            mt-6
            text-red-400
            text-sm
          "
        >
          ✕ {error}
        </motion.p>
      )}


      <AnimatePresence mode="wait">

        {loading && (
          <motion.div
            key="loading"
            initial={{
              opacity: 0,
              scale: .95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
              mt-10
              h-[520px]
              rounded-3xl
              border
              border-white/10
              bg-glass-surface
              flex
              flex-col
              items-center
              justify-center
              relative
              overflow-hidden
            "
          >

            <motion.div
              animate={{
                rotate:360,
              }}
              transition={{
                duration:10,
                repeat:Infinity,
                ease:"linear",
              }}
              className="
                absolute
                w-56
                h-56
                rounded-full
                border
                border-violet-accent/30
              "
            />


            <Sparkles
              size={55}
              className="
                text-violet-accent
                animate-pulse
              "
            />

            <p className="mt-8 font-mono">
              {loadingMessage}
            </p>

            <p className="
              text-xs
              text-muted-steel
              mt-3
            ">
              Creating your AI masterpiece...
            </p>

          </motion.div>
        )}


        {!loading && !image && (
          <motion.div
            key="empty"
            initial={{
              opacity:0,
            }}
            animate={{
              opacity:1,
            }}
            className="
              mt-10
              h-[420px]
              rounded-3xl
              border
              border-white/10
              bg-glass-surface
              flex
              items-center
              justify-center
            "
          >

            <div className="text-center">

              <div className="
                mx-auto
                mb-6
                w-20
                h-20
                rounded-2xl
                flex
                items-center
                justify-center
                bg-violet-accent/20
              ">
                <ImageIcon
                  size={40}
                  className="text-violet-accent"
                />
              </div>


              <h2 className="text-xl font-semibold">
                Your AI artwork will appear here
              </h2>

              <p className="
                text-sm
                text-muted-steel
                mt-3
              ">
                Describe anything and let Gemini create it ✨
              </p>

            </div>

          </motion.div>
        )}


        {image && (
          <motion.div
            key="image"
            initial={{
              opacity:0,
              y:20,
            }}
            animate={{
              opacity:1,
              y:0,
            }}
            className="
              mt-10
              rounded-3xl
              overflow-hidden
              border
              border-white/10
            "
          >

            <img
              src={image}
              alt={prompt}
              className="
                w-full
                object-cover
              "
            />

          </motion.div>
        )}

      </AnimatePresence>

    </main>
  );
}