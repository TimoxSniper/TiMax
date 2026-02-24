#!/bin/bash

# Push Script für TiMAx Onboarding Feature
# Dieses Script pusht den Commit mit Ihren GitHub Credentials

echo "🚀 Pushing Onboarding Feature to GitHub..."
echo ""
echo "Bitte geben Sie Ihre GitHub Credentials ein:"
echo "Username: TimoxSniper"
echo "Password: [Ihr GitHub Personal Access Token]"
echo ""

git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Push erfolgreich!"
    echo "🎉 Onboarding Feature ist jetzt auf GitHub!"
else
    echo ""
    echo "❌ Push fehlgeschlagen."
    echo "Bitte prüfen Sie Ihre Credentials."
fi
