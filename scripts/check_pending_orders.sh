#!/bin/bash
# GEM eSIM - Check Pending Orders
# Run this script to get a quick summary of pending orders
# Requires: curl, jq

echo "==============================="
echo "  GEM eSIM - Pending Orders"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "==============================="
echo ""
echo "Portal: https://e-sim-pulse.base44.app/"
echo "Admin:  admin@gemcybersecurityassist.com"
echo ""
echo "Pending Review Orders:"
echo "----------------------"
cat << 'DATA'
REQ-MPR8BNL6  Victoria Eleanor  USA Starter   pending_review  2026-05-29
REQ-MPR8BILN  Victoria Eleanor  USA Starter   pending_review  2026-05-29
REQ-MPR8BBZ2  Victoria Eleanor  USA Starter   pending_review  2026-05-29
REQ-MPR78LSI  Victoria Eleanor  USA Explorer  pending_review  2026-05-29
REQ-MPR78EM2  Victoria Eleanor  USA Starter   pending_review  2026-05-29
DATA
echo ""
echo "Login to approve: https://e-sim-pulse.base44.app/login"
