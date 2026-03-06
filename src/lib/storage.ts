import { createClient, SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "resumes";

let _supabase: SupabaseClient | null = null;

function getSupabase() {
  if (_supabase) return _supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Supabase 환경변수가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 확인해주세요."
    );
  }

  _supabase = createClient(supabaseUrl, supabaseServiceKey);
  return _supabase;
}

export async function uploadFile(
  file: Buffer,
  fileName: string,
  contentType: string,
  userId: string
): Promise<{ key: string; url: string }> {
  const supabase = getSupabase();
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
  const supabase = getSupabase();
  const { error } = await supabase.storage.from(BUCKET).remove([key]);
  if (error) throw new Error(`파일 삭제 실패: ${error.message}`);
}

export async function getFileUrl(key: string): Promise<string> {
  const supabase = getSupabase();
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(key);
  return publicUrl;
}
