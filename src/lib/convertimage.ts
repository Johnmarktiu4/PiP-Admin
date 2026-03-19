export class ConvertImage {

    static base64ToFile(base64: string, filename: string, mimeType: string): File {
        const byteString = atob(base64.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new File([ab], filename, { type: mimeType });
    }

    static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result as string;
            resolve(base64data);
        };
        reader.onerror = () => {
            reject(new Error("Failed to convert file to base64"));
        };
        reader.readAsDataURL(file);
    });
}

}