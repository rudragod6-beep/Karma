import { supabase, Profile, AccountType } from './supabase';

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function signUp(
  email: string,
  password: string,
  name: string,
  phone: string,
  accountType: AccountType
) {
  if (!email?.trim()) throw new AuthError('Email is required', 'INVALID_EMAIL');
  if (!password || password.length < 8) throw new AuthError('Password must be at least 8 characters', 'WEAK_PASSWORD');
  if (!name?.trim()) throw new AuthError('Name is required', 'INVALID_NAME');
  if (!phone?.trim()) throw new AuthError('Phone is required', 'INVALID_PHONE');

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new AuthError(error.message, error.status);

  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      account_type: accountType,
      is_email_verified: false,
      is_phone_verified: false,
    });
    if (profileError) throw new AuthError(profileError.message, 'PROFILE_CREATE_FAILED');

    if (accountType === 'PROVIDER') {
      const { error: providerError } = await supabase.from('service_providers').insert({
        user_id: data.user.id,
        profession: '',
        service_area: '',
        bio: '',
        experience: 0,
      });
      if (providerError) throw new AuthError(providerError.message, 'PROVIDER_CREATE_FAILED');
    }
  }
  return data.user;
}

export async function signIn(email: string, password: string) {
  if (!email?.trim()) throw new AuthError('Email is required', 'INVALID_EMAIL');
  if (!password) throw new AuthError('Password is required', 'INVALID_PASSWORD');

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password
  });
  if (error) throw new AuthError(error.message, error.status);
  return data.user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new AuthError(error.message, 'SIGNOUT_FAILED');
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw new AuthError(error.message, 'PROFILE_FETCH_FAILED');
  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  if (error) throw new AuthError(error.message, 'PROFILE_UPDATE_FAILED');
}

export async function uploadProfilePhoto(userId: string, file: File) {
  if (!file.type.startsWith('image/')) throw new AuthError('Only images allowed', 'INVALID_FILE_TYPE');
  if (file.size > 5 * 1024 * 1024) throw new AuthError('Image must be less than 5MB', 'FILE_TOO_LARGE');

  const ext = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('profiles')
    .upload(fileName, file, { upsert: true });
  if (uploadError) throw new AuthError(uploadError.message, 'UPLOAD_FAILED');

  const { data } = supabase.storage.from('profiles').getPublicUrl(fileName);
  await updateProfile(userId, { profile_photo: data.publicUrl });
  return data.publicUrl;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new AuthError(error.message, 'GET_USER_FAILED');
  return user;
}
