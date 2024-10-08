"use client";

import { useEffect } from "react";

import Navbar from "@/components/Navbar/Navbar";

import Link from "next/link";

export default function Home() {
  const fetchHome = async () => {
    try {
      const res = await fetch("http://localhost:8000/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHome();
  }, []);

  return (
    <>
      {/* <Navbar></Navbar> */}
      <main className="main-home side-anim center-wrapper">
        <h2 className="main-title">Click the planet</h2>
        <article className="main-subtitle">Simple clicker game</article>
        <article className="home-article">
          <h4>Start your clicking journey right now!</h4>
          <Link href="/register">
            <button className="submit-button home-register-button">
              Register
            </button>
          </Link>
          <p className="home-login-info">
            Already have an account? <Link href="/login">Login here</Link>
          </p>
        </article>
      </main>
    </>
  );
}
