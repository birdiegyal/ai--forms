import {
  deleteSession,
  fillForm,
  getMagicLink,
  updateMagicSession,
} from "@/lib/appwrite"
import { useMutation, useQuery } from "@tanstack/react-query"

export function useFillForm() {
  return useMutation({
    mutationFn: async ({ resume, url }: { resume: string; url: string }) =>
      await fillForm(resume, url),
    // you may want to invalide this onsuccess if you have implemented the history.
  })
}

export function useGetMagicLink() {
  return useMutation({
    mutationFn: async ({
      email,
      redirectTo,
    }: {
      email: string
      redirectTo: string
    }) => await getMagicLink(email, redirectTo),
    // you may want to invalidate the query to update magic session.
  })
}

export function useUpdateMagicSession(userId: string, secret: string) {
  return useQuery({
    queryFn: async () => await updateMagicSession(userId, secret),
    queryKey: ["updateMagicSession", secret],
    enabled: Boolean(userId && secret),
  })
}

export function useDeleteSession() {
  return useMutation({
    mutationFn: async (sessionId: string) => await deleteSession(sessionId),
    // you may want to invalidate the query to update magic session.
  })
}
