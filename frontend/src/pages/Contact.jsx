// frontend/src/pages/Contact.jsx
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    return (
        <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                    {/* Info Side */}
                    <div className="bg-indigo-600 p-10 text-white md:w-2/5 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                            <p className="text-indigo-100 mb-8">Fill up the form and our Team will get back to you within 24 hours.</p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <Phone className="text-indigo-200 mt-1" />
                                    <div>
                                        <p className="font-semibold">Phone</p>
                                        <p className="text-indigo-100">+1 (555) 123 4567</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Mail className="text-indigo-200 mt-1" />
                                    <div>
                                        <p className="font-semibold">Email</p>
                                        <p className="text-indigo-100">hello@cms-edu.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <MapPin className="text-indigo-200 mt-1" />
                                    <div>
                                        <p className="font-semibold">Address</p>
                                        <p className="text-indigo-100">102 Street 2714, <br />New York, USA</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex gap-4">
                            <div className="w-8 h-8 rounded bg-indigo-500/50"></div>
                            <div className="w-8 h-8 rounded bg-indigo-500/50"></div>
                            <div className="w-8 h-8 rounded bg-indigo-500/50"></div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="p-10 md:w-3/5">
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="form-group mb-0">
                                    <label className="form-label">First Name</label>
                                    <input type="text" className="form-input" placeholder="John" />
                                </div>
                                <div className="form-group mb-0">
                                    <label className="form-label">Last Name</label>
                                    <input type="text" className="form-input" placeholder="Doe" />
                                </div>
                            </div>

                            <div className="form-group mb-0">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-input" placeholder="john@example.com" />
                            </div>

                            <div className="form-group mb-0">
                                <label className="form-label">Message</label>
                                <textarea className="form-input min-h-[120px]" placeholder="How can we help you?"></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2">
                                Send Message <Send size={18} />
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
