import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PredictionEditorProps {
  apiKey: string;
}

export const PredictionEditor = ({ apiKey }: PredictionEditorProps) => {
  const [text, setText] = useState("");
  const [prediction, setPrediction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getPrediction = async (currentText: string) => {
    if (!currentText.trim()) {
      setPrediction("");
      setConfidence(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a text prediction assistant. Given the user's text, predict only the next single word that would logically follow. Respond with ONLY that one word, nothing else."
            },
            {
              role: "user",
              content: currentText
            }
          ],
          max_tokens: 5,
          logprobs: true,
          top_logprobs: 3,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content?.trim();
      const logprobs = data.choices[0]?.logprobs?.content?.[0];

      if (content && logprobs) {
        // Convert logprob to probability (e^logprob)
        const prob = Math.exp(logprobs.logprob) * 100;
        setPrediction(content);
        setConfidence(Math.round(prob));
      }
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error("Failed to get prediction. Check your API key.");
      setPrediction("");
      setConfidence(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Accept prediction with Tab
    if (e.key === "Tab" && prediction) {
      e.preventDefault();
      const newText = text + prediction + " ";
      setText(newText);
      setPrediction("");
      setConfidence(null);
    }
    // Trigger prediction on Space
    else if (e.key === " " && text.trim()) {
      const newText = text + " ";
      setText(newText);
      getPrediction(newText);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    // Clear prediction if user is typing over it
    if (prediction && !newText.endsWith(" ")) {
      setPrediction("");
      setConfidence(null);
    }
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="space-y-4">
      <Card className="relative p-6 bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        
        <div className="relative space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI-Powered Prediction Editor</span>
            {isLoading && (
              <Loader2 className="w-4 h-4 animate-spin ml-auto text-primary" />
            )}
          </div>

          <div className="relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Start typing... Press space for predictions, Tab to accept."
              className="w-full min-h-[300px] p-4 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
              style={{ transition: "var(--transition-smooth)" }}
            />
            
            {prediction && (
              <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                <span className="inline-block px-3 py-1.5 bg-[hsl(var(--prediction-bg))] text-[hsl(var(--prediction-text))] rounded-md text-sm font-mono animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {prediction}
                  {confidence !== null && (
                    <span className="ml-2 text-xs opacity-70">
                      ({confidence}%)
                    </span>
                  )}
                  <span className="ml-2 text-xs opacity-50">
                    [Tab to accept]
                  </span>
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 bg-secondary rounded text-secondary-foreground">Space</kbd>
              <span>Predict next word</span>
            </div>
            <div className="flex items-center gap-1.5">
              <kbd className="px-2 py-1 bg-secondary rounded text-secondary-foreground">Tab</kbd>
              <span>Accept prediction</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card/30 backdrop-blur-sm border-primary/10">
        <h4 className="text-sm font-medium text-foreground mb-2">How it works</h4>
        <ul className="text-xs text-muted-foreground space-y-1.5">
          <li>• Type naturally and press space after each word</li>
          <li>• The AI analyzes your text using logprobs to predict the next word</li>
          <li>• Predictions appear below with confidence scores</li>
          <li>• Press Tab to accept or keep typing to ignore</li>
          <li>• Higher confidence % means the AI is more certain about the prediction</li>
        </ul>
      </Card>
    </div>
  );
};
