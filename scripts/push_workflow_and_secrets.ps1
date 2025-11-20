<#
PowerShell helper: move workflow to repo root and push, optionally set GitHub secrets via gh CLI.

Usage (from repository root):
  pwsh .\my-bsc-token\scripts\push_workflow_and_secrets.ps1

What it does:
- Moves my-bsc-token\.github\workflows\deploy-bsc-testnet.yml to .github\workflows\deploy-bsc-testnet.yml
- Stages, commits and pushes the change to the current branch (asks for commit message)
- Optionally sets repository secrets using `gh secret set` if you choose to and GH CLI is authenticated

Security: this script does NOT print secret values. It reads secret values from interactive prompts or environment variables.
#>

param(
    [string]$RepoRoot = (Get-Location).Path,
    [string]$WorkflowRelPath = "my-bsc-token\.github\workflows\deploy-bsc-testnet.yml",
    [string]$DestRelPath = ".github\workflows\deploy-bsc-testnet.yml"
)

function Push-Info([string]$m) { Write-Host $m -ForegroundColor Cyan }
function Push-Error([string]$m) { Write-Host $m -ForegroundColor Red }

Push-Info "Repo root: $RepoRoot"

$src = Join-Path $RepoRoot $WorkflowRelPath
$dest = Join-Path $RepoRoot $DestRelPath

if (-not (Test-Path $src)) {
    Push-Error "Source workflow not found at $src. Ensure you generated the workflow in my-bsc-token/.github/workflows first."
    exit 1
}

New-Item -ItemType Directory -Path (Split-Path $dest) -Force | Out-Null

Move-Item -Path $src -Destination $dest -Force
Push-Info "Moved workflow to $dest"

# Git commit & push
Push-Info "Staging and committing change..."
git add $dest
$msg = Read-Host "Commit message (enter to use default)"
if ([string]::IsNullOrWhiteSpace($msg)) { $msg = "chore(ci): add deploy-bsc-testnet workflow" }
git commit -m "$msg"
Push-Info "Pushing to remote..."
git push

# Optionally set secrets
$setSecrets = Read-Host "Would you like to set common GitHub secrets now via gh CLI? (y/N)"
if ($setSecrets -match '^[Yy]') {
    if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
        Push-Error "gh CLI not found in PATH. Install and authenticate with 'gh auth login' first."
        exit 1
    }

    $repo = Read-Host "Repo slug (owner/repo), e.g. html-crm/OnemeemChain"
    if ([string]::IsNullOrWhiteSpace($repo)) { Push-Error "Repo slug required"; exit 1 }

    # helper to set a secret either from env var or prompt
    function Set-SecretInteractive([string]$name) {
        $envVal = [Environment]::GetEnvironmentVariable($name)
        if (-not [string]::IsNullOrEmpty($envVal)) {
            Push-Info "Setting secret $name from environment variable"
            gh secret set $name --body $envVal --repo $repo
            return
        }
        $val = Read-Host "Enter value for secret $name (leave blank to skip)"
        if (-not [string]::IsNullOrEmpty($val)) {
            gh secret set $name --body $val --repo $repo
            Push-Info "Secret $name set"
        } else { Push-Info "Skipped $name" }
    }

    $secrets = @('PRIVATE_KEY','BSC_TESTNET_RPC','BSCSCAN_API_KEY','PCS_ROUTER','WBNB','LIQ_TOKEN','LIQ_BNB','SSH_PRIVATE_KEY','SERVER_HOST','SERVER_USER')
    foreach ($s in $secrets) { Set-SecretInteractive $s }
}

Push-Info "Done. If you moved the workflow to the repo root successfully, open the Actions tab on GitHub and run the 'Deploy to BSC Testnet' workflow or use 'gh workflow run' to dispatch it." 
