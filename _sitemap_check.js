const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../deda-products/.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
let KEY = '';
for (const line of envContent.split('\n')) {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    KEY = line.split('=')[1];
    break;
  }
}

const supabase = createClient('https://dubtupobtddeocmtfndf.supabase.co', KEY);

(async () => {
  const { data } = await supabase
    .from('products')
    .select('sku,slug,name_en,status')
    .limit(250);

  // Count pinyin slugs
  const pinyinSlugRe = /^[a-z][a-z0-9-]+$/;
  const pinyinSlugs = data.filter(p =>
    p.sku.startsWith('DD-') &&
    p.slug &&
    pinyinSlugRe.test(p.slug) &&
    p.slug.length > 5
  );
  console.log('DD- 拼音 slug 数:', pinyinSlugs.length);
  console.log('示例:');
  pinyinSlugs.slice(0, 5).forEach(p => console.log(' ', p.sku, '|', p.slug));

  // Check WG9725540501
  const wg = data.find(p => p.sku === 'WG9725540501');
  console.log('\nWG9725540501:', JSON.stringify(wg));

  // Check non-DD- products that would be in sitemap
  const nonDD = data.filter(p => !p.sku.startsWith('DD-') && p.status !== 'draft');
  console.log('\n非 DD- 且非 draft（会进 sitemap）:', nonDD.length);
  nonDD.forEach(p => console.log(' ', p.sku, '|', p.slug, '|', p.status));

  // Check DD-ENG-007 slug
  const eng007 = data.find(p => p.sku === 'DD-ENG-007');
  console.log('\nDD-ENG-007:', JSON.stringify(eng007));
})();
