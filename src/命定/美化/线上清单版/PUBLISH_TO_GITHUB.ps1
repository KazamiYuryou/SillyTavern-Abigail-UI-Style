param(
  [Parameter(Mandatory=$true)][string]$GitHubUser,
  [Parameter(Mandatory=$true)][string]$RepoName,
  [string]$Tag='v1.0.0'
)

$ErrorActionPreference='Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

if(-not (Test-Path .git)){
  git init
}

git add templates regex docs
if((git status --porcelain).Length -gt 0){
  git commit -m "release: abby galaxy dialog $Tag"
}

git branch -M main
$remote = "https://github.com/$GitHubUser/$RepoName.git"
if(-not (git remote | Select-String -SimpleMatch origin)){
  git remote add origin $remote
}else{
  git remote set-url origin $remote
}

git push -u origin main
git tag -f $Tag
git push -f origin $Tag

Write-Host "Published to: $remote"
Write-Host "Update regex templateUrl tag to: $Tag"
