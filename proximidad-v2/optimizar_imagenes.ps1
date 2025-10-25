# ============================================
# OPTIMIZACIÓN DE IMÁGENES - ProXimidad
# ============================================

Write-Host "🖼️ ANALIZANDO IMÁGENES PESADAS..." -ForegroundColor Cyan
Write-Host ""

# Analizar carpeta media
$mediaPath = ".\backend\media\usuarios"
if (Test-Path $mediaPath) {
    Write-Host "📂 Analizando: $mediaPath" -ForegroundColor Yellow
    
    $archivos = Get-ChildItem -Path $mediaPath -Recurse -File
    $totalSize = ($archivos | Measure-Object -Property Length -Sum).Sum / 1MB
    
    Write-Host "   📊 Total de archivos: $($archivos.Count)" -ForegroundColor White
    Write-Host "   📦 Tamaño total: $([math]::Round($totalSize, 2)) MB" -ForegroundColor White
    Write-Host ""
    
    # Listar archivos más pesados
    Write-Host "🔍 Archivos más pesados (Top 10):" -ForegroundColor Yellow
    $archivos | Sort-Object Length -Descending | Select-Object -First 10 | ForEach-Object {
        $sizeMB = [math]::Round($_.Length / 1MB, 2)
        $sizeKB = [math]::Round($_.Length / 1KB, 0)
        
        if ($sizeMB -gt 1) {
            Write-Host "   🔴 $($_.Name): ${sizeMB} MB" -ForegroundColor Red
        } elseif ($sizeKB -gt 500) {
            Write-Host "   🟡 $($_.Name): ${sizeKB} KB" -ForegroundColor Yellow
        } else {
            Write-Host "   🟢 $($_.Name): ${sizeKB} KB" -ForegroundColor Green
        }
    }
} else {
    Write-Host "⚠️ No se encontró la carpeta media" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "💡 RECOMENDACIONES:" -ForegroundColor Magenta
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Archivos > 1MB:" -ForegroundColor Yellow
Write-Host "   → Comprimir con herramientas online" -ForegroundColor White
Write-Host "   → TinyPNG, Squoosh, ImageOptim" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Formato WebP:" -ForegroundColor Yellow
Write-Host "   → Convierte JPG/PNG a WebP (70% menos peso)" -ForegroundColor White
Write-Host ""
Write-Host "3. Lazy Loading:" -ForegroundColor Yellow
Write-Host "   → Ya está implementado en el código" -ForegroundColor White
Write-Host ""
Write-Host "4. CDN (Producción):" -ForegroundColor Yellow
Write-Host "   → Cloudinary, ImgIX, AWS S3" -ForegroundColor White
Write-Host ""

# Analizar node_modules (informativo)
Write-Host "📦 Análisis de node_modules:" -ForegroundColor Yellow
$nodeModulesPath = ".\frontend\node_modules"
if (Test-Path $nodeModulesPath) {
    $nodeSize = (Get-ChildItem -Path $nodeModulesPath -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   📊 Tamaño: $([math]::Round($nodeSize, 2)) MB (normal, no afecta carga)" -ForegroundColor Gray
    Write-Host "   ℹ️ node_modules NO se envía al navegador" -ForegroundColor Gray
} else {
    Write-Host "   ⚠️ No encontrado. Ejecuta: npm install" -ForegroundColor Yellow
}

Write-Host ""
pause
