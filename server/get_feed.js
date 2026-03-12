const https = require('https');
const fs = require('fs');

console.log("Fetching feed...");
https.get('https://wppiduxhvv.us-east-2.awsapprunner.com/api/posts/feed', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
     try {
       const posts = JSON.parse(data);
       console.log(`Fetched ${posts.length} posts.`);
       posts.forEach((p, i) => {
         if (p.mediaUrls && p.mediaUrls.length > 0) {
            const url = p.mediaUrls[0];
            console.log(`Post ${p.id} (by ${p.creator?.username}): format=${url.substring(0, 40)}... length=${url.length}`);
         }
       });
     } catch (e) {
       console.log("Error parsing JSON:", e.message);
       console.log("Raw response:", data.substring(0, 200));
     }
  });
}).on('error', console.error);
