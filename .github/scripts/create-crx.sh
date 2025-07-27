#!/bin/bash

# This script creates a CRX package for the Chrome extension.

set -e

# Get the absolute path of the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "${SCRIPT_DIR}/../.." && pwd )"

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

# 2. Define variables with absolute paths
EXTENSION_SRC_DIR="${PROJECT_ROOT}/dist"
OUTPUT_NAME="infynium-focus"
BUILD_DIR="${PROJECT_ROOT}/build"

ZIP_NAME="${OUTPUT_NAME}.zip"
ZIP_FILE_PATH="${BUILD_DIR}/${ZIP_NAME}"

CRX_NAME="${OUTPUT_NAME}.crx"
CRX_PATH="${BUILD_DIR}/${CRX_NAME}"

# 3. Ensure the build directory exists
echo "Creating build directory: ${BUILD_DIR}"
mkdir -p "${BUILD_DIR}"

# Process the signing key
SIGNING_KEY_PATH=""
if [ -n "${CHROME_CRX_SIGNING_KEY}" ]; then
  # Check if CHROME_CRX_SIGNING_KEY is a valid file path
  if [ -f "${CHROME_CRX_SIGNING_KEY}" ]; then
    echo "Using key file from env variable: ${CHROME_CRX_SIGNING_KEY}"
    SIGNING_KEY_PATH="${CHROME_CRX_SIGNING_KEY}"
  else
    # Assume CHROME_CRX_SIGNING_KEY contains the key content
    echo "Environment variable contains key content, creating temporary key file"
    SIGNING_KEY_PATH="${BUILD_DIR}/temp_key.pem"
    # Write key content to a temporary file
    echo "${CHROME_CRX_SIGNING_KEY}" > "${SIGNING_KEY_PATH}"
    # Ensure the file has proper permissions
    chmod 600 "${SIGNING_KEY_PATH}"
  fi
else
  # Try to use a local file if available
  echo "No signing key found in environment variables."
  SIGNING_KEY_PATH="${PROJECT_ROOT}/key.pem"
  if [ ! -f "${SIGNING_KEY_PATH}" ]; then
    echo "Warning: No signing key found. Will create an unsigned ZIP package only."
    SIGNING_KEY_PATH=""
  else
    echo "Using local key file: ${SIGNING_KEY_PATH}"
  fi
fi

# Clean the build directory but preserve the temporary key file if it exists
echo "Cleaning build directory..."
if [ -f "${BUILD_DIR}/temp_key.pem" ]; then
  # Save the key content
  KEY_CONTENT=$(cat "${BUILD_DIR}/temp_key.pem")

  # Clean the directory
  rm -rf "${BUILD_DIR}"/*

  # Restore the key file
  echo "${KEY_CONTENT}" > "${BUILD_DIR}/temp_key.pem"
  chmod 600 "${BUILD_DIR}/temp_key.pem"
else
  # No key to preserve, clean everything
  rm -rf "${BUILD_DIR}"/*
fi

# We'll continue even without a signing key to create the ZIP package
CREATE_CRX=true
if [ -z "${SIGNING_KEY_PATH}" ]; then
  echo "No valid signing key available. Will create ZIP package only."
  CREATE_CRX=false
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
# Change to the extension directory and zip the contents
(cd "${EXTENSION_SRC_DIR}" && zip -r "${ZIP_FILE_PATH}" .) || {
  echo "Error: Failed to create ZIP file."
  exit 1
}

# 6. Build the CRX package if we have a signing key
if [ "${CREATE_CRX}" = true ]; then
  echo "Creating CRX package using the 'crx' utility..."

  # Use absolute paths with the crx command without changing directory
  crx pack "${EXTENSION_SRC_DIR}" -o "${CRX_PATH}" -p "${SIGNING_KEY_PATH}" || {
    echo "Error: Failed to create CRX file."
    # Continue with the script even if CRX creation fails
    # We'll still have the ZIP package
  }

  # Clean up temporary key file if we created one
  if [[ "${SIGNING_KEY_PATH}" == "${BUILD_DIR}/temp_key.pem" ]]; then
    echo "Cleaning up temporary key file"
    rm -f "${SIGNING_KEY_PATH}"
  fi
else
  echo "Warning: No signing key provided. CRX package was not created."
fi

echo "--- Build Successful! ---"
echo "ZIP file created at: ${ZIP_FILE_PATH}"
if [ -f "${CRX_PATH}" ]; then
  echo "CRX file created at: ${CRX_PATH}"
fi

