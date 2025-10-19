#!/bin/bash

for size in 16 32 48 64 128; do
    convert ./test-icon.png -resize ${size}x${size} icons/test-${size}.png
done
