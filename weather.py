import json
import time
import urllib.request

apikey = ''
dirregions = ''
diradminjson = ''

def weather(m):
    h = m.replace(' ', '').replace('-', '')
    d = 'http://api.openweathermap.org/data/2.5/forecast?q=%s,ru&APPID='+apikey+'&lang=ru&units=metric' % h
    print(d)
    g = urllib.request.urlopen(d)
    l = g.read().decode('utf-8', "replace")
    g = str(l)
    f = open(dirregions + m + '.json', 'w')
    f.write(g)
    f.close()
    k = json.loads(g)

a = open(diradminjson + 'regionsRF.geojson', 'r', encoding='utf-8')
b = a.read()
c = json.loads(b)
a.close()

i = 0
while True:
    try:
        city = c['features'][i]['properties']['NAME_LAT']
        i += 1
        city = str(city)
        weather(city)
        time.sleep(1)
    except IndexError:
        break
