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
        git commit -m 'Improve calculator accuracy and launch bilingual search pages'
        Assert-Success 'Commit'
    } elseif ($LASTEXITCODE -ne 0) {
        throw 'Could not inspect staged changes.'
    }

    git push origin main
    Assert-Success 'Push'
    Write-Host 'Push succeeded using mukeshs555. Check Cloudflare Pages for deployment completion.'
    Write-Host 'A successful push alone does not verify the live deployment.'
    $liveConfirmed = $false
    for ($attempt = 0; $attempt -lt 12; $attempt++) {
        try {
            $release = Invoke-RestMethod -Uri ('https://sahifayda.pages.dev/release.json?check=' + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()) -TimeoutSec 15
            if ($release.release -eq 'calculator-search-2026-11-10' -and $release.indexable -eq $true) {
                $response = Invoke-WebRequest -UseBasicParsing -Uri 'https://sahifayda.pages.dev/cashback-discount-calculator/' -TimeoutSec 15
                $robotsHeader = $response.Headers['X-Robots-Tag'] -join ','
                $sitemap = Invoke-WebRequest -UseBasicParsing -Uri 'https://sahifayda.pages.dev/sitemap.xml' -TimeoutSec 15
                if ($response.StatusCode -eq 200 -and $robotsHeader -notmatch 'noindex' -and $response.Content -notmatch 'name="robots" content="noindex' -and $response.Content -match 'Cashback vs Instant Discount' -and $sitemap.Content -match '/hi/cashback-discount-calculator/') {
                    $liveConfirmed = $true
                    Write-Host 'LIVE VERIFIED: updated shopping page, bilingual sitemap and public indexing are available.'
                    break
                }
            }
        } catch {
            Write-Host ('Deployment not verified yet (attempt ' + ($attempt + 1) + ').')
        }
        if ($attempt -lt 11) { Start-Sleep -Seconds 10 }
    }
    if (-not $liveConfirmed) {
        Write-Warning 'Push succeeded, but live deployment is not verified. Check the Cloudflare deployment and ensure production SAHIFAYDA_INDEXABLE is true. Do not assume the live site updated.'
    }
} finally {
    Pop-Location
}
