powershell -Command "Get-ChildItem -Recurse | Sort-Object LastWriteTime -Descending | Select-Object -First 20 | Format-Table LastWriteTime, Name" > recent_files.txt 2>&1
