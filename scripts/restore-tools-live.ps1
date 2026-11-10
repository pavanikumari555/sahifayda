$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$projectRoot = Split-Path -Parent $PSScriptRoot
function Assert-RollbackSuccess([string] $step) {
    if ($LASTEXITCODE -ne 0) { throw "$step failed. Publishing stopped." }
}
Push-Location -LiteralPath $projectRoot
try {
    $branch = git branch --show-current
    Assert-RollbackSuccess 'Reading branch'
    if ($branch.Trim() -ne 'main') { throw 'Expected main; current branch was preserved.' }
    $remote = git remote get-url origin
    Assert-RollbackSuccess 'Reading origin'
    if ($remote.Trim() -ne 'https://mukeshs555@github.com/pavanikumari555/sahifayda.git') { throw 'Unexpected origin; no changes published.' }
    gh auth switch --hostname github.com --user mukeshs555
    Assert-RollbackSuccess 'Selecting mukeshs555'
    $account = gh api user --jq .login
    Assert-RollbackSuccess 'Verifying GitHub account (check connectivity or run gh auth login if needed)'
    if ($account.Trim() -ne 'mukeshs555') { throw 'Expected mukeshs555.' }
    $staged = @(git diff --cached --name-only)
    Assert-RollbackSuccess 'Inspecting staging area'
    if ($staged.Count -gt 0) { throw 'Existing staged edits preserved. Review them before publishing.' }
    git fetch origin main
    Assert-RollbackSuccess 'Fetching latest main'
    git merge-base --is-ancestor origin/main HEAD
    Assert-RollbackSuccess 'Checking concurrent remote changes (review and sync first if this fails)'
    $files = @('PRODUCT-REQUIREMENTS.md','CONTINUE-HERE.md','app/ui.js','app/tool-page.js','app/tool-page.css','tests/tool-render.test.mjs','scripts/restore-tools-live.ps1')
    foreach ($component in @('HomeLoanCalculator','EmergencyFundCalculator','CreditCardDebtTrapCalculator','SmartCardOfferCalculator','StudentCardFinder','CarVsUberCalculator')) {
        $files += "app/$component.js"
    }
    foreach ($prefix in @('app','app/hi')) {
        foreach ($route in @('home-loan-calculator','emergency-fund','debt-trap-calculator','student-credit-cards','car-vs-uber','cashback-discount-calculator')) {
            $files += "$prefix/$route/page.js"
        }
    }
    $changed = @(git diff --name-only)
    Assert-RollbackSuccess 'Inspecting tracked edits'
    $otherEdits = @($changed | Where-Object { $files -notcontains $_ })
    if ($otherEdits.Count -gt 0) { throw ('Other edits preserved; review first: ' + ($otherEdits -join ', ')) }
    npm.cmd test
    Assert-RollbackSuccess 'Tests'
    $env:SAHIFAYDA_INDEXABLE = 'true'
    $env:SAHIFAYDA_PUBLIC_SITE_URL = 'https://sahifayda.pages.dev'
    npm.cmd run build
    Assert-RollbackSuccess 'Production build and export verification'
    git -c user.name='Mukesh Singhal' -c user.email='mukeshs555@users.noreply.github.com' --literal-pathspecs add -- $files
    Assert-RollbackSuccess 'Staging only the tools rollback'
    git diff --cached --quiet
    if ($LASTEXITCODE -eq 1) {
        git -c user.name='Mukesh Singhal' -c user.email='mukeshs555@users.noreply.github.com' commit -m 'Restore original six calculators and tool journeys'
        Assert-RollbackSuccess 'Committing tools rollback'
    } elseif ($LASTEXITCODE -ne 0) { throw 'Could not inspect staged rollback.' }
    git -c credential.https://github.com.username=mukeshs555 push origin main
    Assert-RollbackSuccess 'Pushing as mukeshs555'
    & (Join-Path $PSScriptRoot 'deploy-live.ps1')
} finally {
    Pop-Location
}
