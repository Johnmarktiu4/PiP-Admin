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