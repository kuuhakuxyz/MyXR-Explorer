export function speakNarration(text: string, langCode: 'en' | 'ms' | 'zh' = 'en') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode === 'ms' ? 'ms-MY' : langCode === 'zh' ? 'zh-CN' : 'en-MY';
    utterance.rate = 0.96;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Gracefully ignore speech synthesis blocks in restricted sandboxes
  }
}

export function stopNarration() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }
  try {
    window.speechSynthesis.cancel();
  } catch {
    // Ignore
  }
}
