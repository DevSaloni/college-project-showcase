"use client";

import { Mail, Phone, MapPin, Send, User, MessageSquare } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useApi } from "@/context/ApiContext";


export default function ContactPage() {
const {BASE_URL} = useApi();

const[formData,setFormData] = useState({
  name:"",
  email:"",
  message:""
});

const handleChange = (e)=>{
  setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await axios.post(`${BASE_URL}/api/contact/save`, formData);
    alert("Your Message Saved Successfully");

    // reset form
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};


  return (
    <section className="relative py-24 bg-[#050A16] overflow-hidden">

      {/* Background Glow */}
      <div
        className="absolute inset-0 opacity-40 blur-[150px]"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, var(--pv-accent), transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <h2 className="text-4xl lg:text-5xl font-extrabold text-white text-center">
          Contact Us
        </h2>
        <p className="text-white/70 text-center mt-3 max-w-2xl mx-auto">
          We’d love to hear from you! Reach out for support, collaboration, or general inquiries.
        </p>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">

          {/* LEFT — CONTACT DETAILS */}
          <div className="bg-white/[0.03] border border-white/10 p-10 rounded-2xl backdrop-blur-xl shadow-lg">

            <h3 className="text-2xl font-semibold text-white mb-6">
              Get in Touch
            </h3>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start space-x-4">
                <Mail className="w-7 h-7 text-[var(--pv-accent)]" />
                <div>
                  <h4 className="text-lg font-semibold text-white">Email</h4>
                  <p className="text-white/70 text-sm">support@projectverse.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <Phone className="w-7 h-7 text-[var(--pv-accent)]" />
                <div>
                  <h4 className="text-lg font-semibold text-white">Phone</h4>
                  <p className="text-white/70 text-sm">+91 98765 43210</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-4">
                <MapPin className="w-7 h-7 text-[var(--pv-accent)]" />
                <div>
                  <h4 className="text-lg font-semibold text-white">Location</h4>
                  <p className="text-white/70 text-sm">Peth, Maharashtra, India</p>
                </div>
              </div>
            </div>

            {/* Bottom Highlight Box */}
            <div className="mt-10 p-6 bg-white/[0.05] border border-white/10 rounded-xl">
              <p className="text-white/70 text-sm leading-relaxed">
                Our team will respond within{" "}
                <span className="text-[var(--pv-accent)] font-semibold">
                  24 hours
                </span>{" "}
                on working days.  
              </p>
            </div>
          </div>

          {/* RIGHT — CONTACT FORM */}
          <form className="bg-white/[0.03] p-10 rounded-2xl border border-white/10 backdrop-blur-xl shadow-lg"
          onSubmit={handleSubmit}>

            <h3 className="text-2xl font-semibold text-white mb-6">
              Send a Message
            </h3>

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center bg-white/[0.05] border border-white/10 rounded-lg px-4">
                <User className="text-[var(--pv-accent)] mr-3" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="bg-transparent w-full py-3 text-white outline-none"
                />
              </div>

              <div className="flex items-center bg-white/[0.05] border border-white/10 rounded-lg px-4">
                <Mail className="text-[var(--pv-accent)] mr-3" />
                <input
                  type="email"
                   name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className="bg-transparent w-full py-3 text-white outline-none"
                />
              </div>
            </div>

            {/* Message */}
            <div className="flex items-start bg-white/[0.05] border border-white/10 rounded-lg px-4 mt-6">
              <MessageSquare className="text-[var(--pv-accent)] mt-3 mr-3" />
              <textarea
                rows="4"
                 name="message"
                  value={formData.message}
                  onChange={handleChange}
                placeholder="Your Message"
                className="bg-transparent w-full py-3 text-white outline-none"
              ></textarea>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="mt-8 w-full bg-[var(--pv-accent)] text-black font-semibold py-4 rounded-xl 
              transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Send Message</span>
            </button>

          </form>

        </div>
      </div>
    </section>
  );
}
