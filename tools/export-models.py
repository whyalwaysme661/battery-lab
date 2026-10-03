import bpy, json, struct, pathlib, sys
base=pathlib.Path(__file__).resolve().parent.parent
exec((base/'tools'/'blender-model.py').read_text(encoding='utf-8'))
original=bpy.data.scenes.get('Scene')
original_names=sorted(o.name for o in original.objects) if original else []
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
files=sorted((base/'dist'/'models').glob('*.glb'))
if args:files=[f for f in files if f.stem in args]
for file in files:
    data=file.read_bytes();n=struct.unpack_from('<I',data,12)[0]
    header=json.loads(data[20:20+n]);root=next(x for x in header['nodes'] if x.get('extras',{}).get('schema')=='battery-lab-1')
    config=json.loads(root['extras']['config_json'])
    battery_build(config,str(file),'BatteryLab_'+file.stem.replace('-','_'))
if not args or 'new-research-cells' in args:
    for profile,cathode,anode,electrolyte in [('nizn','nickel','zinc','koh'),('liion_hv','lnmo','graphite','lifsi_dmc'),('sodium','nvp','hardcarbon','sodiumliquid'),('sodium_oxide','na_o3','hardcarbon','sodiumliquid')]:
        config={'profile':profile,'model':'coin','width':20,'height':20,'depth':3.2,'cathode':cathode,'anode':anode,'electrolyte':electrolyte,'sei':'none'}
        file=base/'dist'/'models'/(profile+'-coin.glb')
        if not file.exists():battery_build(config,str(file),'BatteryLab_'+profile+'_coin')
assert not original or sorted(o.name for o in original.objects)==original_names
bpy.context.preferences.filepaths.save_version=0
bpy.ops.wm.save_as_mainfile(filepath=str(base.parent/'battery-models.blend'))
print('MODEL_EXPORT_OK',len(files),'ORIGINAL_SCENE_PRESERVED',original_names)
