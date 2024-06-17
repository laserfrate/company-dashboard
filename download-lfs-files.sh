#!/bin/bash

# Exit on first error
set -e

# Print each command before executing it
set -x

# Install git-lfs
curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
sudo apt-get install git-lfs

# Fetch all LFS objects
git lfs install
git lfs fetch
git lfs checkout

# Debug: list the contents of the data directory
ls -al /app/client/public/data/
