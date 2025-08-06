# EasyPaste

Share text and code instantly with EasyPaste - a simple and fast paste sharing service.

## Features

- 📝 Share text and code instantly
- 🔗 Custom share codes for memorable URLs
- 📱 QR code generation for easy mobile sharing
- 💻 Command-line tool for terminal users
- ⏰ Automatic deletion after 24 hours
- 🚀 Fast and lightweight

## Components

### Backend (Node.js)
- Express server with MongoDB and Redis
- RESTful API for creating and retrieving pastes
- Automatic TTL-based deletion

### Web Frontend (React)
- Simple, intuitive interface
- QR code generation
- Copy-to-clipboard functionality

### CLI Tool (Rust)
- Three input modes: file path, direct text, or editor
- Custom share codes support
- Cross-platform binary

## Quick Start

### Backend Setup

```bash
cd backend
npm install

# Configure environment variables in .env
# Start MongoDB and Redis services

npm run dev
```

### Web Frontend

```bash
cd backend/web
npm install
npm run dev
```

### CLI Tool

```bash
cd easypaste-cli
cargo build --release

# Install globally
cp target/release/easypaste /usr/local/bin/
cp target/release/easypaste /usr/local/bin/ep
```

## CLI Usage

```bash
# Share a file
easypaste file.txt

# Share text directly
easypaste "Hello, World!"

# Open editor to compose
easypaste -e

# Use custom share code
easypaste --code mycustomcode file.txt

# Short alias
ep "Quick share"
```

## API Endpoints

- `POST /api/paste` - Create a new paste
- `GET /api/paste/:code` - Get paste content (JSON)
- `GET /:code` - View paste content (plain text)

## Environment Variables

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/easypaste
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:5173
PASTE_TTL_HOURS=24
```

## License

MIT