import json, urllib.request
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
def get(u):
    with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60) as r:
        return r.read().decode("utf-8", "replace")
d = json.loads(get("https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=4019220&count=60&maxlength=1&format=json"))["appnews"]["newsitems"]
print("items returned by the API:", len(d))
rows = sorted(d, key=lambda n: n["date"])
import datetime
for n in rows:
    print("  ", datetime.datetime.utcfromtimestamp(n["date"]).strftime("%Y-%m-%d"), "|", n.get("feedlabel"), "|", n["title"][:60])
print()
print("earliest post:", datetime.datetime.utcfromtimestamp(rows[0]["date"]).strftime("%Y-%m-%d") if rows else "none")
print("latest post:  ", datetime.datetime.utcfromtimestamp(rows[-1]["date"]).strftime("%Y-%m-%d") if rows else "none")
