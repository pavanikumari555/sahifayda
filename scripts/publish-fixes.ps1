param([switch] $DeployOnly)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$projectRoot = Split-Path -Parent $PSScriptRoot
if ($DeployOnly) {
    & (Join-Path $PSScriptRoot 'deploy-live.ps1')
    return
}

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

    # The owner approved indexing on the existing public origin for this release.
    $env:SAHIFAYDA_INDEXABLE = 'true'
    $env:SAHIFAYDA_PUBLIC_SITE_URL = 'https://sahifayda.pages.dev'
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
        '.env.example',
        '.github/workflows/daily-offer-sync.yml',
        '.github/workflows/seo-ping.yml',
        'SOURCE-AUTOMATION.md',
        'app/shopping-offer-finder.js',
        'app/admin/shopping-offers.js',
        'app/admin/products.js',
        'supabase/functions/_shared/shopping-offers.mjs',
        'supabase/functions/_shared/directory-advisor.mjs',
        'supabase/functions/_shared/sia-advisor.mjs',
        'tests/shopping-offers.test.mjs',
        'tests/directory.test.mjs',
        'app/admin/finance-monitor.js',
        'app/admin/panel.js',
        'app/admin/seo-controls.js',
        'app/finance-updates.js',
        'lib/finance-knowledge.mjs',
        'lib/product-directory.mjs',
        'scripts/verify-finance-health.mjs',
        'supabase/functions/_shared/card-sources.mjs',
        'supabase/functions/_shared/finance-sync.mjs',
        'supabase/functions/_shared/live-card-data.mjs',
        'supabase/functions/_shared/finance-sources.mjs',
        'supabase/functions/_shared/product-directory.mjs',
        'supabase/functions/_shared/source-rules.mjs',
        'supabase/functions/finance-refresh/index.ts',
        'supabase/functions/admin-console/index.ts',
        'supabase/functions/sia-guide/index.ts',
        'tests/admin-api.test.mjs',
        'tests/conversation.test.mjs',
        'tests/finance-automation.test.mjs',
        'README.md',
        'PRODUCT-REQUIREMENTS.md',
        'CONTINUE-HERE.md',
        'app/HomeLoanCalculator.js',
        'app/CreditCardDebtTrapCalculator.js',
        'app/EmergencyFundCalculator.js',
        'app/CarVsUberCalculator.js',
        'app/SmartCardOfferCalculator.js',
        'app/StudentCardFinder.js',
        'app/calculator-fields.js',
        'app/calculator-fields.css',
        'app/ui.js',
        'app/tool-page.js',
        'app/tool-page.css',
        'app/guide-article.js',
        'app/info-page.js',
        'app/[info]/page.js',
        'app/hi/[info]/page.js',
        'app/home-loan-calculator/page.js',
        'app/hi/home-loan-calculator/page.js',
        'app/emergency-fund/page.js',
        'app/hi/emergency-fund/page.js',
        'app/car-vs-uber/page.js',
        'app/hi/car-vs-uber/page.js',
        'app/student-credit-cards/page.js',
        'app/hi/student-credit-cards/page.js',
        'app/debt-trap-calculator/page.js',
        'app/hi/debt-trap-calculator/page.js',
        'app/cashback-discount-calculator/page.js',
        'app/hi/cashback-discount-calculator/page.js',
        'lib/calculator-math.mjs',
        'lib/calculator-products.mjs',
        'lib/tool-content.mjs',
        'lib/info-pages.mjs',
        'lib/tool-routes.mjs',
        'lib/site-config.mjs',
        'tests/calculator-math.test.mjs',
        'tests/calculator-review.test.mjs',
        'tests/tool-render.test.mjs',
        'tests/security.test.mjs',
        'scripts/secure-export.mjs',
        'scripts/verify-export.mjs',
        'scripts/deploy-live.ps1',
        'next.config.mjs',
        'scripts/publish-fixes.ps1'
    )
    $changed = @(git diff --name-only)
    Assert-Success 'Inspecting local changes'
    $unrelated = @($changed | Where-Object { $files -notcontains $_ })
    if ($unrelated.Count -gt 0) { throw ('Other tracked edits were preserved. Review these first: ' + ($unrelated -join ', ')) }
    git --literal-pathspecs add -- $files
    Assert-Success 'Staging reviewed fixes'
    git diff --cached --quiet
    if ($LASTEXITCODE -eq 1) {
        git commit -m 'Connect reviewed finance refresh to calculators and source review queue'
        Assert-Success 'Commit'
    } elseif ($LASTEXITCODE -ne 0) {
        throw 'Could not inspect staged changes.'
    }

    git push origin main
    Assert-Success 'Push'
    Write-Host 'Push succeeded using mukeshs555. Deploying the verified export to Cloudflare Pages.'
    & (Join-Path $PSScriptRoot 'deploy-live.ps1')
} finally {
    Pop-Location
}
