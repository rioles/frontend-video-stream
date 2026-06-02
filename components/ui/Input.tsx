"use client";
import React, { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    isPassword?: boolean;
}

export const Input = ({ label, error, isPassword, ...props }: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const labelStyle: React.CSSProperties = { display: "block", fontSize: "12.5px", fontWeight: 600, color: "#374151", marginBottom: "6px" };
    const inputContainerStyle: React.CSSProperties = { position: "relative", width: "100%" };
    
    const inputStyle: React.CSSProperties = { 
        width: "100%", 
        border: `1.5px solid ${error ? "#ef4444" : "#e5e5e5"}`, 
        borderRadius: "8px", 
        padding: "11px 14px", 
        paddingRight: isPassword ? "40px" : "14px",
        background: "#f9f9f9",
        transition: "all 0.2s ease",
        fontSize: "14px"
    };

    const iconStyle: React.CSSProperties = {
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        background: "none",
        border: "none",
        fontSize: "16px",
        display: "flex",
        alignItems: "center",
        color: "#6b7280"
    };

    return (
        <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>{label}</label>
            <div style={inputContainerStyle}>
                <input 
                    {...props} 
                    type={isPassword ? (showPassword ? "text" : "password") : props.type}
                    style={inputStyle}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#7c5cfc";
                        e.currentTarget.style.outline = "none";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,92,252,0.1)";
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = error ? "#ef4444" : "#e5e5e5";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                />
                {isPassword && (
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        style={iconStyle}
                        tabIndex={-1}
                    >
                        {showPassword ? "👁️" : "🙈"}
                    </button>
                )}
            </div>
            {error && <p style={{ color: "#ef4444", fontSize: "11px", marginTop: "4px" }}>{error}</p>}
        </div>
    );
};
