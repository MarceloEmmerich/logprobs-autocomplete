import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Key, CheckCircle2 } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeySet: (key: string) => void;
  hasKey: boolean;
}

export const ApiKeyInput = ({ onApiKeySet, hasKey }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
    }
  };

  if (hasKey) {
    return (
      <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span>API Key configured</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onApiKeySet("")}
            className="ml-auto text-xs"
          >
            Clear
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-3">
          <Key className="w-5 h-5 text-primary mt-1" />
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-foreground">OpenAI API Key</h3>
            <p className="text-sm text-muted-foreground">
              Enter your OpenAI API key to enable real-time predictions. Your key is stored locally and never sent to any server except OpenAI.
            </p>
            <div className="flex gap-2">
              <Input
                type={showKey ? "text" : "password"}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 bg-input border-border"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? "Hide" : "Show"}
              </Button>
              <Button type="submit" disabled={!apiKey.trim()}>
                Set Key
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
};
