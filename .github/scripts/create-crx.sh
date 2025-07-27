#!/bin/bash

# This script creates a CRX package for the Chrome extension.

set -e

# 1. Install dependencies - zip
# Check if zip is installed, if not, try to install it
if ! command -v zip &> /dev/null; then
  echo "zip not found, attempting to install..."
  if command -v apt-get &> /dev/null; then
    apt-get update && apt-get install -y zip
  elif command -v yum &> /dev/null; then
    yum install -y zip
  elif command -v brew &> /dev/null; then
    brew install zip
  else
    echo "Error: Could not install zip. Please install it manually."
    exit 1
  fi
fi

# 2. Define variables
EXTENSION_SRC_DIR="./dist"
OUTPUT_NAME="infynium-focus"
BUILD_DIR="./build"

ZIP_NAME="${OUTPUT_NAME}.zip"
ZIP_FILE_PATH="${BUILD_DIR}/${ZIP_NAME}"

CRX_NAME="${OUTPUT_NAME}.crx"
CRX_PATH="${BUILD_DIR}/${CRX_NAME}"

# Check if the signing key is provided as an environment variable
if [ -z "${CHROME_CRX_SIGNING_KEY}" ]; then
  echo "No signing key found in environment variables."
  # Try to use a local file if available
  SIGNING_KEY_FILE="./key.pem"
  if [ -f "${SIGNING_KEY_FILE}" ]; then
    echo "Using local key file: ${SIGNING_KEY_FILE}"
    CHROME_CRX_SIGNING_KEY="${SIGNING_KEY_FILE}"
  else
    echo "Warning: No signing key found. Will create an unsigned ZIP package only."
  fi
fi

# 3. Ensure all the necessary directories exist and secrets are set
echo "Creating clean build directory: ${BUILD_DIR}"
rm -rf "${BUILD_DIR}"
mkdir -p "${BUILD_DIR}"

if [ -z "${CHROME_CRX_SIGNING_KEY}" ]; then
  echo "Error: CHROME_CRX_SIGNING_KEY is not set."
  exit 1
fi

# 4. Check if crx utility is available (pnpm package)
if ! command -v crx &> /dev/null; then
  echo "The 'crx' utility is not found. Attempting to install..."
  pnpm install -g crx || {
    echo "Failed to install 'crx' package. Please install it manually: pnpm install -g crx";
    exit 1;
  }
fi

# 5. Create the ZIP package first
echo "Creating ZIP package..."
zip -r "${ZIP_FILE_PATH}" "${EXTENSION_SRC_DIR}"/* || {
  echo "Error: Failed to create ZIP file."
  exit 1
}

# 6. Build the CRX package if we have a signing key
if [ -n "${CHROME_CRX_SIGNING_KEY}" ]; then
  echo "Creating CRX package using the 'crx' utility..."

  cd "${EXTENSION_SRC_DIR}" || exit 1
  crx pack -o "${CRX_PATH}" -p "${CHROME_CRX_SIGNING_KEY}" || {
    echo "Error: Failed to create CRX file."
    exit 1
  }
else
  echo "Warning: No signing key provided. CRX package was not created."
fi

echo "--- Build Successful! ---"
echo "ZIP file created at: ${ZIP_FILE_PATH}"
if [ -f "${CRX_PATH}" ]; then
  echo "CRX file created at: ${CRX_PATH}"
fi

