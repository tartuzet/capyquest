param()

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$iconSrc = Join-Path $root 'capi512x512.png'
$bannerSrc = Join-Path $root 'capi320x180.png'

if (!(Test-Path $iconSrc)) { throw "No existe $iconSrc" }
if (!(Test-Path $bannerSrc)) { throw "No existe $bannerSrc" }

Add-Type -AssemblyName System.Drawing

function Resize-Png {
  param(
    [Parameter(Mandatory = $true)][string]$Source,
    [Parameter(Mandatory = $true)][string]$Target,
    [Parameter(Mandatory = $true)][int]$Width,
    [Parameter(Mandatory = $true)][int]$Height
  )

  $img = [System.Drawing.Image]::FromFile($Source)
  try {
    $bmp = New-Object System.Drawing.Bitmap($Width, $Height)
    try {
      $gfx = [System.Drawing.Graphics]::FromImage($bmp)
      try {
        $gfx.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $gfx.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $gfx.DrawImage($img, 0, 0, $Width, $Height)
      }
      finally {
        $gfx.Dispose()
      }

      $targetDir = Split-Path -Parent $Target
      if (!(Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir | Out-Null
      }

      $bmp.Save($Target, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    finally {
      $bmp.Dispose()
    }
  }
  finally {
    $img.Dispose()
  }
}

$targets = @(
  @{ Path = 'android\\app\\src\\main\\res\\mipmap-mdpi\\ic_launcher.png'; Size = 48 },
  @{ Path = 'android\\app\\src\\main\\res\\mipmap-hdpi\\ic_launcher.png'; Size = 72 },
  @{ Path = 'android\\app\\src\\main\\res\\mipmap-xhdpi\\ic_launcher.png'; Size = 96 },
  @{ Path = 'android\\app\\src\\main\\res\\mipmap-xxhdpi\\ic_launcher.png'; Size = 144 },
  @{ Path = 'android\\app\\src\\main\\res\\mipmap-xxxhdpi\\ic_launcher.png'; Size = 192 },
  @{ Path = 'android\\app\\src\\main\\res\\mipmap-mdpi\\ic_launcher_round.png'; Size = 48 },
  @{ Path = 'android\\app\\src\\main\\res\\mipmap-hdpi\\ic_launcher_round.png'; Size = 72 },
  @{ Path = 'android\\app\\src\\main\\res\\mipmap-xhdpi\\ic_launcher_round.png'; Size = 96 },
  @{ Path = 'android\\app\\src\\main\\res\\mipmap-xxhdpi\\ic_launcher_round.png'; Size = 144 },
  @{ Path = 'android\\app\\src\\main\\res\\mipmap-xxxhdpi\\ic_launcher_round.png'; Size = 192 },
  @{ Path = 'android\\app\\src\\main\\res\\mipmap-mdpi\\ic_launcher_foreground.png'; Size = 108 },
  @{ Path = 'android\\app\\src\\main\\res\\mipmap-hdpi\\ic_launcher_foreground.png'; Size = 162 },
  @{ Path = 'android\\app\\src\\main\\res\\mipmap-xhdpi\\ic_launcher_foreground.png'; Size = 216 },
  @{ Path = 'android\\app\\src\\main\\res\\mipmap-xxhdpi\\ic_launcher_foreground.png'; Size = 324 },
  @{ Path = 'android\\app\\src\\main\\res\\mipmap-xxxhdpi\\ic_launcher_foreground.png'; Size = 432 }
)

Write-Host '[android:assets] Regenerando iconos...'
foreach ($target in $targets) {
  Resize-Png -Source $iconSrc -Target (Join-Path $root $target.Path) -Width $target.Size -Height $target.Size
}

Write-Host '[android:assets] Regenerando banner...'
Resize-Png -Source $bannerSrc -Target (Join-Path $root 'android\\app\\src\\main\\res\\drawable\\banner.png') -Width 320 -Height 180

$splashTargets = @(
  @{ Path = 'android\\app\\src\\main\\res\\drawable\\splash.png'; Width = 480; Height = 320 },
  @{ Path = 'android\\app\\src\\main\\res\\drawable-land-mdpi\\splash.png'; Width = 480; Height = 320 },
  @{ Path = 'android\\app\\src\\main\\res\\drawable-land-hdpi\\splash.png'; Width = 800; Height = 480 },
  @{ Path = 'android\\app\\src\\main\\res\\drawable-land-xhdpi\\splash.png'; Width = 1280; Height = 720 },
  @{ Path = 'android\\app\\src\\main\\res\\drawable-land-xxhdpi\\splash.png'; Width = 1600; Height = 960 },
  @{ Path = 'android\\app\\src\\main\\res\\drawable-land-xxxhdpi\\splash.png'; Width = 1920; Height = 1280 },
  @{ Path = 'android\\app\\src\\main\\res\\drawable-port-mdpi\\splash.png'; Width = 320; Height = 480 },
  @{ Path = 'android\\app\\src\\main\\res\\drawable-port-hdpi\\splash.png'; Width = 480; Height = 800 },
  @{ Path = 'android\\app\\src\\main\\res\\drawable-port-xhdpi\\splash.png'; Width = 720; Height = 1280 },
  @{ Path = 'android\\app\\src\\main\\res\\drawable-port-xxhdpi\\splash.png'; Width = 960; Height = 1600 },
  @{ Path = 'android\\app\\src\\main\\res\\drawable-port-xxxhdpi\\splash.png'; Width = 1280; Height = 1920 }
)

Write-Host '[android:assets] Regenerando splash...'
foreach ($target in $splashTargets) {
  Resize-Png -Source $bannerSrc -Target (Join-Path $root $target.Path) -Width $target.Width -Height $target.Height
}

Write-Host '[android:assets] Build web...'
Push-Location $root
try {
  npm run build
  if ($LASTEXITCODE -ne 0) { throw 'Fallo npm run build' }

  Write-Host '[android:assets] Sync Android...'
  npx cap sync android
  if ($LASTEXITCODE -ne 0) { throw 'Fallo npx cap sync android' }
}
finally {
  Pop-Location
}

Write-Host '[android:assets] Listo.'
