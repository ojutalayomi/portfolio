import { Github, Loader2 } from "lucide-react"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios"
import { useState } from "react";

const Footer = () => {
    const [message, setMessage] = useState<{ content: string, status: 'success' | 'loading' | 'failed'}>()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try{
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());

        const result = await axios.post("/api/contact", data, {
            onUploadProgress: (progressEvent) => {
                const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
                if (progress !== 0) setMessage({content: '', status: 'loading'})
            }
        })
        if(result.status === 200) setMessage({ content: result.data.message, status: 'success'})
        // console.log(data);
      } catch (err){
        console.log(err)
        setMessage({content: 'err', status: 'failed'})
      }
    }

    return (
        <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">

                    {/* Main Footer Content */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"> */}
                    <div className="flex flex-col items-center justify-center md:flex-row gap-8 mb-8" id="contact">

                        {/* Contact Form */}
                        <div className="text-center md:text-left col-span-2 w-3/4">
                            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
                            {message?.status === 'success' && <h4 className="text-lg text-green-500 font-semibold mb-4">{message.content}</h4>}
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <Input
                                        name="name"
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full p-2 bg-gray-800 rounded border border-gray-700 focus:border-gray-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full p-2 bg-gray-800 rounded border border-gray-700 focus:border-gray-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <Input
                                        name="subject"
                                        type="text"
                                        placeholder="Subject"
                                        className="w-full p-2 bg-gray-800 rounded border border-gray-700 focus:border-gray-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <textarea
                                        name="message"
                                        placeholder="Your message"
                                        rows={3}
                                        className="w-full p-2 bg-gray-800 rounded border border-gray-700 focus:border-gray-500 focus:outline-none"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={message?.status === 'loading'}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors duration-200"
                                >
                                    {message?.status === 'loading' ? <Loader2 className="animate-spin"/> : 'Send Message'}
                                </Button>
                            </form>
                        </div>
                        
                    </div>
                    
                    {/* Social Links */}
                    <div className="flex justify-center space-x-6 mb-8">
                        <a href="https://www.facebook.com/ayomide.ojutalayo.12" className="hover:text-gray-300 transition-colors duration-200">
                            <span className="sr-only">Facebook</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a href="https://x.com/@ojutalayomi" className="hover:text-gray-300 transition-colors duration-200">
                            <span className="sr-only">X</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
                        </a>
                        <a href="https://www.instagram.com/aojutalayo" className="hover:text-gray-300 transition-colors duration-200">
                            <span className="sr-only">Instagram</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                            </svg>
                        </a>
                        <a href="https://github.com/ojutalayomi" className="hover:text-gray-300 transition-colors duration-200">
                            <span className="sr-only">Github</span>
                            <Github className="h-6 w-6"/>
                        </a>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-800 pt-8">
                        <p className="text-center text-gray-400 text-sm">
                        Designed and developed with ♥️ | All Rights Reserved
                        </p>
                    </div>
                </div>
            </footer>
    )
}

export default Footer