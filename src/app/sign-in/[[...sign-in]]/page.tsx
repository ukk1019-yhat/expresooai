import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            EXPRESSO<span className="text-[#c47d3b]">AI</span>
          </h1>
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
      </div>
    </div>
  );
}
