"use server";

import { revalidatePath } from "next/cache";

export async function revalidateHomePage() {
  revalidatePath("/", 'page');
}