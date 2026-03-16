const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

console.log("--- AWS Environment Check ---");
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET_NAME;

console.log(`Region: [${region}]`);
console.log(`Bucket: [${bucket}]`);
console.log(`Access Key Length: ${accessKey?.length}`);
console.log(`Secret Key Length: ${secretKey?.length}`);

if (accessKey && accessKey !== accessKey.trim()) {
    console.log("WARNING: Access Key has leading/trailing whitespace!");
}
if (secretKey && secretKey !== secretKey.trim()) {
    console.log("WARNING: Secret Key has leading/trailing whitespace!");
}

// Regex check for invalid characters in secret key (should be base64-ish)
if (secretKey && !/^[A-Za-z0-9/+=]+$/.test(secretKey)) {
    console.log("WARNING: Secret Key contains unexpected characters!");
    // Log invalid chars
    const invalid = secretKey.split('').filter(c => !/[A-Za-z0-9/+=]/.test(c));
    console.log("Invalid characters found:", JSON.stringify(invalid));
}

console.log("--- End Check ---");
