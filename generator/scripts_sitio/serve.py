import http.server, os, sys
root = sys.argv[1]
port = int(sys.argv[2])

class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=root, **k)
    def translate_path(self, path):
        p = super().translate_path(path)
        if not os.path.exists(p) and os.path.exists(p + ".html"):
            return p + ".html"
        return p
    def log_message(self, *a):
        pass

http.server.ThreadingHTTPServer(("127.0.0.1", port), H).serve_forever()
