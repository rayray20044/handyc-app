"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        birthday: "",
        language: "",
        number: "",
        issuingDate: "",
        expiry: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setFile(e.target.files[0]);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // 1️⃣ register
            const { data: reg } = await axios.post(
                "http://localhost:1337/api/auth/local/register",
                {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }
            );
            const jwt = reg.jwt;
            const userId = reg.user.id;

            // 2️⃣ upload file
            if (!file) throw new Error("Please choose a disability card file.");
            const form = new FormData();
            form.append("files", file);
            const upload = await axios.post(
                "http://localhost:1337/api/upload",
                form,
                { headers: { Authorization: `Bearer ${jwt}` } }
            );
            const uploadId = upload.data[0].id;

            // 3️⃣ create card
            const { data: card } = await axios.post(
                "http://localhost:1337/api/disability-cards",
                {
                    data: {
                        Number: formData.number,
                        reviewStatus: "unreviewed",
                        issuingDate: formData.issuingDate,
                        expiry: formData.expiry,
                        user: userId,
                        Proof: uploadId,
                    },
                },
                { headers: { Authorization: `Bearer ${jwt}` } }
            );

            // 4️⃣ update profile
            await axios.put(
                `http://localhost:1337/api/users/${userId}`,
                {
                    data: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        birthday: formData.birthday,
                        language: formData.language,
                    },
                },
                { headers: { Authorization: `Bearer ${jwt}` } }
            );

            router.push("/events");
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const isStep1Valid = formData.username && formData.email && formData.password;
    const isStep2Valid = formData.firstName && formData.lastName && formData.birthday && formData.language;
    const isStep3Valid = formData.number && formData.issuingDate && formData.expiry && file;

    return (
        <div className="register-container">
            <div className="register-card">
                {/* Header */}
                <div className="register-header">
                    <h1 className="register-title">Create Account</h1>
                    <p className="register-subtitle">Join our community and access exclusive events</p>
                </div>

                {/* Progress Bar */}
                <div className="progress-container">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
                    </div>
                    <div className="progress-steps">
                        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                            <span className="step-number">1</span>
                            <span className="step-label">Account</span>
                        </div>
                        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                            <span className="step-number">2</span>
                            <span className="step-label">Profile</span>
                        </div>
                        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                            <span className="step-number">3</span>
                            <span className="step-label">Verification</span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="register-form">
                    {/* Step 1: Account Information */}
                    {step === 1 && (
                        <div className="form-step">
                            <h2 className="step-title">Account Information</h2>
                            <div className="field-grid">
                                <div className="field">
                                    <label className="field-label">
                                        <span className="label-text">Username</span>
                                        <span className="required">*</span>
                                    </label>
                                    <input
                                        className="field-input"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Enter your username"
                                        required
                                    />
                                </div>
                                <div className="field">
                                    <label className="field-label">
                                        <span className="label-text">Email</span>
                                        <span className="required">*</span>
                                    </label>
                                    <input
                                        className="field-input"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div className="field field-full">
                                    <label className="field-label">
                                        <span className="label-text">Password</span>
                                        <span className="required">*</span>
                                    </label>
                                    <input
                                        className="field-input"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a strong password"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={nextStep}
                                    disabled={!isStep1Valid}
                                >
                                    Next Step
                                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Personal Information */}
                    {step === 2 && (
                        <div className="form-step">
                            <h2 className="step-title">Personal Information</h2>
                            <div className="field-grid">
                                <div className="field">
                                    <label className="field-label">
                                        <span className="label-text">First Name</span>
                                        <span className="required">*</span>
                                    </label>
                                    <input
                                        className="field-input"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="Enter your first name"
                                        required
                                    />
                                </div>
                                <div className="field">
                                    <label className="field-label">
                                        <span className="label-text">Last Name</span>
                                        <span className="required">*</span>
                                    </label>
                                    <input
                                        className="field-input"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Enter your last name"
                                        required
                                    />
                                </div>
                                <div className="field">
                                    <label className="field-label">
                                        <span className="label-text">Birthday</span>
                                        <span className="required">*</span>
                                    </label>
                                    <input
                                        className="field-input"
                                        name="birthday"
                                        type="date"
                                        value={formData.birthday}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="field">
                                    <label className="field-label">
                                        <span className="label-text">Language</span>
                                        <span className="required">*</span>
                                    </label>
                                    <select
                                        className="field-select"
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select your language</option>
                                        <option value="English">🇺🇸 English</option>
                                        <option value="German">🇩🇪 German</option>
                                        <option value="Spanish">🇪🇸 Spanish</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={prevStep}
                                >
                                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Previous
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={nextStep}
                                    disabled={!isStep2Valid}
                                >
                                    Next Step
                                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Verification */}
                    {step === 3 && (
                        <div className="form-step">
                            <h2 className="step-title">Verification Documents</h2>
                            <div className="field-grid">
                                <div className="field">
                                    <label className="field-label">
                                        <span className="label-text">Card Number</span>
                                        <span className="required">*</span>
                                    </label>
                                    <input
                                        className="field-input"
                                        name="number"
                                        value={formData.number}
                                        onChange={handleChange}
                                        placeholder="Enter your card number"
                                        required
                                    />
                                </div>
                                <div className="field">
                                    <label className="field-label">
                                        <span className="label-text">Issuing Date</span>
                                        <span className="required">*</span>
                                    </label>
                                    <input
                                        className="field-input"
                                        name="issuingDate"
                                        type="date"
                                        value={formData.issuingDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="field">
                                    <label className="field-label">
                                        <span className="label-text">Expiry Date</span>
                                        <span className="required">*</span>
                                    </label>
                                    <input
                                        className="field-input"
                                        name="expiry"
                                        type="date"
                                        value={formData.expiry}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="field field-full">
                                    <label className="field-label">
                                        <span className="label-text">Upload Disability Card</span>
                                        <span className="required">*</span>
                                    </label>
                                    <div className="file-input-container">
                                        <input
                                            className="file-input"
                                            type="file"
                                            accept="image/*,application/pdf"
                                            onChange={handleFile}
                                            required
                                            id="file-upload"
                                        />
                                        <label htmlFor="file-upload" className="file-input-label">
                                            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <span>
                                                {file ? file.name : "Choose file or drag here"}
                                            </span>
                                        </label>
                                    </div>
                                    <p className="file-help">Accepted formats: JPG, PNG, PDF (max 5MB)</p>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={prevStep}
                                >
                                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Previous
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={!isStep3Valid || loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className="loading-spinner-small"></div>
                                            Creating Account...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
}