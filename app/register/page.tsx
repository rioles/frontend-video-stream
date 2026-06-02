"use client";
import { useState } from "react";
import { authService, RegisterPayload } from "../../services/auth/service";
import { Input } from "../../components/ui/Input";
import { RegisterSlideshow } from "../../components/auth/RegisterSlideshow";

const validatePassword = (pass: string) => {
    return {
        length: pass.length >= 8,
        hasUpper: /[A-Z]/.test(pass),
        hasNumber: /[0-9]/.test(pass),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    };
};

const HintItem = ({ label, valid }: { label: string; valid: boolean }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: valid ? "#10b981" : "#94a3b8" }}>
        <span>{valid ? "✅" : "○"}</span>
        <span>{label}</span>
    </div>
);

export default function RegisterPage() {
    const [formData, setFormData] = useState<RegisterPayload & { confirmPassword: string }>({
        firstName: "",
        lastName: "",
        age: 0,
        email: "",
        password: "",
        confirmPassword: ""
    });
    
    const [loading, setLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false); // NOUVEAU : État pour le succès

    const hints = validatePassword(formData.password || "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === "age" ? (value === "" ? 0 : parseInt(value)) : value 
        }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { confirmPassword, ...payload } = formData;
            await authService.register(payload);
            setIsRegistered(true); // Active l'affichage du message de succès
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", height: "100vh", width: "100%" }}>
            <RegisterSlideshow />
            
            <div style={{ width: "50%", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }} className="w-full lg:w-1/2">
                <div style={{ width: "100%", maxWidth: "400px" }}>
                    
                    {/* AFFICHAGE CONDITIONNEL */}
                    {!isRegistered ? (
                        <>
                            <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "24px" }}>Créer un compte</h1>
                            
                            <form onSubmit={handleRegister}>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    <Input label="Prénom" name="firstName" placeholder="Jean" required onChange={handleChange} />
                                    <Input label="Nom" name="lastName" placeholder="Sena" required onChange={handleChange} />
                                </div>
                                
                                <Input label="Âge" name="age" type="number" required onChange={handleChange} />
                                <Input label="Email" name="email" type="email" placeholder="jean@example.com" required onChange={handleChange} />
                                
                                <Input label="Mot de passe" name="password" isPassword required onChange={handleChange} />

                                <div style={{ marginBottom: "20px", padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                                    <p style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>Sécurité du mot de passe :</p>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                        <HintItem label="8+ caractères" valid={hints.length} />
                                        <HintItem label="Majuscule" valid={hints.hasUpper} />
                                        <HintItem label="Un chiffre" valid={hints.hasNumber} />
                                        <HintItem label="Caractère spécial" valid={hints.hasSpecial} />
                                    </div>
                                </div>

                                <Input 
                                    label="Confirmer le mot de passe" 
                                    name="confirmPassword" 
                                    isPassword 
                                    required 
                                    onChange={handleChange}
                                    error={formData.confirmPassword && formData.password !== formData.confirmPassword ? "Les mots de passe ne correspondent pas" : ""}
                                />

                                <button 
                                    type="submit" 
                                    disabled={loading || !Object.values(hints).every(Boolean) || formData.password !== formData.confirmPassword}
                                    style={{ 
                                        width: "100%", 
                                        background: (loading || !Object.values(hints).every(Boolean) || formData.password !== formData.confirmPassword) ? "#ccc" : "#0a0a0a", 
                                        color: "white", 
                                        padding: "14px", 
                                        borderRadius: "100px", 
                                        fontWeight: 600,
                                        cursor: loading ? "not-allowed" : "pointer", 
                                        marginTop: "10px",
                                        border: "none"
                                    }}
                                >
                                    {loading ? "Traitement..." : "S'inscrire"}
                                </button>
                            </form>
                        </>
                    ) : (
                        /* MESSAGE DE SUCCÈS */
                        <div style={{ textAlign: "center", padding: "20px" }}>
                            <div style={{ fontSize: "60px", marginBottom: "20px" }}>📧</div>
                            <h1 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "16px" }}>Vérifiez vos e-mails</h1>
                            <p style={{ color: "#64748b", lineHeight: "1.6", marginBottom: "24px" }}>
                                Un lien de confirmation a été envoyé à <strong>{formData.email}</strong>. 
                                Veuillez cliquer sur le lien pour activer votre compte.
                            </p>
                            <button 
                                onClick={() => window.location.href = "/login"}
                                style={{ 
                                    background: "#0a0a0a", 
                                    color: "white", 
                                    padding: "12px 24px", 
                                    borderRadius: "100px", 
                                    border: "none",
                                    cursor: "pointer"
                                }}
                            >
                                Retour à la connexion
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
