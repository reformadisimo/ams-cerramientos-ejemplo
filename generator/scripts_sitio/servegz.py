import http.server, os, sys, gzip
root = sys.argv[1]; port = int(sys.argv[2])
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=root, **k)
    def translate_path(self, path):
        p = super().translate_path(path)
        if not os.path.exists(p) and os.path.exists(p + ".html"): return p + ".html"
        return p
    def do_GET(self):
        p = self.translate_path(self.path.split('?')[0])
        if os.path.isdir(p): p = os.path.join(p, 'index.html')
        if os.path.isfile(p) and p.rsplit('.',1)[-1] in ('html','css','js','svg','json','txt','xml'):
            d = gzip.compress(open(p,'rb').read(), 6)
            self.send_response(200); self.send_header('Content-Type', self.guess_type(p)); self.send_header('Content-Encoding','gzip'); self.send_header('Content-Length', str(len(d))); self.send_header('Cache-Control','public, max-age=3600'); self.end_headers(); self.wfile.write(d); return
        super().do_GET()
    def log_message(self, *a): pass
http.server.ThreadingHTTPServer(("127.0.0.1", port), H).serve_forever()
