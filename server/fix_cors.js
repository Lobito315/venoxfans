"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || "us-east-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});
const bucketName = process.env.AWS_S3_BUCKET_NAME || "venox-st";
function fixCors() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`Checking CORS for bucket: ${bucketName}`);
            try {
                const getCors = yield client.send(new client_s3_1.GetBucketCorsCommand({ Bucket: bucketName }));
                console.log("Current CORS:", JSON.stringify(getCors.CORSRules, null, 2));
            }
            catch (err) {
                console.log("No CORS configuration found or error:", err.message);
            }
            console.log("Applying new CORS configuration...");
            const putCorsCommand = new client_s3_1.PutBucketCorsCommand({
                Bucket: bucketName,
                CORSConfiguration: {
                    CORSRules: [
                        {
                            AllowedHeaders: ["*"],
                            AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
                            AllowedOrigins: ["*"],
                            ExposeHeaders: ["ETag"],
                            MaxAgeSeconds: 3000,
                        },
                    ],
                },
            });
            yield client.send(putCorsCommand);
            console.log("CORS updated successfully!");
        }
        catch (err) {
            console.error("Error setting CORS:", err);
        }
    });
}
fixCors();
