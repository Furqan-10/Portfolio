// EmailSection.jsx

"use client";
import React, { useState } from "react";
import GithubIcon from "../../../public/github-icon.svg";
import LinkedinIcon from "../../../public/linkedin-icon.svg";
import Link from "next/link";
import Image from "next/image";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/solid";

const EmailSection = () => {
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email: e.target.email.value,
      subject: e.target.subject.value,
      message: e.target.message.value,
    };
    const JSONdata = JSON.stringify(data);
    const endpoint = "/api/send";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };

    const response = await fetch(endpoint, options);
    if (response.status === 200) {
      console.log("Message sent.");
      setEmailSubmitted(true);
    }
  };

  return (
    <section
      id="contact"
      className="grid md:grid-cols-2 my-12 md:my-12 py-24 gap-8 relative px-4"
    >
      <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900 to-transparent rounded-full h-80 w-80 z-0 blur-lg absolute top-3/4 -left-4 transform -translate-x-1/2 -translate-1/2"></div>
      <div className="z-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Let's Connect
        </h2>
        <p className="text-slate-600 dark:text-[#ADB7BE] mb-6 max-w-md">
          I'm currently looking for new opportunities, and my inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </p>
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 text-slate-800 dark:text-white">
            <PhoneIcon className="h-6 w-6 text-primary-500" />
            <a href="tel:+923244372754" className="hover:text-primary-600 dark:hover:text-primary-400">+92 324 4372754</a>
          </div>
          <div className="flex items-center gap-3 text-slate-800 dark:text-white">
            <EnvelopeIcon className="h-6 w-6 text-primary-500" />
            <a href="mailto:furqan4243@gmail.com" className="hover:text-primary-600 dark:hover:text-primary-400">Furqan4243@gmail.com</a>
          </div>
          <div className="flex items-center gap-3 text-slate-800 dark:text-white">
            <MapPinIcon className="h-6 w-6 text-primary-500" />
            <span>Lahore, Pakistan</span>
          </div>
        </div>
        <div className="socials flex flex-row gap-2">
          <Link href="https://github.com/Furqan-10" target="_blank">
            <Image src={GithubIcon} alt="Github Icon" />
          </Link>
          <Link href="https://www.linkedin.com/in/furqan-asif-9438252a6" target="_blank">
            <Image src={LinkedinIcon} alt="Linkedin Icon" />
          </Link>
        </div>
      </div>
      <div>
        {emailSubmitted ? (
          <p className="text-green-500 text-sm mt-2">
            Email sent successfully!
          </p>
        ) : (
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="text-slate-800 dark:text-white block mb-2 text-sm font-medium"
              >
                Your email
              </label>
              <input
                name="email"
                type="email"
                id="email"
                required
                className="bg-slate-100 border border-slate-300 placeholder-slate-400 text-slate-900 text-sm rounded-lg block w-full p-2.5
                           dark:bg-[#18191E] dark:border-[#33353F] dark:placeholder-[#9CA2A9] dark:text-gray-100"
                placeholder="example@google.com"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="subject"
                className="text-slate-800 dark:text-white block text-sm mb-2 font-medium"
              >
                Subject
              </label>
              <input
                name="subject"
                type="text"
                id="subject"
                required
                className="bg-slate-100 border border-slate-300 placeholder-slate-400 text-slate-900 text-sm rounded-lg block w-full p-2.5
                           dark:bg-[#18191E] dark:border-[#33353F] dark:placeholder-[#9CA2A9] dark:text-gray-100"
                placeholder="Just saying hi"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="message"
                className="text-slate-800 dark:text-white block text-sm mb-2 font-medium"
              >
                Message
              </label>
              <textarea
                name="message"
                id="message"
                className="bg-slate-100 border border-slate-300 placeholder-slate-400 text-slate-900 text-sm rounded-lg block w-full p-2.5
                           dark:bg-[#18191E] dark:border-[#33353F] dark:placeholder-[#9CA2A9] dark:text-gray-100"
                placeholder="Let's talk about..."
              />
            </div>
            <button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 px-5 rounded-lg w-full"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default EmailSection;