param(
    [string]$ProjectPath = 'C:\Coding\TriShift\TriShift - Admin\web'
)
$ErrorActionPreference = 'Stop'
$source = $PSScriptRoot
$project = [System.IO.Path]::GetFullPath($ProjectPath)
if (-not (Test-Path -LiteralPath (Join-Path $project 'artisan') -PathType Leaf) -or
    -not (Test-Path -LiteralPath (Join-Path $project 'composer.json') -PathType Leaf)) {
    throw "Not a Laravel project root: $project. Use -ProjectPath to specify the folder containing artisan and composer.json."
}
$gitDir = $null
try {
    $gitDir = (& git -C $project rev-parse --absolute-git-dir 2>$null | Select-Object -First 1)
} catch { $gitDir = $null }
if (-not $gitDir -or -not (Test-Path -LiteralPath $gitDir -PathType Container)) {
    Write-Warning 'Git repository not detected. The AI files will be created, but local Git excludes cannot be set automatically.'
}
# Exclude local-only AI instructions before creating them. No git add/commit/push.
if ($gitDir) {
    $exclude = Join-Path $gitDir 'info\exclude'
    $excludeParent = Split-Path $exclude -Parent
    New-Item -ItemType Directory -Path $excludeParent -Force | Out-Null
    if (-not (Test-Path -LiteralPath $exclude)) { New-Item -ItemType File -Path $exclude | Out-Null }
    $current = @(Get-Content -LiteralPath $exclude)
    foreach ($line in @('/AGENTS.md', '/AI-README.md', '/.agents/')) {
        if ($current -notcontains $line) { Add-Content -LiteralPath $exclude -Value $line }
    }
    Write-Host 'Local Git excludes set for the AI instruction files.' -ForegroundColor Green
}
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupRoot = if ($gitDir) { Join-Path $gitDir "trishift-ai-backups\$stamp" } else { Join-Path $env:LOCALAPPDATA "TriShift-AI-Backups\$stamp" }
$files = @('README.md', 'AGENTS.md', 'AI-README.md', '.agents/skills/trishift-admin-frontend/SKILL.md')
foreach ($relative in $files) {
    $src = Join-Path $source ($relative.Replace('/', [IO.Path]::DirectorySeparatorChar))
    $dst = Join-Path $project ($relative.Replace('/', [IO.Path]::DirectorySeparatorChar))
    if (-not (Test-Path -LiteralPath $src -PathType Leaf)) { throw "File missing in extracted package: $src" }
    if (Test-Path -LiteralPath $dst -PathType Leaf) {
        $oldHash = (Get-FileHash -LiteralPath $dst -Algorithm SHA256).Hash
        $newHash = (Get-FileHash -LiteralPath $src -Algorithm SHA256).Hash
        if ($oldHash -eq $newHash) { Write-Host "Already current: $relative"; continue }
        $backup = Join-Path $backupRoot ($relative.Replace('/', [IO.Path]::DirectorySeparatorChar))
        New-Item -ItemType Directory -Path (Split-Path $backup -Parent) -Force | Out-Null
        Copy-Item -LiteralPath $dst -Destination $backup -Force
        Write-Host "Backed up existing file: $relative" -ForegroundColor Yellow
    }
    New-Item -ItemType Directory -Path (Split-Path $dst -Parent) -Force | Out-Null
    Copy-Item -LiteralPath $src -Destination $dst -Force
    Write-Host "Installed: $relative" -ForegroundColor Green
}
Write-Host "`nReady: $project" -ForegroundColor Green
Write-Host 'No Git staging, commits, pushes, pulls, or PRs were performed.'
Write-Host 'README.md is intended for team sharing; AI instruction files are local-only.'
if (Test-Path $backupRoot) { Write-Host "Backups: $backupRoot" }
