$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$projectRoot = Split-Path -Parent $PSScriptRoot

function Assert-Success([string] $operation) {
    if ($LASTEXITCODE -ne 0) { throw "$operation failed. Nothing further will be published." }
}

Push-Location -LiteralPath $projectRoot
try {
    gh auth switch --hostname github.com --user mukeshs555
    Assert-Success 'Selecting mukeshs555'
    $account = gh api user --jq .login
    Assert-Success 'Verifying GitHub identity'
    if ($account.Trim() -ne 'mukeshs555') { throw 'Expected GitHub account mukeshs555.' }

    $branch = git branch --show-current
    Assert-Success 'Reading branch'
    if ($branch.Trim() -ne 'main') { throw 'Expected main branch. Existing branch was preserved.' }
    $remote = git remote get-url origin
    Assert-Success 'Reading remote'
    if ($remote.Trim() -ne 'https://mukeshs555@github.com/pavanikumari555/sahifayda.git') {
        throw 'Unexpected origin URL. Review it before publishing.'
    }

    # Repository settings only: do not change other projects or stored credentials.
    git config --local credential.https://github.com.username mukeshs555
    Assert-Success 'Saving repository GitHub account'
    git config --local user.name 'Mukesh Singhal'
    Assert-Success 'Saving author name'
    git config --local user.email 'mukeshs555@users.noreply.github.com'
    Assert-Success 'Saving author email'

    $staged = @(git diff --cached --name-only)
    Assert-Success 'Checking staging area'
    if ($staged.Count -gt 0) { throw 'Existing staged changes found. Preserve/review them before running this script.' }

    git fetch origin main
    Assert-Success 'Fetching main'
    git merge-base --is-ancestor origin/main HEAD
    Assert-Success 'Checking for concurrent remote changes (sync/review first if this fails)'

    npm.cmd test
    Assert-Success 'Tests'
    npm.cmd run build
    Assert-Success 'Production build and static-export security verification'

    # Check again after the build; normal push also rejects concurrent updates.
    git fetch origin main
    Assert-Success 'Rechecking remote main'
    git merge-base --is-ancestor origin/main HEAD
    Assert-Success 'Checking remote changes after build'

    $files = @(
        'CONTINUE-HERE.md',
        'app/HomeLoanCalculator.js',
        'app/CreditCardDebtTrapCalculator.js',
        'app/EmergencyFundCalculator.js',
        'lib/calculator-math.mjs',
        'tests/calculator-math.test.mjs',
        'next.config.mjs',
        'scripts/publish-fixes.ps1'
    )
    git add -- $files
    Assert-Success 'Staging reviewed fixes'
    git diff --cached --quiet
    if ($LASTEXITCODE -eq 1) {
        git commit -m 'Fix calculator comparisons, repayment estimates and export configuration'
        Assert-Success 'Commit'
    } elseif ($LASTEXITCODE -ne 0) {
        throw 'Could not inspect staged changes.'
    }

    git push origin main
    Assert-Success 'Push'
    Write-Host 'Push succeeded using mukeshs555. Check Cloudflare Pages for deployment completion.'
    Write-Host 'A successful push alone does not verify the live deployment.'
} finally {
    Pop-Location
}
