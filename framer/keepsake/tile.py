import subprocess, sys, os
src, dst = sys.argv[1], sys.argv[2]; W = int(sys.argv[3]) if len(sys.argv) > 3 else 390; CH = 2000
h = int(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'stream=height', '-of', 'csv=p=0', src]).strip())
n = (h + CH - 1) // CH
fc = ''.join(f'[{i}]crop={W}:{min(CH, h - i * CH)}:0:{i * CH},pad={W}:{CH}:0:0:black[c{i}];' for i in range(n)) + ''.join(f'[c{i}]' for i in range(n)) + (f'hstack={n}' if n > 1 else 'null') + ',scale=iw*0.62:-1'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y'] + sum([['-i', src] for _ in range(n)], []) + ['-filter_complex', fc, dst], check=True)
