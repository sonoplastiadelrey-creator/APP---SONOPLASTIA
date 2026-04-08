import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ktcrbptvmpschswqhril.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0Y3JicHR2bXBzY2hzd3FocmlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MjIyNjAsImV4cCI6MjA5MDE5ODI2MH0.LhNXZ8PHwYWDWkWcxhM4M91CJK-6O3JI1HHZGdv8xew';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Signing up...");
  const { data, error } = await supabase.auth.signUp({
    email: 'adm@sonoplastia.com',
    password: 'Sonoplastia2026!',
    options: {
      data: {
        nome: 'Administrador Principal',
        admin_code: 'ALPHA2026',
        funcao: 'MASTER'
      }
    }
  });

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Success User ID:', data.user?.id);
  }
}
run();
