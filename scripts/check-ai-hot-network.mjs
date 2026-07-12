import dns from 'node:dns/promises';

const REQUIRED_HOSTS = ['aihot.virxact.com', 'open.feishu.cn'];
const HTTPS_TIMEOUT_MS = 10_000;

async function checkDns(host) {
  try {
    const addresses = await dns.lookup(host, { all: true });
    return {
      ok: addresses.length > 0,
      detail: addresses.map((entry) => entry.address).join(', '),
    };
  } catch (error) {
    return {
      ok: false,
      detail: `${error.code ?? error.name}: ${error.message}`,
    };
  }
}

async function checkHttps(host) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HTTPS_TIMEOUT_MS);

  try {
    const response = await fetch(`https://${host}`, {
      method: 'HEAD',
      signal: controller.signal,
    });

    return {
      ok: response.status < 500,
      detail: `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      detail: `${error.cause?.code ?? error.name}: ${error.message}`,
    };
  } finally {
    clearTimeout(timeout);
  }
}

let failed = false;

for (const host of REQUIRED_HOSTS) {
  const dnsResult = await checkDns(host);
  console.log(`${host} DNS: ${dnsResult.ok ? 'ok' : 'failed'} (${dnsResult.detail})`);

  const httpsResult = dnsResult.ok
    ? await checkHttps(host)
    : { ok: false, detail: 'skipped because DNS failed' };
  console.log(`${host} HTTPS: ${httpsResult.ok ? 'ok' : 'failed'} (${httpsResult.detail})`);

  if (!dnsResult.ok || !httpsResult.ok) {
    failed = true;
  }
}

if (failed) {
  console.error(
    'AI HOT Feishu automation requires DNS resolution and outbound HTTPS access for aihot.virxact.com and open.feishu.cn.',
  );
  process.exit(1);
}

console.log('AI HOT Feishu network prerequisites are available.');
