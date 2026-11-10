$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$projectRoot = Split-Path -Parent $PSScriptRoot
function Assert-DeploySuccess([string] $operation) {
    if ($LASTEXITCODE -ne 0) { throw "$operation failed. No further deployment steps were run." }
}
Push-Location -LiteralPath $projectRoot
try {
    node scripts/verify-export.mjs
    Assert-DeploySuccess 'Verifying the existing production export'
    $release = Get-Content -LiteralPath 'out/release.json' -Raw | ConvertFrom-Json
    if ($release.origin -ne 'https://sahifayda.pages.dev' -or $release.indexable -ne $true) {
        throw 'Expected the approved indexable sahifayda.pages.dev export. Rebuild before deploying.'
    }
    git diff --quiet HEAD -- app lib public next.config.mjs package.json package-lock.json scripts/secure-export.mjs scripts/verify-export.mjs
    Assert-DeploySuccess 'Checking for unpublished application changes (use the full publish script if this fails)'

    # Use the official version already present in this machine's npm cache.
    $projectsJson = npx.cmd --yes wrangler@4.153.0 pages project list --json
    Assert-DeploySuccess 'Reading existing Cloudflare projects (run npx wrangler login if authentication is required)'
    $projects = @($projectsJson | ConvertFrom-Json)
    $matches = @($projects | Where-Object { $_.'Project Name' -eq 'sahifayda' })
    if ($matches.Count -ne 1) {
        throw 'The existing sahifayda project was not uniquely found in the selected Cloudflare account. No new project will be created.'
    }
    if (@($matches[0].'Project Domains' -split ',\s*') -notcontains 'sahifayda.pages.dev') {
        throw 'The existing project does not list the expected sahifayda.pages.dev domain. No upload was attempted.'
    }
    Write-Host ('Existing project found. Git integration: ' + $matches[0].'Git Provider' + '. Uploading the main-branch assets.')
    npx.cmd --yes wrangler@4.153.0 pages deploy out --project-name=sahifayda --branch=main
    Assert-DeploySuccess 'Uploading the verified export to the existing Cloudflare Pages project'

    $confirmed = $false
    for ($attempt = 1; $attempt -le 12; $attempt++) {
        try {
            $live = Invoke-RestMethod -Uri ('https://sahifayda.pages.dev/release.json?check=' + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()) -TimeoutSec 15
            if ($live.release -ne $release.release -or $live.indexable -ne $true) {
                Write-Host ('Live marker differs from the uploaded release (attempt ' + $attempt + ').')
            } else {
                $page = Invoke-WebRequest -UseBasicParsing -Uri 'https://sahifayda.pages.dev/cashback-discount-calculator/' -TimeoutSec 15
                $robots = $page.Headers['X-Robots-Tag'] -join ','
                $sitemap = Invoke-WebRequest -UseBasicParsing -Uri 'https://sahifayda.pages.dev/sitemap.xml' -TimeoutSec 15
                if ($page.StatusCode -eq 200 -and $robots -notmatch 'noindex' -and $page.Content -notmatch 'name="robots" content="noindex' -and $page.Content -match 'Cashback vs Instant Discount' -and $sitemap.Content -match '/hi/cashback-discount-calculator/') {
                    Write-Host 'LIVE VERIFIED: uploaded release, shopping page, Hindi sitemap URL and public indexing are available.'
                    $confirmed = $true
                    break
                }
                Write-Host ('Release marker is present, but page/indexing/sitemap checks are not all satisfied (attempt ' + $attempt + ').')
            }
        } catch {
            Write-Host ('Live check ' + $attempt + ': ' + $_.Exception.Message)
        }
        if ($attempt -lt 12) { Start-Sleep -Seconds 10 }
    }
    if (-not $confirmed) { Write-Warning 'Cloudflare upload succeeded, but live verification did not complete. The actual HTTP errors are shown above.' }
} finally {
    Pop-Location
}
