import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ContractFormData } from '@/services/pdfService';
import { fillAndUploadContractPdfs } from '@/api/upload-filled-pdfs';
import { toast } from 'react-hot-toast';
import { HeroSection } from '../../About/components/HeroSection';

// Form component that collects user information and fills out PDF forms
const PDFFormRegistration: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState<ContractFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNo: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
    });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.firstName || !formData.lastName || !formData.email) {
            toast.error('Please fill out all required fields');
            return;
        }

        try {
            setIsSubmitting(true);
            toast.loading('Processing your registration...');

            // Call the API function to fill PDFs with form data and upload to R2
            const pdfUrls = await fillAndUploadContractPdfs(formData);

            toast.dismiss();
            toast.success('Registration submitted successfully!');

            // Show the PDF URLs with links to view them
            toast((t) => (
                <div className="p-4">
                    <h3 className="font-bold mb-2">Your documents are ready:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <a href={pdfUrls.registrationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                Registration Form
                            </a>
                        </li>
                        <li>
                            <a href={pdfUrls.trainingAgreementUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                Training Agreement
                            </a>
                        </li>
                        <li>
                            <a href={pdfUrls.liabilityWaiverUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                Liability Waiver
                            </a>
                        </li>
                    </ul>
                </div>
            ), { duration: 10000 });

        } catch (error) {
            console.error('Error submitting registration:', error);
            toast.dismiss();
            toast.error('There was an error processing your registration. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // State selection options
    const states = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-black to-[#1a1a1a] text-white">
            <HeroSection />

            <div className="container mx-auto px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mx-auto"
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                        Auto-Fill PDF Registration Forms
                    </h1>

                    <div className="bg-black/70 rounded-xl p-8 border border-[#DB6E1E]/30">
                        <p className="mb-6 text-gray-300">
                            Fill out the form below to automatically populate your registration forms, training agreement, and liability waiver.
                            The completed documents will be available for download immediately.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Information */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold mb-6 text-[#DB6E1E]">Personal Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* First Name */}
                                    <div>
                                        <label className="block text-md text-gray-200 mb-2 font-medium">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="Your first name"
                                            className="text-black rounded-lg px-4 py-3 w-full bg-white focus:border-[#DB6E1E] focus:ring focus:ring-[#DB6E1E]/20 focus:outline-none transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-md text-gray-200 mb-2 font-medium">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Your last name"
                                            className="text-black rounded-lg px-4 py-3 w-full bg-white focus:border-[#DB6E1E] focus:ring focus:ring-[#DB6E1E]/20 focus:outline-none transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-md text-gray-200 mb-2 font-medium">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your.email@example.com"
                                            className="text-black rounded-lg px-4 py-3 w-full bg-white focus:border-[#DB6E1E] focus:ring focus:ring-[#DB6E1E]/20 focus:outline-none transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="block text-md text-gray-200 mb-2 font-medium">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phoneNo"
                                            value={formData.phoneNo}
                                            onChange={handleChange}
                                            placeholder="(123) 456-7890"
                                            className="text-black rounded-lg px-4 py-3 w-full bg-white focus:border-[#DB6E1E] focus:ring focus:ring-[#DB6E1E]/20 focus:outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold mb-6 text-[#DB6E1E]">Address</h2>

                                {/* Street Address */}
                                <div className="mb-6">
                                    <label className="block text-md text-gray-200 mb-2 font-medium">
                                        Street Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="streetAddress"
                                        value={formData.streetAddress}
                                        onChange={handleChange}
                                        placeholder="123 Main St"
                                        className="text-black rounded-lg px-4 py-3 w-full bg-white focus:border-[#DB6E1E] focus:ring focus:ring-[#DB6E1E]/20 focus:outline-none transition-all"
                                        required
                                    />
                                </div>

                                {/* City, State, Zip */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-md text-gray-200 mb-2 font-medium">
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="City"
                                            className="text-black rounded-lg px-4 py-3 w-full bg-white focus:border-[#DB6E1E] focus:ring focus:ring-[#DB6E1E]/20 focus:outline-none transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-md text-gray-200 mb-2 font-medium">
                                            State <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="text-black rounded-lg px-4 py-3 w-full bg-white focus:border-[#DB6E1E] focus:ring focus:ring-[#DB6E1E]/20 focus:outline-none transition-all"
                                            required
                                        >
                                            <option value="">Select State</option>
                                            {states.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-md text-gray-200 mb-2 font-medium">
                                            Zip Code <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            placeholder="12345"
                                            className="text-black rounded-lg px-4 py-3 w-full bg-white focus:border-[#DB6E1E] focus:ring focus:ring-[#DB6E1E]/20 focus:outline-none transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-10">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-3 bg-gradient-to-r from-[#DB6E1E] to-[#e08b4c] text-white 
                    hover:from-[#c25812] hover:to-[#d07c3d] rounded-lg font-medium 
                    transition-all duration-200 shadow-lg w-full
                    disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        'Auto-Fill PDFs & Submit'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PDFFormRegistration;
