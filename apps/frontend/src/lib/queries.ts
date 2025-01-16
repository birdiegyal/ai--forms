import { fillForm } from "@/lib/appwrite"
import { useMutation } from "@tanstack/react-query"

export function useFillForm() {
  return useMutation({
    mutationFn: ({ resume, url }: { resume: string; url: string }) =>
      fillForm(resume, url),
    // you may want to invalide this onsuccess if you have implemented the history.
  })
}
