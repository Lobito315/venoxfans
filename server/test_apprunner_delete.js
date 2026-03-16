async function testRemoteDelete() {
    const API_URL = "https://xtpj4berbu.us-east-1.awsapprunner.com";
    
    try {
        console.log("Fetching posts from App Runner API...");
        const resFeed = await fetch(`${API_URL}/api/posts/feed?limit=5`);
        const feedData = await resFeed.json();
        const posts = feedData.posts;
        
        if (!posts || posts.length === 0) {
            console.log("No posts found to delete.");
            return;
        }

        const postUnderTest = posts[0];
        console.log(`Attempting to delete post ${postUnderTest.id} via API...`);
        
        const deleteRes = await fetch(`${API_URL}/api/posts/${postUnderTest.id}`, { method: 'DELETE' });
        const text = await deleteRes.text();
        console.log("Delete Response:", deleteRes.status, text);
    } catch (err) {
        console.error("Error:", err.message);
    }
}

testRemoteDelete();
