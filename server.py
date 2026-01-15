from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
import webbrowser

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def run_server(port=8080):
    web_dir = os.path.join(os.path.dirname(__file__))
    os.chdir(web_dir)
    
    server_address = ('', port)
    httpd = HTTPServer(server_address, CORSRequestHandler)
    
    print(f"🚀 Сервер запущен на http://localhost:{port}")
    print("📱 Мини-приложение доступно по адресу:")
    print(f"   http://localhost:{port}/about.html")
    print("\n⏹️  Для остановки сервера нажмите Ctrl+C")
    
    try:
        # Автоматически открыть в браузере для тестирования
        webbrowser.open(f'http://localhost:{port}/about.html')
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Сервер остановлен")

if __name__ == '__main__':
    run_server()