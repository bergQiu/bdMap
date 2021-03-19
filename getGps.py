# 获取 gps信息

import argparse
import os
import sys
import json
import re
import datetime
import pyperclip


def getArgs():
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--input', help='input file', dest='file', nargs='+', required=True)
    args = parser.parse_args()

    return args


def main(filename):
    res = []

    p, k = os.path.splitext(filename)

    if os.path.isfile(filename):
        with open(filename, 'r') as fs:
            if k == '.txt':
                for li in fs:
                    r = re.sub('\'', '\"', li)
                    g = json.loads(r)
                    E = g['gps']['coordinates'][0]

                    # 可疑无效数据跳过
                    if E < 1:
                        break

                    N = g['gps']['coordinates'][1]
                    text = '''
wonderland
adasplus
'''
                    a = {
                        "longtitude": N,
                        "latitude": E,
                        "time": str(datetime.datetime.now()),
                        "text": text
                    }
                    res.append(a)
            elif k == '.log':
                for li in fs:
                    r = re.sub('\'', '\"', '{' + li + '}')

                    # 包含nan的跳过
                    if 'nan' in r:
                        continue
                    g = json.loads(r)

                    for m in g:
                        E = g[m]['GPS']['E']
                        
                        # 可疑无效数据跳过
                        if E < 1:
                            continue
                        text = '''
wonderland
adasplus
'''
                        N = g[m]['GPS']['N']
                        a = {
                            "longtitude": E,
                            "latitude": N,
                            "time": str(datetime.datetime.now()),
                            "text": text
                        }
                        res.append(a)

    count = len(res)

    return [res, count]


def saveTransfer(content):
    file = os.path.join(sys.path[0], 'transfer.js') 
    with open(file, 'w', encoding='utf-8') as fs:
        fs.write('var gpsShowData = {}'.format(content))


if __name__ == '__main__':
    args = getArgs()
    result = {"data": []}
    files = args.file

    for f in files:
        file = os.path.join(sys.path[0], 'demo', f)
        res, count = main(file)
        result["data"].append(res)
        print('{} 文件中共计{}点gps数据已复制到粘贴板，可直接粘贴使用....'.format(file, count))

    # pyperclip.copy(res) # copy
    saveTransfer(result)
    # pyperclip.paste() # paste