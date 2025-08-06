#!/bin/bash

echo "Building EasyPaste CLI..."

# Build for current platform
cargo build --release

echo "✅ Build complete!"
echo "📁 Binary location: target/release/easypaste"
echo ""
echo "🚀 Installation options:"
echo "  Local install:  sudo cp target/release/easypaste /usr/local/bin/"
echo "  Symlink alias:  sudo ln -s /usr/local/bin/easypaste /usr/local/bin/ep"
echo ""
echo "📖 Documentation: https://github.com/wcmoon/easypaste/tree/main/easypaste-cli"