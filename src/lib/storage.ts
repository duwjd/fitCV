import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET = "resumes";

export async function uploadFile(
  file: Buffer,
  fileName: string,
  contentType: string,
  userId: string
): Promise<{ key: string; url: string }> {
  const key = `${userId}/${Date.now()}-${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(key, file, { contentType, upsert: false });

  if (error) throw new Error(`파일 업로드 실패: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(key);

  return { key, url: publicUrl };
}

export async function deleteFile(key: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([key]);
  if (error) throw new Error(`파일 삭제 실패: ${error.message}`);
}

export async function getFileUrl(key: string): Promise<string> {
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(key);
  return publicUrl;
}
