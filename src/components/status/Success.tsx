import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

interface CheckmarkProps {
  size?: number
  strokeWidth?: number
  color?: string
  className?: string
}

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        delay: i * 0.2,
        type: "spring",
        duration: 1.5,
        bounce: 0.2,
        ease: "easeInOut",
      },
      opacity: { delay: i * 0.2, duration: 0.2 },
    },
  }),
}

export function Checkmark({ size = 100, strokeWidth = 2, color = "currentColor", className = "" }: CheckmarkProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      initial="hidden"
      animate="visible"
      className={className}
    >
      <title>Animated Checkmark</title>
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        stroke={color}
        variants={draw}
        custom={0}
        style={{
          strokeWidth,
          strokeLinecap: "round",
          fill: "transparent",
        }}
      />
      <motion.path
        d="M30 50L45 65L70 35"
        stroke={color}
        variants={draw}
        custom={1}
        style={{
          strokeWidth,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          fill: "transparent",
        }}
      />
    </motion.svg>
  )
}

interface SuccessProps {
  message?: string
}

export default function Success({ message: propMessage }: SuccessProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const type = params.get("type")
  const derived =
    type === "teacher"
      ? "Teacher account created successfully"
      : type === "sales"
        ? "Sales account created successfully"
        : "Account created successfully"
  const displayMessage = propMessage || derived
  const [seconds, setSeconds] = useState(4)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval)
          navigate("/", { replace: true })
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [navigate])

  return (
    <Card className="w-full mx-auto p-6 min-h-screen flex flex-col justify-center">
      <CardContent className="space-y-6 flex flex-col items-center justify-center text-center">
        {/* Animated Icon */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
            scale: { type: "spring", damping: 15, stiffness: 200 },
          }}
        >
          {/* ...existing code... */}
          <div className="relative">
            {/* ...existing code... */}
            <Checkmark
              size={80}
              strokeWidth={4}
              color="rgb(16 185 129)"
              className="relative z-10 dark:drop-shadow-[0_0_10px_rgba(0,0,0,0.1)]"
            />
          </div>
        </motion.div>

        {/* Main Success Message */}
        <motion.h2
          className="text-lg font-medium"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          {displayMessage}
        </motion.h2>

        {/* Countdown */}
        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          You will be redirected to the sign in page in{" "}
          <span className="font-semibold text-emerald-600">{seconds}</span> second{seconds === 1 ? "" : "s"}.
        </motion.p>
      </CardContent>
    </Card>
  )
}
