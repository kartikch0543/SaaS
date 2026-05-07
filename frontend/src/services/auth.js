import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth";
import apiClient from "../api/client";
import { auth, firebaseReady, googleProvider } from "./firebase";

const requireFirebase = () => {
  if (!firebaseReady || !auth) {
    throw new Error("Firebase authentication is not configured yet.");
  }
};

const syncSession = async (firebaseUser) => {
  const firebaseToken = await firebaseUser.getIdToken();
  const response = await apiClient.post("/api/auth/session", {
    firebaseToken,
    email: firebaseUser.email,
    name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Student",
    avatarUrl: firebaseUser.photoURL || ""
  });

  localStorage.setItem("studyforge_token", response.data.token);
  return response.data.user;
};

export const loginWithGoogle = async () => {
  requireFirebase();
  const result = await signInWithPopup(auth, googleProvider);
  return syncSession(result.user);
};

export const loginWithEmail = async (email, password) => {
  requireFirebase();
  const result = await signInWithEmailAndPassword(auth, email, password);
  return syncSession(result.user);
};

export const registerWithEmail = async (email, password) => {
  requireFirebase();
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return syncSession(result.user);
};

export const logout = async () => {
  localStorage.removeItem("studyforge_token");
  if (auth) {
    await signOut(auth);
  }
};
