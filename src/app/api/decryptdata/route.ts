import { NextRequest, NextResponse } from "next/server";
import CryptoJS from "crypto-js";

const SECRET_KEY = "kocakgeming";

export async function POST(req: NextRequest, res: NextResponse): Promise<NextResponse> {
    try {
        const { _payload, _verification:hmacRequest } = await req.json();
        const bytes = CryptoJS.AES.decrypt(_payload, SECRET_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        const hmac = CryptoJS.HmacSHA256(_payload, SECRET_KEY).toString();

        // Bandingkan hmac yang baru dengan yng dikirimkan
        if(hmac !== hmacRequest) {
            return new NextResponse(JSON.stringify({ message: "Encryption not valid", error: true }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });  
        }
        console.log("Data yang didekripsi:", decryptedData);

        return new NextResponse(JSON.stringify({ message: "Success", data: decryptedData }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: "Cannot send data to server", error: true }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
