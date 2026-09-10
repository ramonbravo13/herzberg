import { createClient } from '@supabase/supabase-js';

const url = 'https://mxbvipkjsgbtkzyfvhsb.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14YnZpcGtqc2didGt6eWZ2aHNiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTA1NzgyNiwiZXhwIjoyMTA0NjMzODI2fQ.xV7LaoJXMHVsKSa750ypkOzb5eU9tU4cSCaafv796Fc';

const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.from('profiles').select('*');
  console.log('Error profiles:', error);
  console.log('Data profiles:', data);
}

test();
