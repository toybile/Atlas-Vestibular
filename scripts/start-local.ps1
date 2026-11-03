$ErrorActionPreference='Stop'
$siteRoot=Split-Path $PSScriptRoot -Parent
$url='http://127.0.0.1:8767/'
$ready=$false
try{ $page=Invoke-WebRequest $url -TimeoutSec 3 -UseBasicParsing; $ready=$page.Content -match 'enem-section' }catch{}
if(-not $ready){
 $pythonCommand=Get-Command python -ErrorAction SilentlyContinue
 $pythonExe=if($pythonCommand){$pythonCommand.Source}else{$null}
 if(-not $pythonExe -or $pythonExe -match 'WindowsApps\\python.exe$'){
  $runtime=Get-ChildItem "$env:ProgramFiles/WindowsApps/OpenAI.CodexPrimaryRuntime.*/dependencies/python/python.exe" -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -First 1
  if($runtime){$pythonExe=$runtime.FullName}
 }
 if(-not $pythonExe){throw 'Python não localizado. Instale Python ou abra a pasta em um servidor local.'}
 Start-Process -FilePath $pythonExe -ArgumentList @('-m','http.server','8767','--bind','127.0.0.1') -WorkingDirectory $siteRoot -WindowStyle Hidden
 for($attempt=0;$attempt -lt 20;$attempt++){
  try{$page=Invoke-WebRequest $url -TimeoutSec 2 -UseBasicParsing;if($page.Content -match 'enem-section'){$ready=$true;break}}catch{}
  Start-Sleep -Milliseconds 200
 }
}
if(-not $ready){throw 'Não foi possível abrir o servidor local na porta 8767. Verifique se outro programa está usando a porta.'}
Start-Process $url
