#include "ufbx.h"
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
int main(int argc,char**argv){
 if(argc<2)return 2; ufbx_load_opts o={0};o.target_axes=ufbx_axes_right_handed_y_up;o.target_unit_meters=1;ufbx_error e;
 ufbx_scene*s=ufbx_load_file(argv[1],&o,&e);if(!s){fprintf(stderr,"%s",e.description.data);return 1;}
 size_t count=0,joints=0;double lo[3]={1e30,1e30,1e30},hi[3]={-1e30,-1e30,-1e30};FILE*out=argc>2?fopen(argv[2],"wb"):NULL;
 for(size_t ni=0;ni<s->nodes.count;ni++){ufbx_node*n=s->nodes.data[ni];if(!n->mesh)continue;ufbx_mesh*m=n->mesh;count+=m->num_triangles;for(size_t j=0;j<m->skin_deformers.count;j++)joints+=m->skin_deformers.data[j]->clusters.count;
 ufbx_matrix normal=ufbx_matrix_for_normals(&n->geometry_to_world);uint32_t*ix=malloc(m->max_face_triangles*3*sizeof(uint32_t));
 for(size_t fi=0;fi<m->faces.count;fi++){size_t tris=ufbx_triangulate_face(ix,m->max_face_triangles*3,m,m->faces.data[fi]);for(size_t k=0;k<tris*3;k++){uint32_t v=ix[k];ufbx_vec3 p=ufbx_transform_position(&n->geometry_to_world,ufbx_get_vertex_vec3(&m->vertex_position,v));ufbx_vec3 norm=ufbx_vec3_normalize(ufbx_transform_direction(&normal,ufbx_get_vertex_vec3(&m->vertex_normal,v)));ufbx_vec2 uv=ufbx_get_vertex_vec2(&m->vertex_uv,v);double ps[3]={p.x,p.y,p.z};for(int q=0;q<3;q++){if(ps[q]<lo[q])lo[q]=ps[q];if(ps[q]>hi[q])hi[q]=ps[q];}float data[8]={p.x,p.y,p.z,norm.x,norm.y,norm.z,uv.x,1-uv.y};if(out)fwrite(data,sizeof(float),8,out);}}
 free(ix);}
 printf("{\"triangles\":%zu,\"meshes\":%zu,\"materials\":%zu,\"skinJoints\":%zu,\"clips\":%zu,\"unitMeters\":%g,\"min\":[%g,%g,%g],\"max\":[%g,%g,%g]}\n",count,s->meshes.count,s->materials.count,joints,s->anim_stacks.count,s->settings.unit_meters,lo[0],lo[1],lo[2],hi[0],hi[1],hi[2]);if(out)fclose(out);ufbx_free_scene(s);
}
