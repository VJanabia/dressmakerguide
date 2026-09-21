#!/usr/bin/env node
/**
 * One-shot GitHub bootstrap: create the repository if it is missing, then push.
 *
 *   GITHUB_TOKEN=ghp_xxx node scripts/push-to-github.mjs
 *
 * Uses the API only for the create step; the push itself is plain git, so your token is never
 * written to .git/config or to disk. Revoke it afterwards if you created it just for this.
 */
import { execFileSync } from 'node:child_process';

const OWNER = 'VJanabia';
const REPO = 'dressmakerguide';
const TOKEN = process.env.GITHUB_TOKEN;
if (!TOKEN) {
  console.error('Set GITHUB_TOKEN first. Create one at https://github.com/settings/tokens with the "repo" scope.');
  process.exit(1);
}

const api = async (method, path, body) => {
  const res = await fetch('https://api.github.com' + path, {
    method,
    headers: {
      Authorization: 'Bearer ' + TOKEN,
      Accept: 'application/vnd.github+json',
      'User-Agent': OWNER + '-bootstrap',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, json: text ? JSON.parse(text) : null };
};

const existing = await api('GET', '/repos/' + OWNER + '/' + REPO);
if (existing.status === 200) {
  console.log('Repository already exists: ' + existing.json.html_url);
} else if (existing.status === 404) {
  const created = await api('POST', '/user/repos', {
    name: REPO,
    description: 'Unofficial static fan guide to the cozy dressmaking game Dressmaker (Steam app 4019220).',
    homepage: 'https://dressmakerguide.com',
    private: false,
    has_issues: true,
    has_wiki: false,
  });
  if (created.status !== 201) {
    console.error('Could not create the repository: ' + created.status + ' ' + JSON.stringify(created.json));
    process.exit(1);
  }
  console.log('Created: ' + created.json.html_url);
} else {
  console.error('Unexpected API response: ' + existing.status + ' ' + JSON.stringify(existing.json));
  process.exit(1);
}

const remote = 'https://' + OWNER + ':' + TOKEN + '@github.com/' + OWNER + '/' + REPO + '.git';
const run = (args) => execFileSync('git', args, { stdio: 'inherit' });
run(['remote', 'remove', 'origin']);
run(['remote', 'add', 'origin', remote]);
run(['push', '-u', 'origin', 'main']);
// keep the token out of .git/config once the push is done
run(['remote', 'set-url', 'origin', 'https://github.com/' + OWNER + '/' + REPO + '.git']);
console.log('Pushed main. Remote reset to the clean URL: https://github.com/' + OWNER + '/' + REPO);
