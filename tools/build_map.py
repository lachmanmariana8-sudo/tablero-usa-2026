#!/usr/bin/env python3
"""Convierte us-atlas states-10m.json (pre-proyectado AlbersUSA 975x610) en data/map_paths.js.
Corrida: python3 tools/build_map.py <ruta states-10m.json>"""
import json, sys

FIPS = {"01":"AL","02":"AK","04":"AZ","05":"AR","06":"CA","08":"CO","09":"CT","10":"DE","11":"DC","12":"FL","13":"GA","15":"HI","16":"ID","17":"IL","18":"IN","19":"IA","20":"KS","21":"KY","22":"LA","23":"ME","24":"MD","25":"MA","26":"MI","27":"MN","28":"MS","29":"MO","30":"MT","31":"NE","32":"NV","33":"NH","34":"NJ","35":"NM","36":"NY","37":"NC","38":"ND","39":"OH","40":"OK","41":"OR","42":"PA","44":"RI","45":"SC","46":"SD","47":"TN","48":"TX","49":"UT","50":"VT","51":"VA","53":"WA","54":"WV","55":"WI","56":"WY"}

topo = json.load(open(sys.argv[1]))
sx, sy = topo["transform"]["scale"]; tx, ty = topo["transform"]["translate"]

def decode(idx_list):
    """Decodifica una lista de índices de arcos a un anillo de coordenadas absolutas."""
    ring = []
    for idx in idx_list:
        rev = idx < 0
        arc = topo["arcs"][~idx if rev else idx]
        x = y = 0; pts = []
        for dx, dy in arc:
            x += dx; y += dy
            pts.append((x * sx + tx, y * sy + ty))
        if rev: pts = pts[::-1]
        if ring: pts = pts[1:]
        ring += pts
    return ring

def ring_path(ring):
    d = f"M{ring[0][0]:.1f},{ring[0][1]:.1f}"
    for px, py in ring[1:]:
        d += f"L{px:.1f},{py:.1f}"
    return d + "Z"

def centroid(ring):
    xs = [p[0] for p in ring]; ys = [p[1] for p in ring]
    return (sum(xs)/len(xs), sum(ys)/len(ys))

states = []
for g in topo["objects"]["states"]["geometries"]:
    usps = FIPS.get(g["id"])
    if not usps: continue
    polys = g["arcs"] if g["type"] == "MultiPolygon" else [g["arcs"]]
    d = ""; biggest = None; bsize = -1
    for poly in polys:
        for ring_idx in poly:
            ring = decode(ring_idx)
            d += ring_path(ring)
            if len(ring) > bsize: bsize, biggest = len(ring), ring
    cx, cy = centroid(biggest)
    states.append({"id": usps, "name": g["properties"]["name"], "d": d, "cx": round(cx,1), "cy": round(cy,1)})

states.sort(key=lambda s: s["id"])
out = "// Generado por tools/build_map.py desde us-atlas@3.0.1 states-10m.json (proyeccion AlbersUSA 975x610)\nwindow.US_MAP={viewBox:\"0 0 975 610\",states:" + json.dumps(states, separators=(",", ":")) + "};\n"
open("data/map_paths.js","w").write(out)
print(f"{len(states)} estados -> data/map_paths.js ({len(out)//1024} KB)")
