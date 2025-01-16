import { Account, Client, ID } from "appwrite"

const client = new Client()
  .setProject(import.meta.env.VITE_FORM_FILLER_PROJECT_ID)
  .setEndpoint(import.meta.env.VITE_FORM_FILLER_ENDPOINT)

const account = new Account(client)

export async function fillForm(resumePdf: string, url: string) {
  try {
    const result = await fetch(
      `${import.meta.env.VITE_FILL_FORM_FUNCTION}?url=${url}`,
      {
        method: "POST",
        body: JSON.stringify({ resumePdf }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
    console.log(result)
    return result
  } catch (error) {
    console.log(error)
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
    console.log(magicToken)
    return magicToken
  } catch (error) {
    console.log(error)
    return
  }
}

export async function updateMagicSession(userId: string, secret: string) {
  try {
    const session = await account.updateMagicURLSession(userId, secret)
    console.log(session)
    return session
  } catch (error) {
    console.log(error)
    return
  }
}
