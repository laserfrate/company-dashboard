#!/bin/bash

# Exit on first error
set -e

# Print each command before executing it
set -x

# Fetch all LFS objects
git lfs install
git lfs fetch
git lfs checkout
