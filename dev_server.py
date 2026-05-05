from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".js": "application/javascript",
        ".css": "text/css",
    }


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8000), Handler)
    print("Card Centering Tool running at http://127.0.0.1:8000")
    server.serve_forever()
