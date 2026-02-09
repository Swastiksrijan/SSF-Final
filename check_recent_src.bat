powershell -Command "Get-ChildItem -Recurse src | Sort-Object LastWriteTime -Descending | Select-Object -First 20 | Format-Table LastWriteTime, Name" > recent_src.txt 2>&1
