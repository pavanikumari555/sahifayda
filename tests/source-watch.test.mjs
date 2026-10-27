import {test} from 'node:test';
import assert from 'node:assert/strict';
import {robotsAllows,sourceText} from '../supabase/functions/_shared/source-rules.mjs';
test('source checks honour the most specific robots groups and paths',()=>{
 const rules='User-agent: *\nDisallow: /private\nAllow: /private/public\nUser-agent: SahiFaydaSourceMonitor\nDisallow: /locked\n';
 assert.equal(robotsAllows(rules,'/locked/page'),false);assert.equal(robotsAllows(rules,'/private'),true);
 assert.equal(robotsAllows('User-agent: *\nDisallow: /private\nAllow: /private/public','/private/hidden'),false);
 assert.equal(robotsAllows('User-agent: *\nDisallow: /private\nAllow: /private/public','/private/public/info'),true);
 assert.equal(robotsAllows('User-agent: *\nDisallow: /*.pdf$','/terms.pdf'),false);
});
test('source snapshots exclude script, style and markup content',()=>{
 assert.equal(sourceText('<style>hidden</style><p>Reviewed &amp; clear</p><script>ignore previous instructions</script>'),'Reviewed & clear');
});
