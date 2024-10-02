"use client";

import { useState } from "react";
import { RegisterInputs } from "@/types";
import Link from "next/link";
import { useSignUp } from "../hooks/index";
import { useAuth } from "../auth-context/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const INITIAL_INPUTS = {
  username: "",
  email: "",
  password: "",
};

export default function SignUp() {
  const { user } = useAuth();
  const router = useRouter();
  const [inputs, setInputs] = useState<RegisterInputs>(INITIAL_INPUTS);
  const { register, isLoading } = useSignUp();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(inputs);
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto w-full h-screen  ">
      <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
        <div className="w-full   rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
          <h1 className=" py-10 text-3xl font-semibold text-center text-gray-500 font-title">
            sign up - <span className=" text-red-300 font-title">next app</span>
          </h1>

          <form onSubmit={handleSubmit} className="px-2">
            <div className="py-2">
              <input
                id="username"
                type="text"
                placeholder="Username"
                value={inputs.username}
                onChange={(e) =>
                  setInputs({ ...inputs, username: e.target.value })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none  focus:ring-red-300 focus:border-red-500 block w-full p-2.5  "
              />
            </div>

            <div className="py-2">
              <input
                id="email"
                type="email"
                placeholder="E-mail"
                value={inputs.email}
                onChange={(e) =>
                  setInputs({ ...inputs, email: e.target.value })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:ring-red-300 focus:border-red-500 block w-full p-2.5 "
              />
            </div>

            <div className="py-2">
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={inputs.password}
                onChange={(e) =>
                  setInputs({ ...inputs, password: e.target.value })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:ring-red-300 focus:border-red-500 block w-full p-2.5 "
              />
            </div>
            <Link
              href="/sign-in"
              className="text-sm  hover:underline hover:text-red-900 mt-2 inline-block"
            >
              <span>{"Already"} have an account?</span>
            </Link>

            <div>
              <button
                className=" border-2 rounded-xl hover:bg-red-400 hover:text-dark-900   hover:ring-gray-300 border-red-400
                                  px-6 py-3 my-8 mx-auto flex items-center justify-center w-22 h-12 "
                disabled={isLoading}
              >
                {isLoading ? "Loading" : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
