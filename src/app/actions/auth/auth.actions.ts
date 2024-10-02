"use server";

import axiosInstance from "@/api/axiosInstance";
import { AxiosError } from "axios";
import { LoginInputs, RegisterInputs } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async ({
  username,
  email,
  password,
}: RegisterInputs) => {
  try {
    const res = await axiosInstance.post(
      "/api/auth/sign-up",
      { username, email, password },
      { withCredentials: true }
    );

    if (!res) {
      throw new Error("No response from server");
    }

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      console.log("Axios Error:", error.response.data.message);
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const signInAction = async ({ email, password }: LoginInputs) => {
  try {
    const res = await axiosInstance.post(
      "/api/auth/sign-in",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    if (!res) {
      throw new Error("No response from server");
    }
    console.log(res.data);

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      console.log("Axios Error:", error.response?.data.message);
      throw new Error(error.response?.data.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const signOutAction = async () => {
  try {
    const res = await axiosInstance.post("/api/auth/sign-out", {
      withCredentials: true,
    });
    if (!res) {
      throw new Error("No response from server");
    }

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("Axios Error:", error);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const currentUserAction = async () => {
  const token = cookies().get("token")?.value;

  if (!token) {
    // throw new Error("No token found in cookies");
    redirect("/sign-in");
  }

  try {
    const res = await axiosInstance.get("/api/auth/current", {
      headers: {
        Cookie: `token=${token}`,
      },
      withCredentials: true,
    });

    if (!res) {
      throw new Error("No response from server");
    }
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      console.log("Axios Error:", error.response?.data.message);
      return { error: error.response.data.message || "Axios error occurred" };
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
