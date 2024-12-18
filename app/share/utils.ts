export function detectLanguage(code: string) {
  if (/^\s*#include\s+<\w+>/.test(code)) return 'lang-cpp';
  if (/^\s*<!DOCTYPE\s+html>/i.test(code) || /<html[\s>]/i.test(code))
    return 'lang-html';
  if (
    /^\s*class\s+\w+\s*\{/i.test(code) ||
    /^\s*public\s+static\s+void\s+main\s*\(/i.test(code)
  )
    return 'lang-java';
  if (/^\s*function\s+\w+\s*\(/.test(code) || /\bconsole\.log\(/.test(code))
    return 'lang-javascript';
  if (/^\s*\{[\s\S]*:\s*[\s\S]*\}/.test(code) && /^[\s\S]*\}$/.test(code))
    return 'lang-json';
  if (/^\s*@lezer\/parser/.test(code)) return 'lang-lezer';
  if (/^\s*#\s|^\s*\*\*.+\*\*/.test(code) || /^\s*\w+\s*:/.test(code))
    return 'lang-markdown';
  if (/^\s*<\?php/.test(code)) return 'lang-php';
  if (/^\s*def\s+\w+\(/.test(code)) return 'lang-python';
  if (/^\s*fn\s+\w+\s*\(/.test(code) || /\blet\s+mut\b/.test(code))
    return 'lang-rust';
  if (/^\s*SELECT\b|INSERT\b|UPDATE\b|DELETE\b|CREATE\b/i.test(code))
    return 'lang-sql';
  if (/^\s*<\?xml/.test(code) || /^\s*<[\w-]+\s*[\w-]*=".*">/.test(code))
    return 'lang-xml';
  if (/^\s*@(?!charset)/.test(code) || /^\s*\.\w+\s*\{/.test(code))
    return 'lang-less';
  if (/^\s*\$[\w-]+:/.test(code) || /@mixin\b/.test(code)) return 'lang-sass';

  return 'Unknown';
}
