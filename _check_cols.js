const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../deda-products/.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');
let KEY = null;
for (const line of lines) {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    KEY = line.split('=')[1];
    break;
  }
}

const supabase = createClient('https://dubtupobtddeocmtfndf.supabase.co', KEY);

(async () => {
  // Check non-DD- products individually
  const skus = ['WG9925550021', 'AZ1500080001', 'WG9719530001', 'WG9725540502', 'AZ9725360101', 'WG9725540501'];
  for (const sku of skus) {
    const { data } = await supabase.from('products').select('sku,slug,name_en,status').eq('sku', sku).single();
    console.log(sku + ': slug=' + JSON.stringify(data?.slug) + ' name_en=' + JSON.stringify(data?.name_en) + ' status=' + data?.status);
  }
  
  // Check DD-ENG-007 slug
  const { data: eng007 } = await supabase.from('products').select('sku,slug,name_en').eq('sku', 'DD-ENG-007').single();
  console.log('DD-ENG-007: slug=' + JSON.stringify(eng007?.slug));
  
  // Check total with slug not null
  const { data: all } = await supabase.from('products').select('slug').is('slug', 'not null').limit(250);
  console.log('\nProducts with non-null slug:', all?.length);
  
  const { data: allNull } = await supabase.from('products').select('slug').is('slug', 'null').limit(10);
  console.log('Products with null slug:', allNull?.length);
})();
