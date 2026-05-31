import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      {/* Home link */}
      <div className="fixed top-4 left-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors px-3 py-2 rounded-lg hover:bg-zinc-800/50"
        >
          ← Home
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-white mb-2 hover:opacity-80 transition-opacity">
              BEYON<span className="text-[#c47d3b]">AI</span>
            </h1>
          </Link>
          <p className="text-zinc-400 text-sm">Sign in to start your simulation</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-[#111118] border border-zinc-800 shadow-2xl rounded-2xl",
              headerTitle: "text-white",
              headerSubtitle: "text-zinc-400",
              formFieldLabel: "text-zinc-300",
              formFieldInput: "bg-[#1a1a24] border-zinc-700 text-white focus:border-[#c47d3b]",
              formButtonPrimary: "bg-[#c47d3b] hover:bg-[#a66830] text-white",
              footerActionLink: "text-[#c47d3b] hover:text-[#a66830]",
              identityPreviewText: "text-zinc-300",
              identityPreviewEditButton: "text-[#c47d3b]",
            },
          }}
        />
        <p className="text-center text-zinc-600 text-xs mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-[#c47d3b] hover:text-[#a66830] transition-colors">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
