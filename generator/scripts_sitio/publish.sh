#!/bin/bash
# Uso: bash scripts/publish.sh "mensaje del commit"
# Construye la web, regenera el PDF desde la guia publicada (siempre la ultima version) y sube todo.
set -e
S=/tmp/claude-0/-home-claude/72eeba4d-9a04-54d4-bef1-27bed5fba9de/scratchpad
cd $S
python3 scripts/site2.py $PWD > /tmp/build.log 2>&1 || { tail -15 /tmp/build.log; echo 'FALLO EN LA CONSTRUCCION: no se publica'; exit 1; }
tail -1 /tmp/build.log
[ -f site2/guia-javi.html ] || { echo 'FALTA guia-javi.html: no se publica'; exit 1; }
curl -s -o /dev/null localhost:8123/guia-javi.html || { (nohup python3 scripts/serve.py site2 8123 >/dev/null 2>&1 &); sleep 2; }
NODE_PATH=/home/claude/.npm-global/lib/node_modules/@playwright/mcp/node_modules node scripts/mkpdf.js x site2/AMS-guia-para-Javi.pdf
cd site && git pull -q --ff-only && (cd ../site2 && tar cf - --exclude=./api .) | tar xf - -C public && cp ../site2/api/_asistente-prompt.js lib/asistente-prompt.js && git add -A && git commit -qm "$1" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01Vz2L6RcrzRCkzTJfPWm8Ee" && git push -q origin main && echo publicado
