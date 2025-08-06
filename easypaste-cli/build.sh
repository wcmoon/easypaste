#!/bin/bash

echo "Building EasyPaste CLI..."

cargo build --release

mkdir -p ../backend/public/downloads

cp target/release/easypaste ../backend/public/downloads/easypaste-macos

echo "Build complete! Binary available at ../backend/public/downloads/easypaste-macos"