# EasyPaste CLI

A fast and simple command-line tool for sharing text and code instantly.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=flat&logo=rust&logoColor=white)](https://www.rust-lang.org/)

## 🚀 Features

- **Three Input Methods**: File path, direct text, or editor
- **Custom Share Codes**: Create memorable URLs with custom codes
- **QR Code Display**: Automatic terminal QR code generation
- **Cross-Platform**: Works on macOS, Linux, and Windows
- **Fast & Lightweight**: Built with Rust for maximum performance
- **Clipboard Integration**: Auto-copy URLs to clipboard (macOS)

## 📦 Installation

### Pre-built Binaries

Download the latest release for your platform:

#### macOS
```bash
# Intel/Apple Silicon
curl -L https://github.com/wcmoon/easypaste/releases/latest/download/easypaste-macos -o easypaste
chmod +x easypaste
sudo mv easypaste /usr/local/bin/
```

#### Linux
```bash
# x86_64
curl -L https://github.com/wcmoon/easypaste/releases/latest/download/easypaste-linux -o easypaste
chmod +x easypaste
sudo mv easypaste /usr/local/bin/
```

#### Windows
```powershell
# Download and place in PATH
Invoke-WebRequest -Uri "https://github.com/wcmoon/easypaste/releases/latest/download/easypaste-windows.exe" -OutFile "easypaste.exe"
```

### Build from Source

Requirements: [Rust](https://rustup.rs/) 1.70 or later

```bash
git clone https://github.com/wcmoon/easypaste.git
cd easypaste/easypaste-cli
cargo build --release
cp target/release/easypaste /usr/local/bin/
```

### Alternative: Symlink for Development
```bash
# Create symlink as 'ep' for shorter command
ln -s /usr/local/bin/easypaste /usr/local/bin/ep
```

## 📖 Usage

### Basic Examples

```bash
# Share a file
easypaste file.txt

# Share text directly  
easypaste "Hello, World!"

# Open editor to compose
easypaste -e

# Share from stdin
echo "Hello from CLI" | easypaste

# Use custom share code
easypaste --code mycustomcode file.txt

# Don't show QR code
easypaste --no-qr file.txt

# Use shorter alias
ep "Quick share"
```

### Command Options

```
Usage: easypaste [OPTIONS] [INPUT]

Arguments:
  [INPUT]  Text to share or file path

Options:
  -c, --code <CODE>      Custom share code (min 4 chars)
  -e, --editor           Open editor to compose content
      --server <SERVER>  API server URL [default: https://easypaste.xyz]
      --no-qr            Don't show QR code for the share link
  -h, --help             Print help
  -V, --version          Print version
```

## 🌟 Examples

### Share a Configuration File
```bash
easypaste ~/.bashrc
# Output: https://easypaste.xyz/AbC123Xy
```

### Create a Custom Short Link
```bash
easypaste --code myconfig ~/.vimrc  
# Output: https://easypaste.xyz/myconfig
```

### Share Command Output
```bash
ps aux | easypaste
# Shares the process list
```

### Edit and Share
```bash
easypaste -e
# Opens your default editor ($EDITOR, $VISUAL, or nano/vi)
```

### Private Server
```bash
easypaste --server https://your-server.com "private paste"
```

## 🔧 Configuration

### Environment Variables

- `EDITOR` or `VISUAL`: Your preferred editor for `-e` flag
- Default: `nano` (Linux/macOS) or `notepad` (Windows)

### Custom Share Codes

- **Length**: 4-50 characters
- **Allowed**: Letters, numbers, underscore (`_`), hyphen (`-`)
- **Validation**: Client-side validation before API call

## 🖼️ QR Code

QR codes are displayed by default for easy mobile sharing:

```
█████████████████████████████████████
█████████████████████████████████████
████ ▄▄▄▄▄ ██▀▄█▀ ▀▀▄▀▀▄▀█ ▄▄▄▄▄ ████
████ █   █ ███▀ █ ▀▀▄▄ ▄▄█ █   █ ████
████ █▄▄▄█ █▀█▀▄█  █▄█ ▀ █ █▄▄▄█ ████
...
```

Disable with `--no-qr` flag if not needed.

## 📱 Integration

### Shell Aliases
```bash
# Add to ~/.bashrc or ~/.zshrc
alias paste='easypaste'
alias qr='easypaste'  # Always shows QR
alias nqr='easypaste --no-qr'  # Never shows QR
```

### Git Integration
```bash
# Share git diff
git diff | easypaste --code "my-changes"

# Share commit message
git log --oneline -5 | easypaste
```

## 🛠️ Development

### Building
```bash
cargo build --release
```

### Testing
```bash
cargo test
```

### Cross-compilation
```bash
# Linux target
cargo build --release --target x86_64-unknown-linux-gnu

# Windows target  
cargo build --release --target x86_64-pc-windows-gnu

# macOS target
cargo build --release --target x86_64-apple-darwin
```

## 🐛 Troubleshooting

### Command Not Found
```bash
# Check if binary is in PATH
which easypaste

# If not, add to PATH or use full path
export PATH="$PATH:/usr/local/bin"
```

### Permission Denied
```bash
# Make executable
chmod +x easypaste
```

### Connection Errors
```bash
# Test connectivity
curl https://easypaste.xyz/health

# Use custom server
easypaste --server http://localhost:3000 "test"
```

### Custom Code Already Exists
```bash
# Error: Custom code already exists
# Solution: Use a different code or let it auto-generate
easypaste "content"  # Auto-generates code
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔗 Related

- [EasyPaste Web App](https://easypaste.xyz)
- [Backend API Documentation](../backend/README.md)
- [Main Repository](https://github.com/wcmoon/easypaste)

## 📊 Stats

- **Language**: Rust
- **Dependencies**: Minimal (clap, reqwest, qrcode, colored)
- **Binary Size**: ~2MB
- **Startup Time**: ~5ms
- **Memory Usage**: ~1MB