fetch('https://wppiduxhvv.us-east-2.awsapprunner.com/api/posts/feed')
  .then(res => res.json())
  .then(data => {
     data.forEach((p, i) => {
       if (p.mediaUrls && p.mediaUrls.length > 0) {
          console.log(`Post ${i} (by ${p.creator?.username}): ${p.mediaUrls[0].substring(0, 50)}...`);
       }
     });
  }).catch(console.error);
