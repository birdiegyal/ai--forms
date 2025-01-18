import { Account, Client, ID } from "appwrite"
import { toast } from "@/hooks/use-toast"

const client = new Client()
  .setProject(import.meta.env.VITE_FORM_FILLER_PROJECT_ID)
  .setEndpoint(import.meta.env.VITE_FORM_FILLER_ENDPOINT)

const account = new Account(client)

export async function fillForm(resumePdf: string, url: string) {
  try {
    const promise = await fetch(
      `${import.meta.env.VITE_FILL_FORM_FUNCTION}?url=${url}`,
      {
        method: "POST",
        body: JSON.stringify({ resumePdf }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    if(promise.ok) {
      toast({
        title: "Autofilled",
        description:
          "Checkout the autofilled values in the preview before submitting.",
      })
    } else {
      // add try again action.
      toast({
        title: "Autofill failed"
      })
    }

    // type this better.
    const result = await promise.json()
    return result
  } catch (error) {
    console.error(error)
    return
  }
}

export async function getMagicLink(email: string, redirectTo: string) {
  try {
    const magicToken = await account.createMagicURLToken(
      ID.unique(),
      email,
      redirectTo,
    )
    return magicToken
  } catch (error) {
    console.error(error)
    return
  }
}

export async function updateMagicSession(userId: string, secret: string) {
  try {
    const session = await account.updateMagicURLSession(userId, secret)
    return session
  } catch (error) {
    console.error(error)
    return
  }
}

export async function getCurrentUser() {
  try {
    const currentUser = await account.get()
    return currentUser
  } catch (error) {
    console.error(error)
    return
  }
}
