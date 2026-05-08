'use server'
import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function createEvent(formData: FormData) {
  // Extract data from the form
  const title = formData.get('title') as string
  const location = formData.get('location') as string
  const date = formData.get('date') as string
  const category = formData.get('category') as string

  // Insert into Supabase
  const { data, error } = await supabase
    .from('events')
    .insert([
      { 
        title, 
        location, 
        date, 
        category,
        is_active: true 
      }
    ])

  if (error) {
    console.error("Supabase Insert Error:", error.message)
    throw new Error(error.message)
  }

  // This is CRITICAL: It tells Next.js to refresh the homepage 
  // so the new match shows up for fans immediately.
  revalidatePath('/')
  
  return { success: true }
}
