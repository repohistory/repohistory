"use server";

import { revalidatePath } from "next/cache";

export async function revalidatePage(path: string) {
  revalidatePath(path, 'page');
}