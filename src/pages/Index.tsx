import { useState } from "react";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { PredictionEditor } from "@/components/PredictionEditor";
import { Brain } from "lucide-react";

const Index = () => {
  const [apiKey, setApiKey] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.15),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--accent)/0.1),transparent)]" />
      
      <div className="relative z-10 container max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top duration-700">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-[var(--shadow-glow)]">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            AI Text Prediction
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience real-time next word prediction powered by OpenAI's logprobs. 
            Watch as the AI anticipates your thoughts with confidence scores.
          </p>
        </div>

        {/* API Key Input */}
        <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-150">
          <ApiKeyInput onApiKeySet={setApiKey} hasKey={!!apiKey} />
        </div>

        {/* Editor */}
        {apiKey && (
          <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <PredictionEditor apiKey={apiKey} />
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-8">
          <p>
            Powered by OpenAI's logprobs feature •{" "}
            <a
              href="https://cookbook.openai.com/examples/using_logprobs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Learn more
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
