# This script attempts to download audio files for the TiMax project.
# It uses Invoke-WebRequest, which might require appropriate network access.

# Create the directory if it doesn't exist
$targetDir = "docs/Audios"
if (-not (Test-Path $targetDir)) {
    mkdir $targetDir
    Write-Host "Created directory: $targetDir"
} else {
    Write-Host "Directory already exists: $targetDir"
}

# --- Download files ---

Write-Host "Attempting to download bier.mp3..."
Invoke-WebRequest -Uri "https://slowgerman.com/musica/bier.mp3" -OutFile "$targetDir/bier.mp3" -ErrorAction SilentlyContinue

Write-Host "Attempting to download kurzgeschichte.mp3..."
Invoke-WebRequest -Uri "https://www.archive.org/download/kurze_prosa_038_1410_librivox/prosa038_01_ebner-eschenbach_64kb.mp3" -OutFile "$targetDir/kurzgeschichte.mp3" -ErrorAction SilentlyContinue

Write-Host "Attempting to download kaffeemaschine.ogg..."
Invoke-WebRequest -Uri "https://upload.wikimedia.org/wikipedia/commons/4/47/De-Kaffeemaschine-article.ogg" -OutFile "$targetDir/kaffeemaschine.ogg" -ErrorAction SilentlyContinue

Write-Host "Download attempts finished. Please check the '$targetDir' directory for the downloaded files."
