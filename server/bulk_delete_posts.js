// Script para borrar TODOS los posts via la API de App Runner
// Soporta paginación y borra hasta 1000 posts

const API_URL = "https://xtpj4berbu.us-east-1.awsapprunner.com";

async function getAllPosts() {
    const allPosts = [];
    let page = 1;
    while (true) {
        const res = await fetch(`${API_URL}/api/posts/feed?limit=50&page=${page}`);
        const data = await res.json();
        const posts = data.posts || data; // handle both response formats
        if (!posts || posts.length === 0) break;
        allPosts.push(...posts);
        if (posts.length < 50) break;
        page++;
    }
    return allPosts;
}

async function deletePost(id) {
    const res = await fetch(`${API_URL}/api/posts/${id}`, { method: 'DELETE' });
    const text = await res.text();
    return { status: res.status, body: text };
}

async function main() {
    console.log("Obteniendo todos los posts...");
    const posts = await getAllPosts();
    
    if (posts.length === 0) {
        console.log("No hay posts para borrar.");
        return;
    }

    console.log(`Encontrados ${posts.length} posts. Borrando...`);
    
    let deleted = 0;
    let failed = 0;
    
    for (const post of posts) {
        const result = await deletePost(post.id);
        if (result.status === 200) {
            deleted++;
            console.log(`[OK] Borrado post ${post.id} (${deleted}/${posts.length})`);
        } else {
            failed++;
            console.error(`[ERROR] Post ${post.id}: ${result.status} ${result.body}`);
        }
    }

    console.log(`\nResumen: ${deleted} borrados, ${failed} fallidos de ${posts.length} total.`);
}

main().catch(console.error);
