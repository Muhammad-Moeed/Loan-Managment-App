import supabase from '../services/supabaseClient';

export const uploadFile = async (file, path) => {
  const { data, error } = await supabase.storage
    .from('documents') 
    .upload(path, file);

  if (error) throw error;

  const { data: publicUrlData } = supabase
    .storage
    .from('documents')
    .getPublicUrl(path);

  return publicUrlData.publicUrl;
};
