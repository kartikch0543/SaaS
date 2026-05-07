import { SeoHead } from "../components/seo/SeoHead";
import { AuthCard } from "../components/auth/AuthCard";

export const LoginPage = () => (
  <>
    <SeoHead title="Login" description="Access your study dashboard and personalized prep workflows." path="/login" />
    <section className="mx-auto grid min-h-[70vh] max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pine">Student authentication</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-ink">Save your prep history and track progress across devices.</h1>
        <p className="mt-4 max-w-xl text-slate-700">
          Firebase authentication powers secure Google login and email sign-in while the backend issues verified app sessions for protected data.
        </p>
      </div>
      <AuthCard />
    </section>
  </>
);
