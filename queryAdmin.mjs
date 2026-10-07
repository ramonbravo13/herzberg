import { createClient } from '@supabase/supabase-js';

const url = 'https://mxbvipkjsgbtkzyfvhsb.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14YnZpcGtqc2didGt6eWZ2aHNiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTA1NzgyNiwiZXhwIjoyMTA0NjMzODI2fQ.xV7LaoJXMHVsKSa750ypkOzb5eU9tU4cSCaafv796Fc';

const supabase = createClient(url, serviceRoleKey);

async function run() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', 'admin@herzberg.com')
    .single();

  console.log('User:', data);
  if (error) console.error('Error:', error);
}

run();
