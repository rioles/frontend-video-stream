export interface RegisterPayload {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    password?: string;
}

export const authService = {
    register: async (data: RegisterPayload) => {
        // CORRECTION DE L'URL : Vérifie bien que le chemin matche /users/register
        const url = `${process.env.NEXT_PUBLIC_API_URL}/users/register`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        // Sécurité pour éviter l'erreur "Unexpected token <"
        const contentType = response.headers.get("content-type");
        const isJson = contentType && contentType.includes("application/json");

        if (!response.ok) {
            if (isJson) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de l'inscription");
            } else {
                // Si on reçoit du HTML, c'est probablement une 404 ou 500
                const errorText = await response.text();
                console.error("Réponse non-JSON reçue :", errorText);
                throw new Error(`Erreur serveur (${response.status}). Vérifiez l'URL du backend.`);
            }
        }

        // Si tout va bien, on s'assure aussi que c'est du JSON avant de parser
        return isJson ? await response.json() : { success: true };
    }
};
