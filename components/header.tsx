"use client"

import { Button } from "@/components/ui/button"
import { Cog, Plus, Archive } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Header() {
  const currentPath = usePathname()

  return (
    <nav className="bg-background fixed inset-x-0 top-0 z-20 flex justify-between p-4">
      <div className="relative flex items-center justify-center gap-2">
        <svg
          width="36"
          height="36"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_114_79)">
            <rect
              width="48"
              height="48"
              rx="4"
              fill="url(#paint0_linear_114_79)"
            />
            <path
              d="M13.557 42.2634H9L13.1345 13.1969L28.8165 9.24291L39 11.8908V16.283L28.8165 13.5995L16.9747 16.79L13.557 42.2634Z"
              fill="url(#paint1_linear_114_79)"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.557 56L18.7706 19.0023L28.8165 16.0147L34.5963 17.4907L39 18.6439V23.186V56H34.443V33.5082L28.8165 35.2023L21.3676 33.5082L18.114 56H13.557ZM22 23.186L26.7 25.2953C26.4 26.66 25.7259 27.2838 24.1 27.0499C22.4741 26.8159 21.5892 24.5389 22 23.186ZM33.7301 23.186L30.2871 25.2953C30.0871 26.9524 32.1526 27.2643 32.9871 26.5625C33.8215 25.8607 34.0778 24.214 33.7301 23.186Z"
              fill="url(#paint2_linear_114_79)"
            />
            <path
              d="M28.8165 9.24291L30.2871 9.62528L29.0917 0L27.3 9.62528L28.8165 9.24291Z"
              fill="url(#paint3_linear_114_79)"
            />
            <path
              d="M30.2871 25.2953L33.7301 23.186C34.0778 24.214 33.8215 25.8607 32.9871 26.5625C32.1526 27.2643 30.0871 26.9524 30.2871 25.2953Z"
              fill="white"
            />
            <path
              d="M22 23.186L26.7 25.2953C26.4 26.66 25.7259 27.2838 24.1 27.0499C22.4741 26.8159 21.5892 24.5389 22 23.186Z"
              fill="white"
            />
          </g>
          <defs>
            <linearGradient
              id="paint0_linear_114_79"
              x1="19.6989"
              y1="-2.83304e-08"
              x2="28.3011"
              y2="48"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.0789999" stopColor="#FE9E1B" />
              <stop offset="0.524" stopColor="#D67228" />
              <stop offset="1" stopColor="#AA4800" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_114_79"
              x1="30.3303"
              y1="3.43751"
              x2="23.4314"
              y2="56.0498"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.114" stopColor="#090A08" />
              <stop offset="0.935" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_114_79"
              x1="30.3303"
              y1="3.43751"
              x2="23.4314"
              y2="56.0498"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.114" stopColor="#090A08" />
              <stop offset="0.935" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_114_79"
              x1="30.3303"
              y1="3.43751"
              x2="23.4314"
              y2="56.0498"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.114" stopColor="#090A08" />
              <stop offset="0.935" />
            </linearGradient>
            <clipPath id="clip0_114_79">
              <rect width="48" height="48" rx="4" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <b>AI Forms</b>
        <span className="rounded-3xl border-2 border-orange-500 bg-orange-500/50 px-2 text-xs italic">
          beta
        </span>
      </div>

      <div className="space-x-2">
        {currentPath !== "/" && (
          <Button
            variant={"ghost"}
            className="cursor-pointer rounded-full border-2"
            size={"icon"}
          >
            <Plus className="size-6 p-1" />
          </Button>
        )}
        <Button
          variant={"ghost"}
          className="cursor-pointer rounded-full border-2"
          size={"icon"}
        >
          <Archive className="size-6 p-1" />
        </Button>
        <Button
          variant={"ghost"}
          className="cursor-pointer rounded-full border-2"
          size={"icon"}
        >
          <Cog className="size-6 p-1" />
        </Button>
      </div>
    </nav>
  )
}
