"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, FileText, Plus, X } from "lucide-react";
import axios from "axios";
import { useApi } from "@/context/ApiContext";

export default function UploadProjectSplit() {
  const [step, setStep] = useState(1);
  const { BASE_URL } = useApi();

  const [team, setTeam] = useState([]);
  const [memberInput, setMemberInput] = useState("");

  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");

  const [token, setToken] = useState(null);

  const [form, setForm] = useState({
    title: "",
    category: "",
    year: "",
    mentor: "",
    problem: "",
    description: "",
    tech: "",
    github: "",
    toolsUsed: "",
    projectType: "",
    department: "",
    projectDuration: "",
    projectOutcome: "",
    demoVideo: "",
    documentation: null,
    bannerImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
  // Add Team Member
const addTeamMember = () => {
  if (memberInput.trim() !== "") {
    setTeam([...team, memberInput.trim()]);
    setMemberInput("");
  }
};

const removeMember = (index) => {
  setTeam(team.filter((_, i) => i !== index));
};

// Add Feature
const addFeature = () => {
  if (featureInput.trim() !== "") {
    setFeatures([...features, featureInput.trim()]);
    setFeatureInput("");
  }
};

const removeFeature = (index) => {
  setFeatures(features.filter((_, i) => i !== index));
};


  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login again");
      return;
    }

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });

    team.forEach((m) => formData.append("teamMembers[]", m));
    features.forEach((f) => formData.append("featureList[]", f));

    try {
      await axios.post(`${BASE_URL}/api/projects/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Project Submitted Successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };


  return (
    <section className="py-24 bg-gradient-to-b from-[#050A16] to-[#0B1025] relative overflow-hidden">

      {/* Glow Background */}
      <div
        className="absolute inset-0 opacity-40 blur-[180px]"
        style={{
          background:
            "radial-gradient(circle at 60% 10%, var(--pv-accent), transparent 60%)",
        }}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">

        {/* Step Indicators */}
        <div className="flex justify-between mb-12">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-1/3 text-center py-3 rounded-xl text-lg font-semibold transition-all
                ${step === s ? "bg-[var(--pv-accent)] text-black" : "bg-white/10 text-white/60"
                }`}
            >
              Step {s}
            </div>
          ))}
        </div>

        {/* FORM CARD */}
        <div className="bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl backdrop-blur-xl">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-8">

              {/* Banner Image */}
              <div className="bg-white/5 p-6 rounded-xl border border-dashed border-white/30 text-center">
                <ImageIcon className="w-12 h-12 mx-auto text-[var(--pv-accent)]" />
                <input
                  type="file"
                  name="bannerImage"
                  onChange={handleChange}
                  accept="image/*"
                  id="bannerUpload"
                  className="hidden"
                />
                <label htmlFor="bannerUpload" className="block mt-3 text-white/70 cursor-pointer">
                  Upload Project Banner
                </label>
              </div>

              <input
                name="title"
                onChange={handleChange}
                placeholder="Project Title"
                className="w-full p-5 bg-white/15 rounded-xl border border-white/20 text-white"
              />

              {/* Two column inputs */}
              <div className="grid grid-cols-2 gap-6">
                <select
                  name="category"
                  onChange={handleChange}
                  className="p-5 bg-white/15 rounded-xl border border-white/20 text-white"
                >
                <option value="">Select Category</option>
                <option value="AI ML">AI / ML</option>
                <option value="Blockchain">Blockchain</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Apps">Mobile Apps</option>
                </select>

                <input 
                  name="year"
                  onChange={handleChange}
                  placeholder="Year"
                  className="p-5 bg-white/15 rounded-xl border border-white/20 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <input
                  name="projectType"
                  onChange={handleChange}
                  placeholder="Project Type"
                  className="p-5 bg-white/15 rounded-xl border border-white/20 text-white"
                />
                <input
                  name="department"
                  onChange={handleChange}
                  placeholder="Department"
                  className="p-5 bg-white/15 rounded-xl border border-white/20 text-white"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-4 bg-[var(--pv-accent)] rounded-xl text-black font-bold"
              >
                Continue →
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-8">

              {/* Team Member Section */}
              <div>
                <label className="text-white font-semibold">Team Members</label>
                <div className="flex gap-4 mt-2">
                  <input
                    value={memberInput}
                    onChange={(e) => setMemberInput(e.target.value)}
                    placeholder="Enter member name"
                    className="w-full p-5 bg-white/15 rounded-xl border border-white/20 text-white"
                  />
                  <button
                    type="button"
                    onClick={addTeamMember}
                    className="bg-[var(--pv-accent)] text-black px-4 rounded-xl"
                  >
                    <Plus />
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  {team.map((m, i) => (
                    <div
                      key={i}
                      className="flex justify-between bg-white/10 p-3 rounded-xl text-white"
                    >
                      {m}
                      <X className="cursor-pointer text-red-400" onClick={() => removeMember(i)} />
                    </div>
                  ))}
                </div>
              </div>

              <input
                name="projectDuration"
                onChange={handleChange}
                placeholder="Project Duration (Start–End)"
                className="w-full p-5 bg-white/15 rounded-xl border border-white/20 text-white"
              />

              {/* Features Section */}
              <div>
                <label className="text-white font-semibold">Project Features</label>

                <div className="flex gap-4 mt-2">
                  <input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Add a project feature"
                    className="w-full p-5 bg-white/15 rounded-xl border border-white/20 text-white"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-[var(--pv-accent)] text-black px-4 rounded-xl"
                  >
                    <Plus />
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  {features.map((f, i) => (
                    <div
                      key={i}
                      className="flex justify-between bg-white/10 p-3 rounded-xl text-white"
                    >
                      {f}
                      <X className="cursor-pointer text-red-400" onClick={() => removeFeature(i)} />
                    </div>
                  ))}
                </div>
              </div>

              <textarea
                name="problem"
                onChange={handleChange}
                rows="3"
                placeholder="Problem Statement"
                className="w-full p-5 bg-white/15 rounded-xl border border-white/20 text-white"
              />

              <textarea
                name="description"
                onChange={handleChange}
                rows="3"
                placeholder="Project Description"
                className="w-full p-5 bg-white/15 rounded-xl border border-white/20 text-white"
              />

              <input
                name="toolsUsed"
                onChange={handleChange}
                placeholder="Tools Used"
                className="w-full p-5 bg-white/15 rounded-xl border border-white/20 text-white"
              />

              <input
                name="tech"
                onChange={handleChange}
                placeholder="Tech Stack (React, Node, MongoDB...)"
                className="w-full p-5 bg-white/15 rounded-xl border border-white/20 text-white"
              />

              <input
                name="demoVideo"
                onChange={handleChange}
                placeholder="Demo Video Link"
                className="w-full p-5 bg-white/15 rounded-xl border border-white/20 text-white"
              />

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="py-3 px-6 bg-white/10 text-white rounded-xl"
                >
                  ← Back
                </button>

                <button
                  onClick={() => setStep(3)}
                  className="py-3 px-6 bg-[var(--pv-accent)] text-black rounded-xl font-bold"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-8">

              <textarea
                name="projectOutcome"
                onChange={handleChange}
                rows="3"
                placeholder="Project Outcome"
                className="w-full p-5 bg-white/15 rounded-xl border border-white/20 text-white"
              />

              {/* Documentation */}
              <div className="bg-white/5 p-6 rounded-xl border border-dashed border-white/20 text-center">
                <FileText className="w-12 h-12 mx-auto text-[var(--pv-accent)]" />
                <input
                  type="file"
                  name="documentation"
                  accept=".pdf,.doc,.docx"
                  id="docUpload"
                  onChange={handleChange}
                  className="hidden"
                />
                <label htmlFor="docUpload" className="block mt-3 text-white/70 cursor-pointer">
                  Upload Documentation
                </label>
              </div>

              <input
                name="github"
                onChange={handleChange}
                placeholder="GitHub Repository Link"
                className="w-full p-5 bg-white/15 rounded-xl border border-white/20 text-white"
              />

              <button
                onClick={handleSubmit}
                className="w-full py-5 bg-[var(--pv-accent)] text-black font-bold rounded-xl text-xl"
              >
                SUBMIT PROJECT 🚀
              </button>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 mt-3 bg-white/10 text-white rounded-xl"
              >
                ← Back
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
