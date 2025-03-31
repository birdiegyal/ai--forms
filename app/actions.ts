"use server"
import { formSchemaType } from "@/lib/types"
import { createClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// inserts a row repr a form to be published into the "publishFroms" relation.
export async function publishForm(formFields: formSchemaType) {
  try {
    const supabase = await createClient()
    const { error, data } = await supabase
      .from("publishForms")
      .insert({
        formFields,
        publishedBy: (await supabase.auth.getUser()).data.user?.id,
      })
      .select("formId, createdAt")
      .single()

    if (error) throw error

    // cache invalidated.
    revalidatePath("/forms")
    return data
  } catch (e) {
    console.error(e)
  }
}

export async function getFormFields(formId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("publishForms")
      .select("formFields")
      .eq("formId", Number(formId))
      .single()
    if (error) throw error
    return data
  } catch (e) {
    console.error(e)
  }
}

export async function createAnonUser() {
  try {
    const { auth } = await createClient()
    const { data } = await auth.getSession()
    if (!data.session) {
      const { data, error } = await auth.signInAnonymously()
      if (error) throw error
      return data
    }
  } catch (e) {
    console.error(e)
  }
}
