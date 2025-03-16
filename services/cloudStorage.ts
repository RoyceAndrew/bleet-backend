import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

const uploadToCloud = async (buffer: Buffer, mimeType: string, fileName: string) => {
    const { data, error } = await supabase
      .storage
      .from('profilepicture')
      .upload(fileName, buffer, {
        contentType: mimeType,
      });
  
    if (error) throw error;
  
    const { data: { publicUrl } } = supabase
      .storage
      .from('profilepicture')
      .getPublicUrl(fileName);
  
    return publicUrl;
  };

  const deleteProfile = async (fileName: string) => {
    const { error } = await supabase
      .storage
      .from('profilepicture')
      .remove([fileName]);
  
    if (error) { console.log(error) };
  };

  const uploadBanner = async (buffer: Buffer, mimeType: string, fileName: string) => {
    const { data, error } = await supabase
      .storage
      .from('banner')
      .upload(fileName, buffer, {
        contentType: mimeType,
      });
  
    if (error) throw error;
  
    const { data: { publicUrl } } = supabase
      .storage
      .from('banner')
      .getPublicUrl(fileName);
  
    return publicUrl;
  };

const deleteBanner = async (fileName: string) => {
    const { error } = await supabase
      .storage
      .from('banner')
      .remove([fileName]);
  
    if (error) { console.log(error) };
  };

  export {uploadToCloud, deleteProfile, uploadBanner, deleteBanner};