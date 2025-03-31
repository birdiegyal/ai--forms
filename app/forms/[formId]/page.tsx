import FormPreview from "@/components/form-preview"
import { getFormFields } from "@/app/actions"
import { createServerClient } from "@supabase/ssr"
import { type formSchemaType } from "@/lib/types"
export const dynamicParams = true

export async function generateStaticParams() {
  // we need to take a loot at this later.
  // const cookieStore = await cookies()
  // const supabase = createClient(cookieStore)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get: (name) => null
      }
    }
  )
  const { data, error } = await supabase.from("publishForms").select("formId")
  // put better error handling
  if (error) throw error
  return data.map(({ formId }) => ({
    formId: String(formId),
  }))
}

export default async function Form({
  params,
}: {
  params: Promise<{ formId: string }>
}) {
  const { formId } = await params
  const formFields: formSchemaType = (await getFormFields(formId))
    ?.formFields as formSchemaType

  if (formFields) {
    // pass the formFields to a component that will render the form.
    return <FormPreview formFields={formFields} />
  }

  // return a response for the error occured. error here being that the formFields are not found. something like this form doesn't exist. matter of fact we can throw an error here that could be caught by the error boundary | a 404.tsx.
}
