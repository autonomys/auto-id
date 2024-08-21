import axios from "axios";
import { getEnv } from "../../utils/getEnv";

export const AUTH_URL =
  `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.profile&include_granted_scopes=true&response_type=token&redirect_uri=${encodeURIComponent(
    getEnv("GOOGLE_AUTH_REDIRECT_URI")
  )}&client_id=${getEnv("GOOGLE_AUTH_CLIENT_ID")}`.replace(/\s/g, "");

interface GoogleUserProfile {
  id: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export async function getUserProfile(accessToken: string) {
  try {
    const profileUrl = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`;
    const response = await axios.get(profileUrl);

    return response.data as GoogleUserProfile;
  } catch (error) {
    console.error("Failed to retrieve user profile:", error);
    throw error;
  }
}
