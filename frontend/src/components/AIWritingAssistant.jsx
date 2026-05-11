import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Copy,
  Check,
  RefreshCw,
  ChevronDown,
  Globe,
  Zap,
  MessageSquare,
  ArrowRight,
  Loader2,
  WandSparkles,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const TONES = [
  { id: "formal",       label: "Formal",       emoji: "🎩", desc: "Professional & structured" },
  { id: "informal",     label: "Informal",      emoji: "😊", desc: "Relaxed & natural" },
  { id: "friendly",     label: "Friendly",      emoji: "🤗", desc: "Warm & approachable" },
  { id: "respectful",   label: "Respectful",    emoji: "🙏", desc: "Courteous & considerate" },
  { id: "professional", label: "Professional",  emoji: "💼", desc: "Business-focused" },
  { id: "casual",       label: "Casual",        emoji: "✌️", desc: "Everyday & easygoing" },
  { id: "concise",      label: "Concise",       emoji: "⚡", desc: "Short & to the point" },
  { id: "witty",        label: "Witty",         emoji: "😜", desc: "Clever & humorous" },
  { id: "enthusiastic", label: "Enthusiastic",  emoji: "🤩", desc: "Excited & energetic" },
  { id: "empathetic",   label: "Empathetic",    emoji: "💖", desc: "Understanding & compassionate" },
  { id: "direct",       label: "Direct",        emoji: "🎯", desc: "Straightforward & clear" },
  { id: "poetic",       label: "Poetic",        emoji: "📜", desc: "Expressive & artistic" },
  { id: "sarcastic",    label: "Sarcastic",     emoji: "😒", desc: "Ironic & mocking" },
  { id: "assertive",    label: "Assertive",     emoji: "💪", desc: "Confident & forceful" },
  { id: "romantic",     label: "Romantic",      emoji: "🌹", desc: "Affectionate & loving" },
  { id: "academic",     label: "Academic",      emoji: "📚", desc: "Scholarly & objective" },
  { id: "persuasive",   label: "Persuasive",    emoji: "🧲", desc: "Convincing & compelling" },
];

const LANGUAGES = [
  { code: "auto",  label: "Auto-detect" },
  { code: "en",    label: "English" },
  { code: "hi",    label: "Hindi" },
  { code: "es",    label: "Spanish" },
  { code: "fr",    label: "French" },
  { code: "de",    label: "German" },
  { code: "pt",    label: "Portuguese" },
  { code: "ar",    label: "Arabic" },
  { code: "zh",    label: "Chinese" },
  { code: "ja",    label: "Japanese" },
  { code: "ko",    label: "Korean" },
  { code: "ru",    label: "Russian" },
  { code: "it",    label: "Italian" },
  { code: "bn",    label: "Bengali" },
  { code: "ta",    label: "Tamil" },
  { code: "te",    label: "Telugu" },
  { code: "mr",    label: "Marathi" },
];

import { axiosInstance } from "../lib/axios";

const AI_API_ENDPOINT = "/ai/generate";

// ─── Gemini API Call ──────────────────────────────────────────────────────────

async function callGemini(prompt) {
  try {
    const res = await axiosInstance.post(AI_API_ENDPOINT, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.85, maxOutputTokens: 1024 },
    });

    const data = res.data;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    console.log("[AI Assistant] Gemini raw response:", text);
    return text;
  } catch (error) {
    console.error("AI API error:", error);
    const message = error.response?.data?.message || error.message;
    throw new Error(`AI error: ${message}`);
  }
}

// ─── Build Prompt ─────────────────────────────────────────────────────────────

function buildPrompt(text, selectedTones, outputLang) {
  const toneList = selectedTones.length
    ? selectedTones.map((t) => TONES.find((x) => x.id === t)?.label).join(", ")
    : "Auto (keep original style)";

  const langInstruction =
    outputLang === "auto"
      ? "Respond in the SAME language as the input message. If the input is in Hindi or any Indic language, keep the response in that same language unless the tone implies English."
      : `Translate and rewrite the message into ${LANGUAGES.find((l) => l.code === outputLang)?.label ?? outputLang}.`;

  return `You are an elite AI writing assistant embedded in a chat app, similar to Grammarly or ChatGPT writing features.

USER MESSAGE: "${text}"

TASK:
1. Detect the input language automatically.
2. ${langInstruction}
3. Produce exactly ${selectedTones.length > 0 ? selectedTones.length : 3} improved rewritten versions of the message.
   - Each version should use one of these tones: ${toneList}
   - Correct grammar, spelling, and clarity.
   - Preserve the original meaning exactly.
   - Use emojis naturally if the tone is friendly/casual/informal; avoid them for formal/professional.
   - Make the message feel human and natural.

OUTPUT FORMAT (respond with valid JSON only, no markdown, no extra text):
{
  "detectedLanguage": "<language name>",
  "suggestions": [
    {
      "tone": "<Tone name>",
      "emoji": "<single tone emoji>",
      "text": "<rewritten message>"
    }
  ]
}`;
}

