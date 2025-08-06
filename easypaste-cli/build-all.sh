#!/bin/bash

echo "🔨 Building EasyPaste CLI for all platforms..."

# Create dist directory
mkdir -p dist

# Build for Linux (x86_64)
echo "📦 Building for Linux x86_64..."
cargo build --release --target x86_64-unknown-linux-gnu
cp target/x86_64-unknown-linux-gnu/release/easypaste dist/easypaste-linux

# Build for macOS (x86_64)
echo "📦 Building for macOS x86_64..."
cargo build --release --target x86_64-apple-darwin
cp target/x86_64-apple-darwin/release/easypaste dist/easypaste-macos

# Build for Windows (x86_64)
echo "📦 Building for Windows x86_64..."
cargo build --release --target x86_64-pc-windows-gnu
cp target/x86_64-pc-windows-gnu/release/easypaste.exe dist/easypaste-windows.exe

echo ""
echo "✅ All builds complete!"
echo "📁 Binaries available in dist/ directory:"
ls -la dist/
echo ""
echo "🚀 Ready for release!"
echo "📖 Documentation: https://github.com/wcmoon/easypaste/tree/main/easypaste-cli"