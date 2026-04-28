const FOREIGNER_RE = /<Foreigner\s+name=["'](.*?)["']\s+mood=["'](.*?)["'][^>]*>\s*[「]?\s*([\s\S]*?)\s*[」]?\s*<\/Foreigner>/i;
const STYLE_ID = 'abby-foreigner-display-style';
const RENDERED_ATTR = 'data-abby-rendered';

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildAvatarUrl(mood: string): string {
  return `https://cdn.jsdelivr.net/gh/AkabaneSaki/myrepo@main/picture/abby/${encodeURIComponent(mood)}{{getVar::system_skin}}.png`;
}

function buildCardHtml(name: string, mood: string, content: string): string {
  const safeName = escapeHtml(name.trim());
  const safeContent = escapeHtml(content.trim()).replace(/\n/g, '<br>');
  const avatarUrl = buildAvatarUrl(mood.trim());
  return `
<div class="abby-card-shell">
  <div class="abby-card">
    <div class="abby-left">
      <div class="abby-portrait" style="background-image:url('${avatarUrl}')"></div>
    </div>
    <div class="abby-right">
      <div class="abby-nameplate">${safeName}</div>
      <div class="abby-dialogbox">${safeContent}</div>
    </div>
  </div>
</div>`;
}

function getMessageText($mes: JQuery<HTMLElement>): string {
  const dataMes = $mes.attr('mesid');
  if (dataMes != null) {
    const id = Number(dataMes);
    if (!Number.isNaN(id)) {
      const messages = getChatMessages();
      const target = messages[id];
      if (target && typeof target.message === 'string') return target.message;
    }
  }
  return $mes.text() || '';
}

function getTargetBubble($mes: JQuery<HTMLElement>): JQuery<HTMLElement> {
  const selectors = ['.mes_text', '.message_text', '.mes_block .mes_text', '.mes_content'];
  for (const selector of selectors) {
    const $found = $mes.find(selector).first();
    if ($found.length) return $found as JQuery<HTMLElement>;
  }
  return $mes;
}

function renderMessage($mes: JQuery<HTMLElement>): void {
  if ($mes.attr(RENDERED_ATTR) === '1') return;
  const raw = getMessageText($mes);
  const match = raw.match(FOREIGNER_RE);
  if (!match) return;
  const [, name, mood, content] = match;
  const $target = getTargetBubble($mes);
  $target.html(buildCardHtml(name, mood, content));
  $mes.attr(RENDERED_ATTR, '1');
}

function renderAllMessages(): void {
  $('.mes').each((_, el) => renderMessage($(el as HTMLElement)));
}

function ensureStyle(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
.abby-card-shell{margin:8px 0;}
.abby-card{display:flex;gap:16px;margin:0;padding:16px;background:#0d1324;border:1px solid #4a5a8a;border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,.35);color:#f0f4f8;font-family:"Noto Serif SC","Microsoft YaHei",serif;}
.abby-left{flex:0 0 auto;}
.abby-portrait{width:120px;height:160px;background-size:cover;background-position:center top;background-color:#05081c;border:2px solid #a8c0ff;border-radius:6px;box-shadow:0 0 10px rgba(168,192,255,.2);}
.abby-right{flex:1 1 auto;min-width:0;}
.abby-nameplate{display:inline-block;margin:0 0 8px 0;padding:6px 14px;background:#1a2544;border:1px solid #8fa8e8;border-bottom:none;border-radius:8px 8px 0 0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:1px;}
.abby-dialogbox{padding:14px 16px;background:#11192e;border:1px solid #6f86c2;border-radius:0 10px 10px 10px;color:#f0f4f8;line-height:1.8;font-size:16px;word-break:break-word;white-space:normal;}
@media only screen and (max-width:768px){.abby-card{display:block;padding:14px}.abby-left{margin-bottom:12px;text-align:center}.abby-portrait{width:96px;height:128px;display:inline-block}.abby-nameplate{font-size:18px}.abby-dialogbox{font-size:15px}}
`;
  document.head.appendChild(style);
}

$(() => {
  ensureStyle();
  renderAllMessages();
  const observer = new MutationObserver(() => {
    ensureStyle();
    renderAllMessages();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  $(window).on('pagehide', () => observer.disconnect());
});
