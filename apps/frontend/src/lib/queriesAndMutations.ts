import { fillForm, getMagicLink, updateMagicSession } from "@/lib/appwrite"
import { useMutation, useQuery } from "@tanstack/react-query"

export function useFillForm() {
  return useMutation({
    mutationFn: ({ resume, url }: { resume: string; url: string }) =>
      fillForm(resume, url),
    // you may want to invalide this onsuccess if you have implemented the history.
  })
}

export function useGetMagicLink() {
  return useMutation({
    mutationFn: ({
      email,
      redirectTo,
    }: {
      email: string
      redirectTo: string
    }) => getMagicLink(email, redirectTo),
    // you may want to invalidate the query to update magic session.
  })
}

export function useUpdateMagicSession(userId: string, secret: string) {
  return useQuery({
    queryFn: () => updateMagicSession(userId, secret),
    queryKey: ["updateMagicSession", secret],
    enabled: Boolean(userId && secret),
  })
}
