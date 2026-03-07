@echo off
echo ===============================
echo GERADOR DE ZIP LIMPO DO PROJETO
echo ===============================
echo.

REM gerar timestamp
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd_HHmmss"') do set TS=%%i

REM caminhos
set TMP=%USERPROFILE%\Desktop\GRS_TMP_%TS%
set ZIP=%USERPROFILE%\Desktop\GRS_ENTREGA_%TS%.zip

echo Criando pasta temporaria...
powershell -NoProfile -ExecutionPolicy Bypass -Command "New-Item -ItemType Directory -Path '%TMP%' | Out-Null"

echo Copiando projeto (ignorando lixo)...
robocopy . "%TMP%" /E /XD node_modules .git dist build logs backups .next .cache coverage /XF .env .env.local .env.production .env.development client\.env client\.env.local client\.env.production client\.env.development >nul

echo Gerando ZIP...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Compress-Archive -Path '%TMP%\*' -DestinationPath '%ZIP%' -Force"

echo Limpando temporarios...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Remove-Item '%TMP%' -Recurse -Force"

echo.
echo ===============================
echo ZIP GERADO COM SUCESSO
echo %ZIP%
echo ===============================
pause