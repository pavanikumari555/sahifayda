# Generates website brand assets from the owner's logo files.
# Usage: powershell -File scripts/brand-assets.ps1 -Mark "<monogram.png>" -Logo "<logo.png>"
param([Parameter(Mandatory)][string]$Mark, [Parameter(Mandatory)][string]$Logo)
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$brand = Join-Path $root 'public\brand'; $icons = Join-Path $root 'public\icons'
New-Item -ItemType Directory -Force $brand, $icons | Out-Null

function Save-Resized($src, [System.Drawing.Rectangle]$crop, [int]$w, [int]$h, $out, $background = $null, [double]$scale = 1.0) {
  $bmp = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'; $g.SmoothingMode = 'HighQuality'; $g.PixelOffsetMode = 'HighQuality'; $g.CompositingQuality = 'HighQuality'
  if ($background) { $g.Clear($background) } else { $g.Clear([System.Drawing.Color]::Transparent) }
  $dw = [int]($w * $scale); $dh = [int]($h * $scale)
  $dest = New-Object System.Drawing.Rectangle ([int](($w - $dw) / 2)), ([int](($h - $dh) / 2)), $dw, $dh
  $g.DrawImage($src, $dest, $crop, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose(); $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
}

$m = [System.Drawing.Image]::FromFile($Mark)
# The monogram artwork sits inside transparent padding; crop to a tight square for the header mark.
$tight = New-Object System.Drawing.Rectangle 170, 200, 900, 900
Save-Resized $m $tight 128 128 (Join-Path $brand 'sahifayda-mark.png')
Save-Resized $m $tight 48 48 (Join-Path $brand 'favicon-48.png')
$full = New-Object System.Drawing.Rectangle 0, 0, $m.Width, $m.Height
$white = [System.Drawing.Color]::White
Save-Resized $m $full 192 192 (Join-Path $icons 'app-192.png') $white
Save-Resized $m $full 512 512 (Join-Path $icons 'app-512.png') $white
Save-Resized $m $full 180 180 (Join-Path $icons 'apple-touch-icon.png') $white
$m.Dispose()

$l = [System.Drawing.Image]::FromFile($Logo)
# Social preview image (1200x630) with the full logo centred on white.
$lr = New-Object System.Drawing.Rectangle 0, 0, $l.Width, $l.Height
$og = New-Object System.Drawing.Bitmap 1200, 630
$lb = New-Object System.Drawing.Bitmap $l; $paper = $lb.GetPixel(4, 4); $lb.Dispose()
$g = [System.Drawing.Graphics]::FromImage($og); $g.InterpolationMode = 'HighQualityBicubic'; $g.Clear($paper)
$g.DrawImage($l, (New-Object System.Drawing.Rectangle 60, 115, 1080, 360), $lr, [System.Drawing.GraphicsUnit]::Pixel)
$font = New-Object System.Drawing.Font 'Segoe UI', 26, ([System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(3, 34, 74))
$fmt = New-Object System.Drawing.StringFormat; $fmt.Alignment = 'Center'
$g.DrawString(('Money decisions, made simple ' + [char]0x2022 + ' Hindi & English'), $font, $brush, (New-Object System.Drawing.RectangleF 0, 500, 1200, 60), $fmt)
$g.Dispose(); $og.Save((Join-Path $brand 'sahifayda-og.png'), [System.Drawing.Imaging.ImageFormat]::Png); $og.Dispose()
$l.Dispose()
Get-ChildItem $brand, $icons | Select-Object Name, Length
