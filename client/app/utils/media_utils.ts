export const isVideoUrl = (url: string | null | undefined): boolean => {
    if (!url) return false;
    
    // Clean the URL (remove potential Postgres array artifacts or quotes)
    const cleanUrl = url.replace(/^["'{[\s]+|["'}\]\s]+$/g, '');
    
    // 1. Explicit MIME type
    if (cleanUrl.startsWith('data:video/')) return true;
    
    // 2. Generic MIME type with video content sniffing or extension
    if (cleanUrl.startsWith('data:application/octet-stream')) {
        // Content sniffing for common video headers in Base64
        // ftyp (mp4): AAAA
        // webm: GkXf
        // avi: RIFF
        const base64Part = cleanUrl.split(',')[1] || '';
        if (base64Part.startsWith('AAAA') || base64Part.startsWith('GkXf') || base64Part.startsWith('RIFF')) {
            return true;
        }
    }
    
    // 3. Extension check
    if (cleanUrl.match(/\.(mp4|webm|ogg|mov|m4v|3gp|mkv|avi)(?:\?|$)/i)) return true;
    
    // 4. Content sniffing for ANY data URL that isn't explicitly an image
    if (cleanUrl.startsWith('data:')) {
        const base64Part = cleanUrl.split(',')[1] || '';
        if (base64Part.startsWith('AAAA') || base64Part.startsWith('GkXf')) return true;
    }

    return false;
};

export const getCleanMediaUrl = (url: string | null | undefined): string => {
    if (!url) return '';
    return url.replace(/^["'{[\s]+|["'}\]\s]+$/g, '');
};
