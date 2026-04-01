export class FetchAPIData {
    url: string = process.env.API_BASE_URL ?? "http://localhost:8080/api";
    public async request(queries: string, variables:{}) : Promise<any>{
        try{
            console.log(variables);
            const response = await fetch(this.url + queries, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": process.env.Token ?? "Test*1234", // Default token if not set in environment
                },
                body: JSON.stringify(variables)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        }catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    }

    public async requestWOParam(queries: string) : Promise<any>{
        try{
            const response = await fetch(this.url + queries,{
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": process.env.Token ?? "Test*1234", // Default token if not set in environment
            },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error("Error fetching data without parameters:", error);
            throw error;
        }
    }
}

// Standalone helper for multipart/form-data requests (e.g. file uploads)
export async function requestFormData(queries: string, formData: FormData): Promise<any> {
    const url = process.env.API_BASE_URL ?? "http://localhost:8080/api";
    try {
        const response = await fetch(url + queries, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Authorization": process.env.Token ?? "Test*1234",
                // NOTE: do NOT set Content-Type — browser sets it with boundary automatically
            },
            body: formData,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error uploading form data:", error);
        throw error;
    }
}
