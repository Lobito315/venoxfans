const https = require('https');
const fs = require('fs');
https.get('https://wppiduxhvv.us-east-2.awsapprunner.com/api/posts/feed', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
     fs.writeFileSync('feed.json', data);
     console.log('done');
  });
}).on('error', console.error);
