"use server";

import axiosInstance from "@/api/axiosInstance";
import { AxiosError } from "axios";
import { LoginInputs, RegisterInputs } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface AuthResponse {
  success: boolean;
  data?: any;
  error?: string | string[];
}

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
      const message = error.response.data.message || "Registration failed.";
      console.log("Axios Error:", error.response.data.message);
      throw new Error(message);
    } else {
      throw new Error("An unknown error occurred during registration");
    }
  }
};

// export const signInAction = async ({ email, password }: LoginInputs) => {
//   try {
//     const res = await axiosInstance.post(
//       "/api/auth/sign-in",
//       {
//         email,
//         password,
//       },
//       {
//         withCredentials: true,
//       }
//     );

//     if (!res) {
//       throw new Error("No response from server");
//     }
//     console.log(res.data);

//     return res.data;
//   } catch (error) {
//     if (error instanceof AxiosError && error.response) {
//       const message = error.response.data.message || "Login failed.";
//       console.log("Axios Error:", error.response?.data.message);
//       throw new Error(message);
//     } else {
//       throw new Error("An unknown error occurred during login");
//     }
//   }
// };

export const signInAction = async ({
  email,
  password,
}: LoginInputs): Promise<AuthResponse> => {
  try {
    const res = await axiosInstance.post(
      "/api/auth/sign-in",
      { email, password },
      { withCredentials: true }
    );

    if (!res) {
      throw new Error("No response from server");
    }

    return { success: true, data: res.data };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const message = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(", ")
        : error.response.data.message || "Login failed";
      return { success: false, error: message };
    } else {
      return {
        success: false,
        error: "An unknown error occurred during login.",
      };
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
      throw new Error("An unknown error occurred during logout.");
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
      // const message = error.response.data.message || "Failed to fetch user data";
      console.log("Axios Error:", error.response?.data.message);
      return { error: error.response.data.message || "Axios error occurred" };
    } else {
      throw new Error("An unknown error occurred while fetching user data.");
    }
  }
};
