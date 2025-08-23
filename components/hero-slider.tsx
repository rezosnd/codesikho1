"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause } from "lucide-react"

interface SlideData {
  type: "image" | "video"
  src: string
  title: string
  description: string
  link: string
}

const slides: SlideData[] = [
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1555229189-b73534307942?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Master Programming Fundamentals",
    description: "Learn the core concepts that power modern software development.",
    link: "#",
  },
  {
    type: "video",
    src: "https://videos.pexels.com/video-files/4354243/4354243-uhd_2560_1440_25fps.mp4",
    title: "Interactive Coding Challenges",
    description: "Practice with real-world coding problems and instant feedback.",
    link: "#",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1541188903310-8e078edbcaf6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Gamified Learning Experience",
    description: "Earn badges, level up, and compete with other developers.",
    link: "#",
  },
  {
    type: "video",
    src: "https://videos.pexels.com/video-files/5495781/5495781-uhd_2560_1080_30fps.mp4",
    title: "Build Real Projects",
    description: "Apply your skills to create portfolio-worthy applications.",
    link: "#",
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const duration = 6000

  const startProgress = () => {
    startTimeRef.current = Date.now()
    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current
      const newProgress = Math.min((elapsed / duration) * 100, 100)
      setProgress(newProgress)

      if (newProgress >= 100) {
        nextSlide()
      } else if (isPlaying) {
        requestAnimationFrame(updateProgress)
      }
    }
    requestAnimationFrame(updateProgress)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setProgress(0)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setProgress(0)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    if (isPlaying) {
      startProgress()
    }
  }, [currentSlide, isPlaying])

  return (
    <div className="wrapper-slider relative w-full h-screen overflow-hidden">
      <div className="main-slider relative w-full h-full">
        <div className="swiper-wrapper relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`swiper-slide absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div className="item relative w-full h-full">
                {slide.type === "image" ? (
                  <div className="relative w-full h-full">
                    <img
                      src={slide.src || "/placeholder.svg"}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="video relative w-full h-full">
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                      <source src={slide.src} type="video/mp4" />
                      Your browser does not support video playback.
                    </video>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent z-20" />

                {/* Content */}
                <div className="parent-text absolute inset-0 flex items-center z-30">
                  <div className="info-text max-w-2xl px-8 md:px-16 text-white">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{slide.title}</h2>
                    <p className="text-lg md:text-xl mb-8 text-gray-200 leading-relaxed">{slide.description}</p>
                    <a
                      href={slide.link}
                      className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                    >
                      Learn More
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="swiper-pagination absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex space-x-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative w-12 h-2 rounded-full overflow-hidden transition-all duration-300 ${
                index === currentSlide ? "bg-white/30" : "bg-white/20"
              }`}
            >
              {index === currentSlide && (
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="absolute top-8 right-8 z-40 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>
    </div>
  )
}
