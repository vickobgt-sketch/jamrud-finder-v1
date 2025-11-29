@echo off
setlocal enabledelayedexpansion

set prefix=WF208
set count=1

for /f "delims=" %%f in ('dir /b /a-d /o:d *.jpg *.jpeg *.png') do (
    ren "%%f" "!prefix!_!count!%%~xf"
    set /a count+=1
)