// ─── SuggestionCard ──────────────────────────────────────────────────────────

function SuggestionCard({ suggestion, onReplace, onRegenerate, index }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(suggestion.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ai-suggestion-card" style={{ animationDelay: `${index * 80}ms` }}>
      {/* Card header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{suggestion.emoji}</span>
          <span className="text-xs font-semibold text-cyan-400 tracking-wide uppercase">
            {suggestion.tone}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Copy */}
          <button
            onClick={handleCopy}
            title="Copy"
            className="ai-action-btn"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          {/* Regenerate */}
          <button
            onClick={() => onRegenerate(suggestion.tone)}
            title="Regenerate this tone"
            className="ai-action-btn"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Message text */}
      <p className="text-sm text-slate-200 leading-relaxed mb-3">{suggestion.text}</p>

      {/* Replace button */}
      <button
        onClick={() => onReplace(suggestion.text)}
        className="ai-replace-btn"
      >
        <ArrowRight className="w-3.5 h-3.5" />
        Use this message
      </button>
    </div>
  );
}

// ─── ToneChip ────────────────────────────────────────────────────────────────

function ToneChip({ tone, selected, onToggle }) {
  return (
    <button
      onClick={() => onToggle(tone.id)}
      className={`ai-tone-chip ${selected ? "ai-tone-chip-active" : ""}`}
      title={tone.desc}
    >
      <span>{tone.emoji}</span>
      <span>{tone.label}</span>
    </button>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

function AIWritingAssistant({ inputText, onClose, onReplace }) {
  const [selectedTones, setSelectedTones] = useState(["formal", "friendly", "professional"]);
  const [outputLang, setOutputLang] = useState("auto");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [detectedLang, setDetectedLang] = useState("");
  const [error, setError] = useState("");
  const [hasRun, setHasRun] = useState(false);

  const langMenuRef = useRef(null);
  const panelRef = useRef(null);

  // Close language menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Auto-run on open
  useEffect(() => {
    if (inputText?.trim() && !hasRun) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTone = (toneId) => {
    setSelectedTones((prev) =>
      prev.includes(toneId)
        ? prev.length > 1 ? prev.filter((t) => t !== toneId) : prev
        : [...prev, toneId]
    );
  };

  const handleGenerate = async () => {
    if (!inputText?.trim()) return;
    setIsLoading(true);
    setError("");
    setSuggestions([]);

    try {
      const prompt = buildPrompt(inputText, selectedTones, outputLang);
      const raw = await callGemini(prompt);

      // Strip markdown fences if Gemini wraps output in ```json ... ```
      const stripped = raw
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();

      // Extract the first JSON object from the response
      const jsonMatch = stripped.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No valid JSON object found in response");

      const parsed = JSON.parse(jsonMatch[0]);
      if (!Array.isArray(parsed.suggestions) || parsed.suggestions.length === 0) {
        throw new Error("Empty suggestions array in response");
      }

      setSuggestions(parsed.suggestions);
      setDetectedLang(parsed.detectedLanguage ?? "");
      setHasRun(true);
    } catch (err) {
      console.error("[AI Assistant] error:", err);
      setError(err.message?.includes("403") || err.message?.includes("401")
        ? "API key error. Please check your Gemini API key."
        : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async (tone) => {
    setIsLoading(true);
    setError("");
    try {
      const prompt = buildPrompt(inputText, [tone.toLowerCase()], outputLang);
      const raw = await callGemini(prompt);
      const stripped = raw
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
      const jsonMatch = stripped.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No valid JSON");
      const parsed = JSON.parse(jsonMatch[0]);
      const newSugg = parsed.suggestions?.[0];
      if (newSugg) {
        setSuggestions((prev) =>
          prev.map((s) =>
            s.tone.toLowerCase() === tone.toLowerCase() ? newSugg : s
          )
        );
      }
    } catch (err) {
      console.error("[AI Assistant] regenerate error:", err);
      setError("Regeneration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedLangLabel =
    LANGUAGES.find((l) => l.code === outputLang)?.label ?? "Auto-detect";

  return (
    <>
      {/* Backdrop */}
      <div className="ai-backdrop" onClick={onClose} />

      {/* Panel */}
      <div ref={panelRef} className="ai-panel" role="dialog" aria-label="AI Writing Assistant">

        {/* ── Header ── */}
        <div className="ai-panel-header">
          <div className="flex items-center gap-2.5">
            <div className="ai-header-icon">
              <WandSparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 leading-tight">AI Writing Assistant</h2>
              {detectedLang && (
                <p className="text-[10px] text-cyan-400/70 mt-0.5">
                  Detected: <span className="text-cyan-400 font-medium">{detectedLang}</span>
                </p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="ai-close-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Original Message Preview ── */}
        <div className="ai-original-preview">
          <div className="flex items-center gap-1.5 mb-1.5">
            <MessageSquare className="w-3 h-3 text-slate-500" />
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Original</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed italic">"{inputText}"</p>
        </div>

        {/* ── Controls ── */}
        <div className="ai-controls">

          {/* Tone Selector */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tone</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TONES.map((tone) => (
                <ToneChip
                  key={tone.id}
                  tone={tone}
                  selected={selectedTones.includes(tone.id)}
                  onToggle={toggleTone}
                />
              ))}
            </div>
          </div>

          {/* Language Selector + Generate */}
          <div className="flex items-center gap-2 mt-3">
            {/* Language picker */}
            <div className="relative flex-1" ref={langMenuRef}>
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="ai-lang-btn"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="flex-1 text-left truncate text-xs text-slate-300">
                  {selectedLangLabel}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${showLangMenu ? "rotate-180" : ""}`} />
              </button>
              {showLangMenu && (
                <div className="ai-lang-menu">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setOutputLang(lang.code); setShowLangMenu(false); }}
                      className={`ai-lang-option ${outputLang === lang.code ? "ai-lang-option-active" : ""}`}
                    >
                      {lang.label}
                      {outputLang === lang.code && <Check className="w-3 h-3 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !inputText?.trim()}
              className="ai-generate-btn"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              {isLoading ? "Generating…" : suggestions.length ? "Regenerate" : "Generate"}
            </button>
          </div>
        </div>

        {/* ── Results Area ── */}
        <div className="ai-results">
          {isLoading && (
            <div className="ai-loading-state">
              <div className="ai-shimmer-orb" />
              <div className="ai-shimmer-lines">
                <div className="ai-shimmer-line w-3/4" />
                <div className="ai-shimmer-line w-1/2" />
                <div className="ai-shimmer-line w-2/3" />
              </div>
              <p className="text-xs text-slate-500 text-center mt-3">Crafting your message variations…</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="ai-error-state">
              <span className="text-2xl">⚠️</span>
              <p className="text-sm text-red-400 font-medium">{error}</p>
              <button onClick={handleGenerate} className="ai-retry-btn">
                Try again
              </button>
            </div>
          )}

          {!isLoading && !error && suggestions.length === 0 && !hasRun && (
            <div className="ai-empty-state">
              <div className="ai-empty-icon">
                <WandSparkles className="w-6 h-6 text-cyan-400" />
              </div>
              <p className="text-sm text-slate-400 text-center">
                Select your desired tones and click <strong className="text-cyan-400">Generate</strong> to get AI-powered suggestions.
              </p>
            </div>
          )}

          {!isLoading && suggestions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-px bg-cyan-500/10" />
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                  {suggestions.length} suggestion{suggestions.length !== 1 ? "s" : ""}
                </span>
                <div className="flex-1 h-px bg-cyan-500/10" />
              </div>
              {suggestions.map((s, i) => (
                <SuggestionCard
                  key={`${s.tone}-${i}`}
                  suggestion={s}
                  index={i}
                  onReplace={(text) => { onReplace(text); onClose(); }}
                  onRegenerate={handleRegenerate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AIWritingAssistant;
