import bpy, math, json, random

def battery_build(config, filepath, scene_name="BatteryLab"):
    scene = bpy.data.scenes.get(scene_name)
    if scene is None:
        scene = bpy.data.scenes.new(scene_name)
    bpy.context.window.scene = scene
    for obj in list(scene.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    scene.unit_settings.system = 'METRIC'
    scene.unit_settings.scale_length = 1.0
    scene['purpose'] = 'Schematic, not a manufacturing drawing'
    scene['verified_sources_date'] = '2026-10-03'
    scene['config_json'] = json.dumps(config, ensure_ascii=False)
    collection = scene.collection
    root = bpy.data.objects.new("Battery_Assembly", None)
    collection.objects.link(root)
    root['schema'] = 'battery-lab-1'
    root['config_json'] = json.dumps(config, ensure_ascii=False)
    root['thin_layers'] = 'Display thickness exaggerated; user design dimensions, not certified product dimensions'
    root['detail_basis'] = 'Illustrative geometry and surface finish; repeat counts, roughness, seals and contacts are not measured specifications'
    root.scale = (0.001, 0.001, 0.001)
    non_copper = config.get('profile','').startswith('sodium') or config.get('profile') in ['nimh','nizn']
    colors = {'cathode': (0.095,0.09,0.08,1), 'anode': (0.045,0.046,0.044,1), 'electrolyte': (0.8,0.79,0.73,1), 'collector':(0.62,0.64,0.64,1), 'copper':(0.64,0.28,0.11,1), 'shell':(0.48,0.5,0.51,1), 'seal':(0.018,0.019,0.018,1),'sei':(0.56,0.54,0.47,1),'heat':(0.2,0.17,0.14,1),'converter':(0.12,0.13,0.12,1)}
    if config.get('model')=='lead': colors.update(shell=(0.027,0.029,0.027,1),cathode=(0.23,0.12,0.08,1),anode=(0.32,0.33,0.32,1))
    if config.get('profile','').startswith('solar'): colors['cathode']=(0.012,0.033,0.058,1)
    # Small, periodic, packed PBR maps are display finishes, not microscopy data.
    # Both glTF roughness/metallic channels and tangent normals use image nodes.
    def finish_image(kind, normal=False):
        name='BatteryLab_v3_'+kind+('_normal' if normal else '_metallic_roughness')
        image=bpy.data.images.get(name)
        if image: return image
        size=128; rng=random.Random(47); heights=[]; pixels=[]
        for y in range(size):
            row=[]
            for x in range(size):
                noise=rng.uniform(-1,1)
                if kind=='brushed':
                    value=.35*math.sin(y*math.tau*29/size)+.13*math.sin((y*11+x*2)*math.tau/size)+noise*.055
                elif kind=='woven':
                    value=.22*math.sin(x*math.tau*16/size)*math.sin(y*math.tau*16/size)+noise*.1
                else: value=noise*.25
                row.append(value)
            heights.append(row)
        for y in range(size):
            for x in range(size):
                if normal:
                    dx=(heights[y][(x+1)%size]-heights[y][(x-1)%size])*.35
                    dy=(heights[(y+1)%size][x]-heights[(y-1)%size][x])*.35
                    length=math.sqrt(1+dx*dx+dy*dy)
                    pixels.extend([.5-dx/(2*length),.5-dy/(2*length),.5+.5/length,1])
                else:
                    rough=(.35 if kind=='brushed' else .82)+heights[y][x]*.12
                    pixels.extend([1,rough,.9 if kind=='brushed' else 0,1])
        image=bpy.data.images.new(name,width=size,height=size,alpha=True)
        image.colorspace_settings.name='Non-Color'
        image.pixels.foreach_set(pixels);image.pack()
        return image
    mats={}
    for key,color in colors.items():
        name='BL_detail_v3_'+config.get('profile','')+'_'+config.get('model','')+'_'+key
        mat=bpy.data.materials.get(name) or bpy.data.materials.new(name)
        mat.diffuse_color=color; mat.use_nodes=True
        nodes=mat.node_tree.nodes; nodes.clear()
        shader=nodes.new('ShaderNodeBsdfPrincipled'); output=nodes.new('ShaderNodeOutputMaterial')
        mat.node_tree.links.new(shader.outputs['BSDF'],output.inputs['Surface'])
        shader.inputs['Base Color'].default_value=color
        metal=key in ['shell','collector','copper'] and config.get('model')!='lead'
        shader.inputs['Metallic'].default_value=.9 if metal else 0
        shader.inputs['Roughness'].default_value=.36 if metal else .83
        if key!='seal':
            kind='brushed' if metal else 'coated'
            texture=nodes.new('ShaderNodeTexImage');texture.image=finish_image(kind)
            channels=nodes.new('ShaderNodeSeparateColor');channels.mode='RGB'
            mat.node_tree.links.new(texture.outputs['Color'],channels.inputs['Color'])
            mat.node_tree.links.new(channels.outputs['Green'],shader.inputs['Roughness'])
            mat.node_tree.links.new(channels.outputs['Blue'],shader.inputs['Metallic'])
            normal_texture=nodes.new('ShaderNodeTexImage');normal_texture.image=finish_image(kind,True)
            normal_map=nodes.new('ShaderNodeNormalMap');normal_map.inputs['Strength'].default_value=.32
            mat.node_tree.links.new(normal_texture.outputs['Color'],normal_map.inputs['Color'])
            mat.node_tree.links.new(normal_map.outputs['Normal'],shader.inputs['Normal'])
        mat['surface_finish']='Brushed metal' if metal else 'Fine matte schematic finish'
        mats[key]=mat
    surface_variants={}
    def surface_material(base,kind):
        key=(base.name,kind)
        if key in surface_variants: return surface_variants[key]
        material=base.copy();material.name=base.name+'_'+kind
        nodes=material.node_tree.nodes;links=material.node_tree.links
        shader=next(n for n in nodes if n.type=='BSDF_PRINCIPLED')
        for socket in ['Base Color','Alpha','Metallic','Roughness','Normal']:
            for link in list(shader.inputs[socket].links):links.remove(link)
        if kind=='woven':
            shader.inputs['Base Color'].default_value=(.035,.038,.037,1)
            shader.inputs['Metallic'].default_value=0;shader.inputs['Roughness'].default_value=.88
            texture=nodes.new('ShaderNodeTexImage');texture.image=finish_image('woven',True)
            normal=nodes.new('ShaderNodeNormalMap');normal.inputs['Strength'].default_value=.45
            links.new(texture.outputs['Color'],normal.inputs['Color']);links.new(normal.outputs['Normal'],shader.inputs['Normal'])
        elif kind=='substrate':
            shader.inputs['Base Color'].default_value=(.27,.29,.28,1)
            shader.inputs['Metallic'].default_value=.12;shader.inputs['Roughness'].default_value=.58
        else:
            alpha=.14 if kind=='glass' else .10
            shader.inputs['Base Color'].default_value=(.55,.66,.69,alpha)
            shader.inputs['Alpha'].default_value=alpha
            shader.inputs['Metallic'].default_value=0;shader.inputs['Roughness'].default_value=.13
            material.surface_render_method='DITHERED';material.diffuse_color=(.55,.66,.69,alpha)
        material['surface_finish']=kind+' schematic finish'
        surface_variants[key]=material
        return material
    def finish(obj,name,role,group=0,vector=(0,0,1),label=None):
        obj.name=name
        obj.parent=root
        for col in list(obj.users_collection):
            if col != collection:
                col.objects.unlink(obj)
        if obj.name not in collection.objects:
            collection.objects.link(obj)
        material=mats['collector'] if role=='copper' and non_copper else mats.get(role,mats['collector'])
        if config.get('profile','').startswith('solar'):
            if name in ['Cover_glass','Encapsulation','Encapsulant']:
                material=surface_material(material,'glass')
            elif name in ['Transparent_contact','Passivation_AR','Window_transport']:
                material=surface_material(material,'optical')
        if name in ['Substrate','Backsheet']:material=surface_material(material,'substrate')
        if 'GDL' in name:material=surface_material(material,'woven')
        obj.data.materials.append(material)
        if obj.type=='MESH':
            normal=obj.modifiers.new('Machined_surface_normals','WEIGHTED_NORMAL');normal.keep_sharp=True
            # Stable UVs make the fine finish readable without turning the model into a grid.
            if not obj.data.uv_layers: obj.data.uv_layers.new(name='UVMap')
            uv=obj.data.uv_layers.active.data
            for polygon in obj.data.polygons:
                axis=max(range(3),key=lambda i:abs(polygon.normal[i])); axes=[i for i in range(3) if i!=axis]
                for li in polygon.loop_indices:
                    v=obj.data.vertices[obj.data.loops[li].vertex_index].co
                    uv[li].uv=(v[axes[0]]*.075,v[axes[1]]*.075)
        obj['surface_finish']=material.get('surface_finish','Optical cover')
        obj['role']=role
        obj['part_label']=label or name
        obj['explode_group']=group
        obj['explode_vector']=list(vector)
        if role in ['cathode','anode','electrolyte']:
            obj['material_id']=config.get(role,'')
        if role=='sei':obj['material_id']=config.get('sei','')
        if role=='converter':obj['material_id']=config.get('cathode','')
        if role=='heat':obj['material_id']=config.get('anode','')
        return obj
    def box(name,size,pos,role,group=0,vector=(0,0,1),bevel=0.18,label=None):
        bpy.ops.mesh.primitive_cube_add(size=1,location=pos)
        obj=bpy.context.object
        obj.scale=size
        bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
        if bevel>0:
            mod=obj.modifiers.new('Precision_edge_radius','BEVEL')
            mod.width=min(bevel,min(size)*0.22)
            mod.segments=4
            mod.harden_normals=True
        return finish(obj,name,role,group,vector,label)
    def cyl(name,radius,depth,pos,role,group=0,vector=(0,0,1),label=None,vertices=64):
        bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=radius,depth=depth,location=pos)
        obj=bpy.context.object
        mod=obj.modifiers.new('Rounded_metal_edges','BEVEL')
        mod.width=min(0.15,depth*.1)
        mod.segments=4
        mod.harden_normals=True
        for poly in obj.data.polygons:poly.use_smooth=vertices>8
        return finish(obj,name,role,group,vector,label)
    def ring(name,ro,ri,depth,pos,role,group=0,theta=2*math.pi,label=None,vector=(0,0,1)):
        n=96
        verts=[]
        for z in [-depth/2,depth/2]:
            for radius in [ro,ri]:
                for i in range(n+1):
                    a=theta*i/n
                    verts.append((radius*math.cos(a),radius*math.sin(a),z))
        stride=n+1
        faces=[]
        for i in range(n):
            faces.extend([(i,i+1,stride+i+1,stride+i),
                          (2*stride+i,3*stride+i,3*stride+i+1,2*stride+i+1),
                          (i,2*stride+i,2*stride+i+1,i+1),
                          (stride+i,stride+i+1,3*stride+i+1,3*stride+i)])
        faces.extend([(0,stride,3*stride,2*stride),(n,2*stride-1,4*stride-1,3*stride-1)])
        mesh=bpy.data.meshes.new(name+'_mesh')
        mesh.from_pydata(verts,[],faces);mesh.update()
        obj=bpy.data.objects.new(name,mesh);collection.objects.link(obj)
        obj.location=pos
        for i,poly in enumerate(mesh.polygons):poly.use_smooth=(i%4 in [2,3] and i<4*n)
        return finish(obj,name,role,group,vector,label)
    def outline(w,h,r,steps=6):
        r=min(r,w*.49,h*.49)
        points=[]
        for cx,cy,start in [(w/2-r,h/2-r,0),(-w/2+r,h/2-r,90),(-w/2+r,-h/2+r,180),(w/2-r,-h/2+r,270)]:
            for i in range(steps+1):
                angle=math.radians(start+90*i/steps)
                points.append((cx+r*math.cos(angle),cy+r*math.sin(angle)))
        return points
    def mesh_part(name,verts,faces,role,group=0,label=None,bevel=0):
        mesh=bpy.data.meshes.new(name+'_mesh');mesh.from_pydata(verts,[],faces);mesh.update()
        obj=bpy.data.objects.new(name,mesh);collection.objects.link(obj)
        if bevel>0:
            edge=obj.modifiers.new('Soft_sheet_edges','BEVEL');edge.width=bevel;edge.segments=3;edge.harden_normals=True
        return finish(obj,name,role,group,label=label)
    def plates(name,specs,role,group=0,label=None,bevel=0):
        # Disconnected repeated sheets share a mesh/material: fine layering, few draws.
        verts=[];faces=[]
        for w,h,t,pos,r in specs:
            contour=outline(w,h,r);n=len(contour);offset=len(verts)
            verts.extend((x+pos[0],y+pos[1],z+pos[2]) for z in [-t/2,t/2] for x,y in contour)
            faces.extend([tuple(offset+i for i in reversed(range(n))),tuple(offset+n+i for i in range(n))])
            faces.extend((offset+i,offset+(i+1)%n,offset+n+(i+1)%n,offset+n+i) for i in range(n))
        obj=mesh_part(name,verts,faces,role,group,label,bevel)
        for polygon in obj.data.polygons:polygon.use_smooth=len(polygon.vertices)==4
        return obj
    def plate(name,size,pos,role,group=0,label=None,radius=None):
        w,h,t=size
        return plates(name,[(w,h,t,pos,radius if radius is not None else min(w,h)*.035)],role,group,label,min(t*.13,min(w,h)*.006))
    def frame(name,outer,inner,t,pos,role,group=0,label=None,radius=None):
        r=radius if radius is not None else min(outer)*.06
        a=outline(*outer,r);b=outline(*inner,max(r-min(outer[0]-inner[0],outer[1]-inner[1])*.5,r*.25))
        n=len(a);verts=[(x+pos[0],y+pos[1],z+pos[2]) for z in [-t/2,t/2] for path in [a,b] for x,y in path];faces=[]
        for i in range(n):
            j=(i+1)%n
            faces.extend([(i,j,2*n+j,2*n+i),(n+j,n+i,3*n+i,3*n+j),
                          (j,i,n+i,n+j),(2*n+i,2*n+j,3*n+j,3*n+i)])
        return mesh_part(name,verts,faces,role,group,label)
    def formed_pouch(name,w,h,d,side,group):
        # Formed laminate pocket and flat heat-seal flange; geometry is illustrative.
        # https://www.msesupplies.com/blogs/news/formation-and-sealing-for-battery-case-of-pouch-cell
        sections=[(1,1,.025),(.915,.915,.025),(.895,.895,.055),(.88,.875,.24),(.845,.825,.42),(.80,.77,.47)]
        paths=[outline(w*sx,h*sy,min(w,h)*.055) for sx,sy,z in sections]
        n=len(paths[0]);count=len(paths);verts=[];faces=[]
        for inset in [0,.018]:
            for path,(_,_,z) in zip(paths,sections):
                verts.extend((x,y,side*d*(z-inset)) for x,y in path)
        half=n*count
        for layer in range(2):
            for k in range(count-1):
                for i in range(n):
                    j=(i+1)%n;a=layer*half+k*n;b=a+n
                    face=(a+i,a+j,b+j,b+i)
                    faces.append(face if (layer==0)==(side>0) else tuple(reversed(face)))
            cap=tuple(layer*half+(count-1)*n+i for i in range(n))
            faces.append(cap if (layer==0)==(side>0) else tuple(reversed(cap)))
        for i in range(n):
            j=(i+1)%n;face=(j,i,half+i,half+j)
            faces.append(face if side>0 else tuple(reversed(face)))
        obj=mesh_part(name,verts,faces,'shell',group,'成形铝塑膜壳与热封法兰')
        for polygon in obj.data.polygons:polygon.use_smooth=len(polygon.vertices)==4
        obj['geometry_note']='Formed pocket; representative flange, not a process specification'
        return obj
    def collector_fans(name,positions,x,w,h,tab_z,t,role,group,end_y=.49):
        verts=[];faces=[]
        for z in positions:
            offset=len(verts);ys=[h*.32,h*.37,h*(end_y-.04),h*end_y];zs=[z,z,tab_z,tab_z]
            for dz in [-t/2,t/2]:
                for y,zz in zip(ys,zs):verts.extend([(x-w*.055,y,zz+dz),(x+w*.055,y,zz+dz)])
            local=[(0,1,9,8),(6,14,15,7)]
            for k in range(3):
                a=2*k;b=a+2
                local.extend([(a,b,b+1,a+1),(a+8,a+9,b+9,b+8),(a,a+8,b+8,b),(a+1,b+1,b+9,a+9)])
            faces.extend(tuple(offset+i for i in face) for face in local)
        return mesh_part(name,verts,faces,role,group,'集流箔汇集与极耳连接（示意）')
    def flow_field(w,h,z,relief,role,group):
        # Parallel gas passages open into common end headers, bounded by gasket land.
        specs=[]
        for j in range(9):specs.append((w*.027,h*.55,relief,((j-4)*w*.073,0,z),w*.013))
        plates('Flow_field_ribs',specs,role,group,'流场肋与并联气体通道（示意）')
        frame('Flow_field_perimeter',(w*.79,h*.79),(w*.72,h*.69),relief,(0,0,z),role,group,'流场边界与汇流区域')
        for x,y in [(-w*.29,-h*.36),(w*.29,h*.36)]:
            ring('Manifold_port',min(w,h)*.028,min(w,h)*.018,relief,(x,y,z),role,group,label='流场汇流孔位（示意）')
    def compression_hardware(w,h,d,face_z,group):
        for x in [-w*.44,w*.44]:
            for y in [-h*.44,h*.44]:
                if face_z>0:cyl('Compression_bolt',min(w,h)*.019,2*(abs(face_z)+d*.035),(x,y,0),'collector',0,label='电堆压紧螺栓',vertices=24)
                direction=1 if face_z>0 else -1
                ring('Bolt_washer',min(w,h)*.039,min(w,h)*.021,d*.022,(x,y,face_z),'collector',group,label='压紧垫圈')
                cyl('Hex_bolt_head' if direction>0 else 'Hex_nut',min(w,h)*.032,d*.055,(x,y,face_z+direction*d*.032),'collector',group,label='六角压紧紧固件',vertices=6)
    width=float(config.get('width',60))
    height=float(config.get('height',90))
    depth=float(config.get('depth',9))
    model=config.get('model','pouch')
    profile=config.get('profile','solid')
    # Coordinates in millimetres under a metre-scaled parent.
    if model in ['pouch','prismatic']:
        w,h,d=width,height,depth
        activew,activeh=w*.77,h*.72
        if model=='pouch':
            scene['construction_reference']='https://www.msesupplies.com/blogs/news/formation-and-sealing-for-battery-case-of-pouch-cell'
            formed_pouch('Pouch_back',w,h,d,-1,-2)
            formed_pouch('Pouch_front',w,h,d,1,3)
            for side,group in [(-1,-2),(1,3)]:
                for inset in [.019,.033,.047]:
                    frame('Heat_seal_pressure_line',(w*(1-inset),h*(1-inset)),(w*(.996-inset),h*(.996-inset)),d*.003,(0,0,side*d*.027),'shell',group,'热封法兰压纹',radius=min(w,h)*.053)
        else:
            plate('Case_base',(w,h,d*.065),(0,0,-d*.47),'shell',-2,'金属方壳底板（材质依体系）')
            frame('Case_wall',(w,h),(w*.95,h*.965),d*.90,(0,0,0),'shell',-2,'圆角方壳侧壁',radius=min(w,h)*.05)
            frame('Case_inner_insulation',(w*.947,h*.962),(w*.92,h*.94),d*.78,(0,0,0),'seal',-2,'电芯周边绝缘衬套',radius=min(w,h)*.035)
            plate('Case_lid',(w*.994,h*.994,d*.065),(0,0,d*.475),'shell',3,'圆角方壳盖板')
            frame('Lid_weld_seam',(w*.976,h*.982),(w*.962,h*.968),d*.008,(0,0,d*.512),'collector',3,'盖板周边焊接接缝')
        # Three visible repeats stand for a multilayer stack, never an actual layer count.
        sequence=[('Negative_collector','copper',.065,-2,'负极集流箔'),
                  ('Negative_electrode','anode',.18,-1,'负极活性层'),
                  ('Electrolyte_separator','electrolyte',.13,0,'电解质 / 隔膜'),
                  ('Positive_electrode','cathode',.18,1,'正极活性层'),
                  ('Positive_collector','collector',.065,2,'正极集流箔'),
                  ('Positive_electrode','cathode',.18,1,'正极活性层'),
                  ('Electrolyte_separator','electrolyte',.13,0,'电解质 / 隔膜'),
                  ('Negative_electrode','anode',.18,-1,'负极活性层')]
        pitch=d*.64/(3*sum(entry[2] for entry in sequence));z=-d*.32
        sheets={};collector_z={'copper':[],'collector':[]};sei_z=[];separator_z=[]
        for repeat in range(3):
            for layer_index,(name,role,fraction,group,label) in enumerate(sequence):
                t=pitch*fraction;center=z+t/2;z+=t
                overhang=1.045 if role=='electrolyte' else (1.025 if role in ['copper','collector'] else 1)
                sheets.setdefault((name,role,group,label),[]).append((activew*overhang,activeh*overhang,t*.96,(0,0,center),min(w,h)*.024))
                if role in collector_z:collector_z[role].append(center)
                if role=='electrolyte':separator_z.append(center)
                if role=='anode':sei_z.append(center+t*(.49 if layer_index==1 else -.49))
        for (name,role,group,label),specs in sheets.items():
            obj=plates(name,specs,role,group,label+'（重复层示意）');obj['illustrative_repeats']=3
        for x,role,group in [(-w*.22,'collector',2),(w*.22,'copper',-2)]:
            if model=='pouch':
                collector_fans('Collector_tab_bundle',collector_z[role],x,w,h,0,d*.009,role,group)
                plate('Positive_tab' if role=='collector' else 'Negative_tab',(w*.145,h*.20,d*.035),(x,h*.555,0),role,group,'外露金属极耳',radius=w*.014)
                plate('Tab_insulation',(w*.19,h*.060,d*.075),(x,h*.468,0),'seal',group,'极耳绝缘密封带',radius=w*.012)
                stamps=[(w*.018,h*.013,d*.004,(x+dx*w*.036,h*.507, d*.020),w*.005) for dx in [-1,0,1]]
                plates('Tab_weld_imprint',stamps,role,group,'极耳焊接压痕（示意）')
            else:
                collector_fans('Collector_tab_bundle',collector_z[role],x,w,h,d*.32,d*.010,role,group,end_y=.44)
                box('Terminal_internal_strap',(w*.11,h*.026,d*.20),(x,h*.44,d*.40),role,group,label='内部集流连接片')
                plate('Terminal_inner_bridge',(w*.11,h*.12,d*.025),(x,h*.39,d*.49),role,group,'内部极柱连接桥')
                cyl('Terminal_feedthrough',w*.024,d*.11,(x,h*.34,d*.537),role,3,label='绝缘座内导电极柱',vertices=32)
                plate('Terminal_insulation_boss',(w*.21,h*.14,d*.056),(x,h*.34,d*.534),'seal',3,'端子绝缘座')
                plate('Terminal_contact_pad',(w*.14,h*.09,d*.055),(x,h*.34,d*.584),role,3,'外部极柱接触面')
                ring('Terminal_washer',w*.043,w*.023,d*.018,(x,h*.34,d*.626),'collector',3,label='端子压紧垫圈')
                cyl('Terminal_hex_fastener',w*.033,d*.043,(x,h*.34,d*.650),role,3,label='端子紧固件',vertices=6)
        if model=='prismatic':
            plate('Pressure_relief_recess',(w*.19,h*.078,d*.009),(0,-h*.25,d*.513),'seal',3,'泄压结构凹槽（示意）')
            plate('Pressure_relief_vent',(w*.16,h*.055,d*.013),(0,-h*.25,d*.520),'collector',3,'泄压结构盖片（示意）')
            cyl('Electrolyte_fill_port',w*.023,d*.012,(w*.31,-h*.31,d*.517),'collector',3,label='注液口封塞（示意）')
        if profile=='solid' and config.get('electrolyte')=='p3dse':
            # Sparse inset network is only a magnified design cue, not particle sizes.
            specs=[(w*.008,h*.58,d*.009,((i-4)*w*.074,0,separator_z[-1]),w*.002) for i in range(9)]
            plates('p3DSE_network_inset',specs,'electrolyte',0,'p-3DSE 网络（显示放大）')
        if profile in ['solid','gel']:
            plates('Artificial_SEI',[(activew,activeh,d*.002,(0,0,z),min(w,h)*.024) for z in sei_z],'sei',-1,'人工 SEI 设计层（显示加厚）')
    elif model in ['coin','aircoin']:
        r=width/2;d=depth
        cyl('Coin_negative_cap',r,d*.16,(0,0,-d*.48),'shell',-3,label='负极盖')
        cyl('Coin_anode',r*.83,d*.25,(0,0,-d*.2),'anode',-1,label='负极层')
        cyl('Coin_separator',r*.86,d*.08,(0,0,0),'electrolyte',0,label='隔膜 / 电解质层')
        cyl('Coin_cathode',r*.83,d*.28,(0,0,d*.2),'cathode',1,label='正极层 / 空气电极')
        ring('Coin_insulating_gasket',r*.98,r*.88,d*.9,(0,0,0),'seal',0,label='绝缘密封环')
        ring('Coin_positive_can',r,r*.96,d,(0,0,0),'shell',2,label='正极壳')
        ring('Coin_crimp_lip',r*1.008,r*.954,d*.085,(0,0,-d*.43),'shell',2,label='卷封边缘')
        if model=='aircoin':
            ring('Air_entry_cover',r,r*.08,d*.12,(0,0,d*.48),'shell',3,label='空气入口（概念孔位）')
            cyl('Gas_diffusion_layer',r*.83,d*.05,(0,0,d*.34),'seal',1,label='气体扩散层')
        else:cyl('Coin_positive_cover',r,d*.14,(0,0,d*.48),'shell',3,label='正极壳底')
        if profile in ['solid','gel']:cyl('Artificial_SEI',r*.83,d*.02,(0,0,-d*.05),'sei',0,label='人工 SEI（显示加厚）')
    elif model in ['cylindrical','alkaline']:
        r=width/2;h=height
        ring('Metal_can_cutaway',r,r*.96,h,(0,0,0),'shell',0,theta=math.pi*1.52,label='金属壳（示意剖开）',vector=(1,0,0))
        cyl('Can_bottom',r,h*.018,(0,0,-h*.5),'shell',-3,label='壳底')
        if model=='alkaline':
            ring('MnO2_cathode_ring',r*.94,r*.56,h*.89,(0,0,-h*.01),'cathode',0,theta=math.pi*1.52,label='MnO₂ 环形正极',vector=(1,0,0))
            ring('Separator_tube',r*.55,r*.51,h*.89,(0,0,-h*.01),'electrolyte',0,theta=math.pi*1.52,label='筒状隔膜',vector=(1,0,0))
            cyl('Zinc_gel_anode',r*.49,h*.84,(0,0,-h*.01),'anode',0,label='中心锌凝胶负极')
            cyl('Brass_current_pin',r*.09,h*.94,(0,0,-h*.01),'copper',0,label='黄铜负极集流针')
        else:
            # Open radial sectors are a readable schematic of repeated jelly-roll layers.
            for i in range(7):
                outer=r*(.22+i*.1)
                ring('Wound_negative_electrode',outer,outer-r*.025,h*.87,(0,0,0),'anode',0,theta=math.pi*1.52,label='卷绕负极',vector=(1,0,0))
                if profile in ['solid','gel']:ring('Wound_artificial_SEI',outer+r*.003,outer,h*.87,(0,0,0),'sei',0,theta=math.pi*1.52,label='人工界面层（显示加厚）',vector=(1,0,0))
                ring('Wound_separator',outer+r*.022,outer+r*.005,h*.89,(0,0,0),'electrolyte',0,theta=math.pi*1.52,label='卷绕隔膜',vector=(1,0,0))
                ring('Wound_positive_electrode',outer+r*.05,outer+r*.027,h*.87,(0,0,0),'cathode',0,theta=math.pi*1.52,label='卷绕正极',vector=(1,0,0))
            cyl('Central_mandrel',r*.09,h*.9,(0,0,0),'seal',0,label='中心结构（示意）')
            box('Positive_tab',(r*.2,r*.2,h*.14),(-r*.4,0,h*.41),'collector',1,label='正极集流连接')
            box('Negative_tab',(r*.2,r*.2,h*.14),(r*.4,0,-h*.41),'copper',-1,label='负极集流连接')
        ring('Top_insulator',r*.96,r*.32,h*.014,(0,0,h*.455),'seal',1,label='顶部绝缘垫片')
        ring('Seal_gasket',r*.98,r*.88,h*.065,(0,0,h*.49),'seal',2,label='封口密封圈')
        cyl('Pressure_release_disc',r*.8,h*.014,(0,0,h*.485),'collector',2,label='泄压盘（示意）')
        cyl('Positive_terminal_cap',r*.38,h*.045,(0,0,h*.535),'collector',3,label='正极端帽')
        ring('Rolled_can_rim',r*1.012,r*.955,h*.024,(0,0,h*.488),'shell',2,label='卷封边缘')
        ring('Bottom_can_seam',r*1.004,r*.965,h*.016,(0,0,-h*.49),'shell',-3,label='金属底缘')
    elif model=='pem':
        w,h,d=width,height,depth
        # Component relationships: https://www.energy.gov/cmei/fuels/parts-fuel-cell
        # Display thicknesses and repeated surface texture are not measured microstructure.
        scene['construction_reference']='https://www.energy.gov/cmei/fuels/parts-fuel-cell'
        layers=[('Negative_endplate','shell',1.25,1,'燃料侧端板'),
                ('Negative_collector','copper',.27,.91,'燃料侧集流板'),
                ('Anode_flow_plate','anode',1.10,.91,'燃料侧流场板'),
                ('Anode_GDL','seal',.25,.68,'燃料侧气体扩散层'),
                ('Anode_catalyst','anode',.12,.66,'燃料侧催化层'),
                ('Electrolyte_membrane','electrolyte',.20,.85,'质子交换聚合物膜'),
                ('Cathode_catalyst','cathode',.12,.66,'氧侧催化层'),
                ('Cathode_GDL','seal',.25,.68,'氧侧气体扩散层'),
                ('Cathode_flow_plate','cathode',1.10,.91,'氧侧流场板'),
                ('Positive_collector','collector',.27,.91,'氧侧集流板'),
                ('Positive_endplate','shell',1.25,1,'氧侧端板')]
        unit=d*.82/sum(layer[2] for layer in layers);gap=d*.009;z=-(d*.82+gap*10)/2
        for i,(name,role,weight,footprint,label) in enumerate(layers):
            t=unit*weight;center=z+t/2;z+=t+gap;group=(i-5)*.45
            plate(name,(w*footprint,h*footprint,t),(0,0,center),role,group,label)
            if 'flow_plate' in name:
                direction=1 if name.startswith('Anode') else -1
                relief=gap*.85
                flow_field(w,h,center+direction*(t/2+relief/2),relief,role,group)
            if 'GDL' in name:
                frame('MEA_gasket',(w*.895,h*.895),(w*.705,h*.705),t*.96,(0,0,center),'seal',group,'膜电极周边完整密封垫片')
            if 'collector' in name:
                plate('Collector_connection_lug',(w*.16,h*.20,t),(w*.22,h*.49,center),role,group,'集流板电连接耳')
        compression_hardware(w,h,d,d*.468,2.5)
        compression_hardware(w,h,d,-d*.468,-2.5)
        for face,direction,group in [(d*.455,1,2.25),(-d*.455,-1,-2.25)]:
            for x,y in [(-w*.25,-h*.29),(w*.25,h*.29)]:
                cyl('Port_recess',min(w,h)*.028,d*.006,(x,y,face+direction*d*.004),'seal',group,label='气路接口内孔（示意）',vertices=32)
                ring('Gas_port_collar',min(w,h)*.041,min(w,h)*.027,d*.065,(x,y,face+direction*d*.035),'collector',group,label='端板气路接口（示意）')
    elif model=='sofc':
        w,h,d=width,height,depth
        layers=[('Fuel_interconnect','collector','燃料侧连接体'),('Fuel_channel','seal','燃料气体通道'),('Porous_NiYSZ','anode','多孔 Ni–YSZ 燃料电极'),('Dense_YSZ','electrolyte','致密 YSZ 陶瓷电解质'),('Porous_oxygen_electrode','cathode','多孔氧电极'),('Air_channel','seal','空气气体通道'),('Air_interconnect','collector','空气侧连接体')]
        for i,(name,role,label) in enumerate(layers):
            z=(i-3)*d/8;group=(i-3)*.5
            if 'channel' in name:
                flow_field(w,h,z,d*.055,'collector',group)
            else:
                footprint=.91 if role=='collector' else (.83 if role=='electrolyte' else .73)
                plate(name,(w*footprint,h*footprint,d*(.03 if name=='Dense_YSZ' else .08)),(0,0,z),role,group,label)
        for z,g in [(-d*.24,-1),(d*.24,1)]:
            frame('High_temperature_seal',(w*.95,h*.95),(w*.84,h*.84),d*.025,(0,0,z),'seal',g,'高温玻璃陶瓷周边密封（概念）')
    elif model=='lead':
        w,h,d=width,height,depth
        box('Polymer_case_base',(w,h*.04,d),(0,-h*.48,0),'shell',-3,label='耐酸聚合物单体槽底')
        for x in [-w*.5,w*.5]:box('Case_side',(w*.03,h,d),(x,0,0),'shell',-3,label='耐酸槽侧壁')
        for z in [-d*.5,d*.5]:box('Case_front',(w,h,d*.03),(0,0,z),'shell',-3,label='耐酸槽壁')
        for i in range(7):
            role='cathode' if i%2==0 else 'anode'
            z=(i-3)*d*.105
            box('Lead_plate_grid',(w*.78,h*.74,d*.028),(0,-h*.03,z),'collector',(i-3)*.55,label='铅合金板栅集流体')
            box('Active_plate',(w*.74,h*.7,d*.035),(0,-h*.03,z+d*.025),role,(i-3)*.55,label='PbO₂ 正极板' if role=='cathode' else 'Pb 负极板')
            box('Plate_lug',(w*.1,h*.13,d*.035),((-1 if role=='cathode' else 1)*w*.28,h*.39,z),role,(i-3)*.55,label='极板连接耳')
            if i<6:box('Acid_separator',(w*.8,h*.77,d*.025),(0,-h*.03,z+d*.06),'electrolyte',(i-3)*.55,label='硫酸浸润玻纤隔板' if config.get('electrolyte')=='acidagm' else '隔板 / 硫酸电解质示意')
        for x,role in [(-w*.28,'cathode'),(w*.28,'anode')]:
            box('Lead_busbar',(w*.16,h*.055,d*.78),(x,h*.44,0),'collector',3,label='极板汇流连接')
            cyl('Terminal_post',w*.06,h*.12,(x,h*.49,0),'collector',3,vector=(0,1,0),label='电极端子').rotation_euler.x=math.pi/2
        box('Case_lid',(w,h*.05,d),(0,h*.5,0),'shell',4,vector=(0,1,0),label='耐酸槽盖')
        cyl('Vent_or_valve',w*.035,h*.08,(0,h*.54,0),'seal',4,vector=(0,1,0),label='排气口 / 调压阀').rotation_euler.x=math.pi/2
    elif model in ['afc','pafc','mcfc']:
        w,h,d=width,height,depth
        layers=[('Fuel_interconnect','collector','燃料侧连接 / 流场板'),('Fuel_porous_electrode','anode','燃料侧多孔电极'),('Immobilized_electrolyte','electrolyte','电解质固定化基体'),('Oxygen_porous_electrode','cathode','氧侧多孔电极'),('Oxygen_interconnect','collector','氧侧连接 / 流场板')]
        for i,(name,role,label) in enumerate(layers):
            z=(i-2)*d/6;group=i-2
            footprint=.90 if role=='collector' else (.83 if role=='electrolyte' else .70)
            plate(name,(w*footprint,h*footprint,d*.08),(0,0,z),role,group,label)
            if role=='collector':
                direction=1 if i==0 else -1
                flow_field(w,h,z+direction*d*.058,d*.035,'collector',group)
        for z,g in [(-d*.19,-1),(d*.19,1)]:
            frame('Fuel_cell_seal',(w*.92,h*.92),(w*.74,h*.74),d*.025,(0,0,z),'seal',g,'高温周边密封' if model=='mcfc' else '完整气体密封垫')
        for z,g in [(-d*.48,-3),(d*.48,3)]:plate('End_plate',(w,h,d*.07),(0,0,z),'shell',g,'电堆端板')
        compression_hardware(w,h,d,d*.526,3)
        compression_hardware(w,h,d,-d*.526,-3)
    elif model=='carbonzinc':
        r=width/2;h=height
        ring('Zinc_negative_can',r,r*.91,h,(0,0,0),'anode',0,theta=math.pi*1.52,label='锌负极壳',vector=(1,0,0))
        ring('Paste_electrolyte_separator',r*.9,r*.81,h*.86,(0,0,0),'electrolyte',0,theta=math.pi*1.52,label='糊状电解质 / 隔板',vector=(1,0,0))
        ring('MnO2_carbon_cathode',r*.8,r*.18,h*.83,(0,0,0),'cathode',0,theta=math.pi*1.52,label='MnO₂ / 碳正极混合层',vector=(1,0,0))
        cyl('Carbon_current_rod',r*.14,h*.95,(0,0,0),'seal',0,label='中心碳集流棒')
        cyl('Sealing_cap',r*.95,h*.035,(0,0,h*.48),'shell',2,label='顶部密封盖')
        cyl('Positive_cap',r*.35,h*.045,(0,0,h*.52),'collector',3,label='正极端帽')
        cyl('Negative_base',r,h*.025,(0,0,-h*.51),'anode',-2,label='负极底部')
    elif model in ['solar','solarfilm','thinbattery']:
        w,h,d=width,height,depth
        root['device_scope']='Single cell / research device schematic; not a complete photovoltaic module'
        if model=='thinbattery':
            layers=[('Substrate','shell',.25,1,1,'薄膜基底'),('Bottom_collector','collector',.055,.88,.84,'底部集流体'),
                    ('LCO_film','cathode',.10,.79,.73,'LCO 正极薄膜'),('LiPON_film','electrolyte',.075,.83,.78,'LiPON 电解质薄膜'),
                    ('Li_film','anode',.075,.74,.68,'锂负极薄膜'),('Top_collector','collector',.045,.70,.64,'顶部集流体'),
                    ('Encapsulation','shell',.15,.93,.87,'薄膜电池封装')]
        elif model=='solar':
            layers=[('Backsheet','shell',.19,1,1,'背部保护'),('Back_contact','collector',.055,.94,.94,'背部金属接触'),
                    ('Silicon_junction','cathode',.18,.91,.91,'硅吸光与结区（示意）'),('Passivation_AR','electrolyte',.04,.91,.91,'钝化 / 减反功能层'),
                    ('Encapsulant','seal',.10,.955,.955,'封装胶膜'),('Cover_glass','shell',.18,.985,.985,'盖板玻璃')]
        else:
            layers=[('Substrate','shell',.23,1,1,'器件基底'),('Back_contact','anode',.075,.90,.88,'背接触 / 选择性传输层'),
                    ('Absorber_film','cathode',.12,.80,.77,'吸光薄膜'),('Window_transport','electrolyte',.055,.82,.79,'窗口 / 功能层'),
                    ('Transparent_contact','collector',.045,.85,.82,'透明导电接触'),('Encapsulation','shell',.17,.95,.90,'器件封装保护')]
        gap=d*.025;total=sum(layer[2] for layer in layers)*d+gap*(len(layers)-1);z=-total/2;surface={}
        for i,(name,role,fraction,sx,sy,label) in enumerate(layers):
            t=d*fraction;center=z+t/2;group=(i-len(layers)/2)*.65;z+=t+gap
            obj=plate(name,(w*sx,h*sy,t),(0,0,center),role,group,label,radius=min(w,h)*(.015 if role=='cathode' else .025))
            surface[name]=(center+t/2,group)
        cap_name='Cover_glass' if model=='solar' else 'Encapsulation'
        cap_z,cap_group=surface[cap_name]
        cap=layers[-1]
        frame('Device_edge_seal',(w*cap[3],h*cap[4]),(w*(cap[3]-.025),h*(cap[4]-.025)),d*.038,(0,0,cap_z-d*cap[2]*.5),'seal',cap_group,'器件周边封装密封',radius=min(w,h)*.025)
        if model=='solar':
            front_z,group=surface['Passivation_AR'];front_z+=d*.012
            specs=[(w*.89,h*.0022,d*.008,(0,(j-13.5)*h*.0315,front_z),h*.001) for j in range(28)]
            plates('Front_fingers',specs,'collector',group,'前表面金属细栅')
            plates('Front_busbars',[(w*.012,h*.91,d*.012,(x,0,front_z+d*.005),w*.005) for x in [-w*.28,0,w*.28]],'collector',group,'前表面主栅与细栅连接')
            plates('Cell_contact_lands',[(w*.056,h*.030,d*.020,(x,y,front_z+d*.012),w*.005) for x in [-w*.28,0,w*.28] for y in [-h*.44,h*.44]],'collector',group,'电池片连接焊盘（示意）')
        else:
            bottom_name='Bottom_collector' if model=='thinbattery' else 'Back_contact'
            top_name='Top_collector' if model=='thinbattery' else 'Transparent_contact'
            for sign,layer_name in [(-1,bottom_name),(1,top_name)]:
                contact_z,group=surface[layer_name]
                x=sign*w*.28;y=sign*h*.457
                plate('Contact_pad',(w*.20,h*.060,d*.025),(x,y,contact_z+d*.014),'collector',group,'器件电接触焊盘（示意）',radius=w*.007)
                plate('Contact_trace',(w*.052,h*.15,d*.015),(x,sign*h*.385,contact_z+d*.010),'collector',group,'功能层至焊盘连接（示意）',radius=w*.006)
            # A narrow visible inactive margin makes the patterned active area legible.
            absorber='LCO_film' if model=='thinbattery' else 'Absorber_film'
            active_z,group=surface[absorber]
            dims=next(layer for layer in layers if layer[0]==absorber)
            frame('Active_area_border',(w*(dims[3]+.022),h*(dims[4]+.022)),(w*dims[3],h*dims[4]),d*.010,(0,0,active_z-d*.005),'seal',group,'图形化有效区边缘（示意）',radius=min(w,h)*.018)
    elif model=='rtg':
        r=width/2;h=height
        ring('RTG_outer_housing',r,r*.85,h,(0,0,0),'shell',0,theta=math.pi*1.55,label='热电核电源外壳（示意）',vector=(1,0,0))
        ring('Thermoelectric_converter',r*.76,r*.64,h*.8,(0,0,0),'converter',0,theta=math.pi*1.55,label='热电转换组件',vector=(1,0,0))
        ring('Thermal_insulation',r*.59,r*.48,h*.82,(0,0,0),'seal',0,theta=math.pi*1.55,label='热隔离 / 保温',vector=(1,0,0))
        for i in range(4):
            box('Sealed_heat_source_module',(r*.62,r*.62,h*.17),(0,0,(i-1.5)*h*.2),'heat',0,label='密封热源功能模块（无核源加工细节）')
        for i in range(8):
            angle=2*math.pi*i/8
            obj=box('Radiator_fin',(r*.75,r*.038,h*.88),(math.cos(angle)*r*1.18,math.sin(angle)*r*1.18,0),'shell',0,label='散热鳍片')
            obj.rotation_euler.z=angle
        cyl('RTG_top_cap',r,h*.04,(0,0,h*.52),'shell',3,label='上端盖')
        cyl('RTG_base',r,h*.04,(0,0,-h*.52),'shell',-3,label='安装端盖')
    elif model=='beta':
        w,h,d=width,height,depth
        layers=[('Package_base','shell','气密封装基底'),('Bottom_contact','collector','下电极接触'),('Semiconductor_junction_lower','converter','下半导体结'),('Beta_source_schematic','heat','β 源功能层（示意）'),('Semiconductor_junction_upper','converter','上半导体结'),('Top_contact','copper','上电极接触'),('Package_lid','shell','封装盖')]
        for i,(name,role,label) in enumerate(layers):box(name,(w*(1 if role=='shell' else .8),h*(1 if role=='shell' else .8),d*.09),(0,0,(i-3)*d*.14),role,(i-3)*.75,label=label)
        for x in [-w*.52,w*.52]:
            for y in [-h*.25,h*.25]:box('Electrical_pin',(w*.3,h*.08,d*.06),(x,y,-d*.2),'collector',-1,label='电连接引脚')
    else:
        raise ValueError('Unsupported model')
    for obj in scene.objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active=root
    bpy.ops.export_scene.gltf(filepath=filepath,export_format='GLB',use_selection=True,use_active_scene=True,export_extras=True,export_apply=True,export_cameras=False,export_lights=False)
    scene.world=bpy.data.worlds.get('BatteryLab_World') or bpy.data.worlds.new('BatteryLab_World')
    scene.world.color=(0.07,0.07,0.07)
    bounds=[o for o in scene.objects if o.type=='MESH']
    print(json.dumps({'filepath':filepath,'objects':len(bounds),'model':model,'profile':profile,'source_date':'2026-10-03','schematic':True},ensure_ascii=False))
    return scene
