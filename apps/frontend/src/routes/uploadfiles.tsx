import { createFileRoute } from "@tanstack/react-router"
import UploadFilesForm from "@/components/forms/uploadFilesForm"

export const Route = createFileRoute("/uploadfiles")({
  component: UploadFiles,
})

function UploadFiles() {

  return (
    <div className="relative flex flex-col gap-5">
      <h1 className="font-display text-4xl">Upload Files</h1>
      <svg
        width="100"
        height="100"
        viewBox="0 0 133 133"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute right-0 top-5 sm:hidden"
        style={{
          fill: "hsl(var(--foreground))",
        }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.6122 31.2241C9.32748 32.5088 9.96333 34.5549 11.7773 34.9733C12.1975 35.0704 16.4091 35.1529 21.1365 35.1567C38.5041 35.1708 47.4599 35.8974 55.1156 37.9135C71.3725 42.1944 80.5004 51.7559 82.5726 66.6745C82.9279 69.232 82.8736 75.8841 82.4723 78.9943C81.8388 83.9038 79.5901 94.3202 79.2843 93.7616C78.6631 92.627 77.7694 85.7199 77.7688 82.0515C77.7686 78.9171 77.5585 78.2629 76.3657 77.6803C75.4331 77.2248 74.4049 77.4784 73.6768 78.3439C72.5497 79.6832 73.187 88.3689 74.9019 95.0386C76.7819 102.35 77.4678 103.421 79.8584 102.778C82.3896 102.096 92.858 91.0502 95.0513 86.7465C95.9927 84.8997 94.3151 82.886 92.3681 83.5256C91.7385 83.7325 91.4335 84.0555 90.3478 85.6641C88.832 87.9101 86.7651 90.4644 85.3897 91.7915C84.8454 92.3168 84.449 92.6572 84.5092 92.5477C84.7573 92.0966 86.5982 82.6037 86.9701 79.8574C87.7257 74.2793 87.5588 67.6818 86.53 62.4724C84.0682 50.004 75.6332 40.5575 62.3934 35.4415C52.978 31.8032 41.9857 30.5936 18.2046 30.5789L11.2616 30.5747L10.6122 31.2241Z"
        />
      </svg>

      <p className="w-[80%] text-sm text-muted-foreground sm:w-full">
        We are gonna need some of your personal information to fill in the forms
        and applications.
      </p>
      <UploadFilesForm className="contents" />
    </div>
  )
}
