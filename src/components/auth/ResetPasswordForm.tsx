"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { FetchAPIData } from "@/lib/api";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";

export default function ResetPasswordForm() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Implement reset password logic here
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const username = localStorage.getItem("forgotEmail");
        const password = formData.get("new-password") as string;
        try {
        const req = new FetchAPIData();
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        const response = await req.request("/forgotPassword/resets", { username, password });
        if (response.status === "success") {
            alert(response.message);
            localStorage.removeItem("forgotEmail");
            window.location.href = "/signin"; // Redirect to sign-in page after successful reset
        } else {
            alert(response.message);
        }
        } catch (error) {
        console.error("Reset password failed:", error);
        alert("Failed to reset password. Please try again.");
        }
    };
    
    return ( 
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-6 text-center">Reset Password</h2>
    <form onSubmit={handleSubmit} className="space-y-5">   
        <div>
        <Label htmlFor="new-password">New Password</Label>
        <div className="relative mt-1">
            <Input
            id="new-password"
            name="new-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
            >
            {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
            </button>
        </div>
        </div>

        <div>
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <div className="relative mt-1">
            <Input
            id="confirm-password"
            name="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
            {showConfirmPassword ? <EyeIcon /> : <EyeCloseIcon />}
            </button>
        </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4">
        <Link href="/signin" className="text-sm text-blue-500 hover:underline">
            Remember your password? Log in
        </Link>
        <Button className="w-full sm:w-auto">
            Reset Password
        </Button>
        </div>
    </form>
    </div>
    );
}