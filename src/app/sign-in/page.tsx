"use client";

import { useState } from "react";
import { LoginInputs } from "@/types";
import { useSignIn } from "../hooks/index";
import Link from "next/link";
import { useAuth } from "../auth-context/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const INITIAL_INPUTS = {
  email: "",
  password: "",
};

export default function SignIn() {
  const { user } = useAuth();
  const router = useRouter();
  const [inputs, setInputs] = useState<LoginInputs>(INITIAL_INPUTS);
  const { login, isLoading, isError, error, data } = useSignIn();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(inputs);
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto w-full h-screen">
      <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
        <div className="w-full   rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
          <h1 className=" py-10 text-3xl font-semibold text-center text-gray-500 font-title">
            sign In - <span className=" text-red-300 font-title">next app</span>
          </h1>

          <form onSubmit={handleSubmit} className="px-2">
            <div className="py-2">
              <input
                id="email"
                type="email"
                value={inputs.email}
                onChange={(e) =>
                  setInputs({ ...inputs, email: e.target.value })
                }
                placeholder="E-mail"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:ring-red-300 focus:border-red-500 block w-full p-2.5  "
                // required
              />
            </div>

            <div className="py-2">
              <input
                id="password"
                type="password"
                value={inputs.password}
                onChange={(e) =>
                  setInputs({ ...inputs, password: e.target.value })
                }
                placeholder="Password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:ring-red-300 focus:border-red-500 block w-full p-2.5 "
                // required
              />
            </div>
            <Link
              href="/sign-up"
              className="text-sm  hover:underline hover:text-red-900 mt-2 inline-block"
            >
              <span>{"Don't"} have an account?</span>
            </Link>

            <div>
              <button
                className=" border-2 rounded-xl hover:bg-red-400 hover:text-dark-900   hover:ring-red-300 border-red-400
                                    px-6 py-3 my-8 mx-auto flex items-center justify-center w-22 h-12"
                disabled={isLoading}
              >
                {isLoading ? "LOADING" : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
