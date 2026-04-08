import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  console.log("Signing up user...");
  const { data, error } = await supabase.auth.signUp({
    email: 'adm@sonoplastia.com',
    password: 'Sonoplastia2026!',
    options: {
      data: {
        full_name: 'Administrador',
        admin_code: 'ALPHA2026',
      }
    }
  });

  if (error) {
    console.error('Sign up error:', error.message);
  } else {
    console.log('User signed up:', data.user?.id);
  }
}
run();
