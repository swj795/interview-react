const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 aihot-skill/0.2.0';
const FEISHU_WEBHOOK =
  'https://open.feishu.cn/open-apis/bot/v2/hook/' +
  '498e2b95-2edd-4526-835c-4aeab2bf1566';
const AI_HOT_TITLE = 'AI HOT · 过去24小时';
const GROUP_ORDER = ['模型/基础设施', '产品/工具', '行业动态', '安全/风险', '观点/技巧'];
const CATEGORY_GROUPS = {
  'ai-models': '模型/基础设施',
  'ai-products': '产品/工具',
  industry: '行业动态',
  paper: '观点/技巧',
  tip: '观点/技巧',
};
const RISK_PATTERN =
  /安全|风险|漏洞|攻击|合规|版权|隐私|监管|诈骗|滥用|越狱|泄露|safety|security|risk|privacy|copyright|regulation/i;

function trimText(value, maxLength = 95) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) {
    return '暂无摘要。';
  }
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text;
}

function groupForItem(item) {
  const searchable = `${item.title || ''} ${item.summary || ''} ${item.source || ''}`;
  if (RISK_PATTERN.test(searchable)) {
    return '安全/风险';
  }
  return CATEGORY_GROUPS[item.category] || '行业动态';
}

function buildSummary(items) {
  if (items.length === 0) {
    return `${AI_HOT_TITLE}\n\n过去24小时暂无精选更新。`;
  }

  const buckets = new Map(GROUP_ORDER.map((groupName) => [groupName, []]));
  for (const item of items) {
    const groupName = groupForItem(item);
    const bucket = buckets.get(groupName) || [];
    if (bucket.length < 4) {
      bucket.push(item);
      buckets.set(groupName, bucket);
    }
  }

  let selected = [];
  for (const groupName of GROUP_ORDER) {
    selected = selected.concat((buckets.get(groupName) || []).map((item) => [groupName, item]));
  }
  selected = selected.slice(0, 10);

  const lines = [AI_HOT_TITLE, '', `共获取 ${items.length} 条精选，以下为 Top ${selected.length}。`];
  let currentGroup = '';
  let itemNumber = 1;

  for (const [groupName, item] of selected) {
    if (groupName !== currentGroup) {
      lines.push('', `【${groupName}】`);
      currentGroup = groupName;
    }
    lines.push(`${itemNumber}. ${item.title || '未命名动态'}`);
    lines.push(`   ${trimText(item.summary)}`);
    lines.push(`   来源：${item.source || '未知来源'} ${item.url || ''}`.trimEnd());
    itemNumber += 1;
  }

  return lines.join('\n');
}

function richTextContentFromSummary(summary) {
  return summary.split('\n').map((line) => {
    if (!line) {
      return [];
    }

    const match = line.match(/(https?:\/\/\S+)/);
    if (!match) {
      return [{ tag: 'text', text: line }];
    }

    const beforeUrl = line.slice(0, match.index);
    const url = match[1];
    const afterUrl = line.slice((match.index || 0) + url.length);
    const row = [];
    if (beforeUrl) {
      row.push({ tag: 'text', text: beforeUrl });
    }
    row.push({ tag: 'a', text: '链接', href: url });
    if (afterUrl) {
      row.push({ tag: 'text', text: afterUrl });
    }
    return row;
  });
}

async function sendFeishu(summary) {
  const richPayload = {
    msg_type: 'post',
    content: {
      post: {
        zh_cn: {
          title: AI_HOT_TITLE,
          content: richTextContentFromSummary(summary),
        },
      },
    },
  };

  try {
    const response = await fetch(FEISHU_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(richPayload),
    });
    const bodyText = await response.text();
    const body = parseJson(bodyText);
    if (body?.code === 0) {
      return { ok: true, mode: 'post', status: response.status, code: body.code };
    }
    console.log(
      `Feishu rich text send failed; falling back to text. status=${response.status} code=${body?.code ?? 'unknown'}`,
    );
    if (body?.code !== undefined) {
      console.log(`Feishu rich text response code: ${body.code}`);
    }
  } catch (error) {
    console.log(`Feishu rich text send errored; falling back to text. ${formatError(error)}`);
  }

  const textResponse = await fetch(FEISHU_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ msg_type: 'text', content: { text: summary } }),
  });
  const textBody = parseJson(await textResponse.text());
  return {
    ok: textBody?.code === 0,
    mode: 'text',
    status: textResponse.status,
    code: textBody?.code,
    body: textBody,
  };
}

async function fetchItems(since) {
  const url = new URL('https://aihot.virxact.com/api/public/items');
  url.searchParams.set('mode', 'selected');
  url.searchParams.set('since', since);
  url.searchParams.set('take', '50');

  let response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (response.status === 403) {
    console.log('AI HOT returned 403; retrying with the required User-Agent.');
    response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  }

  const bodyText = await response.text();
  if (!response.ok) {
    throw new Error(`AI HOT request failed: HTTP ${response.status} ${bodyText.slice(0, 500)}`);
  }

  const body = parseJson(bodyText);
  return Array.isArray(body?.items) ? body.items : [];
}

function parseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function formatError(error) {
  return `${error.cause?.code ?? error.name}: ${error.message}`;
}

const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
console.log(`Computed since: ${since}`);

try {
  const items = await fetchItems(since);
  console.log(`Fetched selected AI HOT items: ${items.length}`);
  const summary = buildSummary(items);
  const result = await sendFeishu(summary);

  console.log(
    `Feishu result: ok=${result.ok} mode=${result.mode} status=${result.status} code=${result.code ?? 'unknown'}`,
  );
  if (!result.ok) {
    console.log(`Feishu response: ${JSON.stringify(result.body)}`);
    process.exit(1);
  }
} catch (error) {
  console.error(formatError(error));
  process.exit(1);
}
