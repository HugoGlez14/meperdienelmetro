const definitions = [
['1','#e65c9c','Observatorio|Tacubaya|Juanacatlán|Chapultepec|Sevilla|Insurgentes|Cuauhtémoc|Balderas|Salto del Agua|Isabel la Católica|Pino Suárez|Merced|Candelaria|San Lázaro|Moctezuma|Balbuena|Boulevard Puerto Aéreo|Gómez Farías|Zaragoza|Pantitlán'],
['2','#1765b0','Cuatro Caminos|Panteones|Tacuba|Cuitláhuac|Popotla|Colegio Militar|Normal|San Cosme|Revolución|Hidalgo|Bellas Artes|Allende|Zócalo/Tenochtitlan|Pino Suárez|San Antonio Abad|Chabacano|Viaducto|Xola|Villa de Cortés|Nativitas|Portales|Ermita|General Anaya|Tasqueña'],
['3','#9b9b26','Indios Verdes|Deportivo 18 de Marzo|Potrero|La Raza|Tlatelolco|Guerrero|Hidalgo|Juárez|Balderas|Niños Héroes/Poder Judicial CDMX|Hospital General|Centro Médico|Etiopía/Plaza de la Transparencia|Eugenia|División del Norte|Zapata|Coyoacán|Viveros/Derechos Humanos|Miguel Ángel de Quevedo|Copilco|Universidad'],
['4','#6cb7ae','Martín Carrera|Talismán|Bondojito|Consulado|Canal del Norte|Morelos|Candelaria|Fray Servando|Jamaica|Santa Anita'],
['5','#e8bc20','Politécnico|Instituto del Petróleo|Autobuses del Norte|La Raza|Misterios|Valle Gómez|Consulado|Eduardo Molina|Aragón|Oceanía|Terminal Aérea|Hangares|Pantitlán'],
['6','#cc353a','El Rosario|Tezozómoc|UAM-Azcapotzalco|Ferrería/Arena Ciudad de México|Norte 45|Vallejo|Instituto del Petróleo|Lindavista|Deportivo 18 de Marzo|La Villa-Basílica|Martín Carrera'],
['7','#e87b26','El Rosario|Aquiles Serdán|Camarones|Refinería|Tacuba|San Joaquín|Polanco|Auditorio|Constituyentes|Tacubaya|San Pedro de los Pinos|San Antonio|Mixcoac|Barranca del Muerto'],
['8','#168a66','Garibaldi/Lagunilla|Bellas Artes|San Juan de Letrán|Salto del Agua|Doctores|Obrera|Chabacano|La Viga|Santa Anita|Coyuya|Iztacalco|Apatlaco|Aculco|Escuadrón 201|Atlalilco|Iztapalapa|Cerro de la Estrella|UAM-I|Constitución de 1917'],
['9','#79513c','Tacubaya|Patriotismo|Chilpancingo|Centro Médico|Lázaro Cárdenas|Chabacano|Jamaica|Mixiuhca|Velódromo|Ciudad Deportiva|Puebla|Pantitlán'],
['A','#8b4b9f','Pantitlán|Agrícola Oriental|Canal de San Juan|Tepalcates|Guelatao|Peñón Viejo|Acatitla|Santa Marta|Los Reyes|La Paz'],
['B','#759487','Buenavista|Guerrero|Garibaldi/Lagunilla|Lagunilla|Tepito|Morelos|San Lázaro|Ricardo Flores Magón|Romero Rubio|Oceanía|Deportivo Oceanía|Bosque de Aragón|Villa de Aragón|Nezahualcóyotl|Impulsora|Río de los Remedios|Múzquiz|Ecatepec|Olímpica|Plaza Aragón|Ciudad Azteca'],
['12','#b69a39','Mixcoac|Insurgentes Sur|Hospital 20 de Noviembre|Zapata|Parque de los Venados|Eje Central|Ermita|Mexicaltzingo|Atlalilco|Culhuacán|San Andrés Tomatlán|Lomas Estrella|Calle 11|Periférico Oriente|Tezonco|Olivos|Nopalera|Zapotitlán|Tlaltenco|Tláhuac']
];
export const lines = definitions.map(([id,color,s])=>({id,color,stations:s.split('|')}));
export const stations = [...new Set(lines.flatMap(l=>l.stations))].sort((a,b)=>a.localeCompare(b,'es'));
export const stationLines = name => lines.filter(l=>l.stations.includes(name));
export const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function findRoute(from,to,mode='fast',blocked=new Set()) {
 if(!stations.includes(from)||!stations.includes(to)) return null;
 if(from===to) return {segments:[],stops:0,transfers:0,minutes:0,path:[from]};
 const distances=new Map(), previous=new Map(), queue=[];
 const key=(s,l)=>JSON.stringify([s,l]);
 for(const l of stationLines(from)){const k=key(from,l.id); distances.set(k,0);queue.push([0,k]);}
 let end;
 while(queue.length){queue.sort((a,b)=>a[0]-b[0]);const [cost,k]=queue.shift();if(cost!==distances.get(k))continue;const [s,id]=JSON.parse(k);if(s===to){end=k;break;}
 const line=lines.find(l=>l.id===id),i=line.stations.indexOf(s);
 const neighbors=[line.stations[i-1],line.stations[i+1]].filter(Boolean).map(n=>[key(n,id),2]);
 for(const l of stationLines(s))if(l.id!==id)neighbors.push([key(s,l.id),mode==='transfers'?1000:5]);
 for(const [next,weight] of neighbors){if(blocked.has([k,next].sort().join('::')))continue;const d=cost+weight;if(d<(distances.get(next)??Infinity)){distances.set(next,d);previous.set(next,k);queue.push([d,next]);}}
 }
 if(!end)return null;
 const nodes=[];for(let k=end;k;k=previous.get(k))nodes.unshift(JSON.parse(k));
 const segments=[];
 for(let i=1;i<nodes.length;i++){const [a,id]=nodes[i-1],[b,nextId]=nodes[i];if(id!==nextId)continue;let seg=segments.at(-1);if(!seg||seg.line.id!==id){seg={line:lines.find(l=>l.id===id),stations:[a]};segments.push(seg);}seg.stations.push(b);}
 for(const seg of segments){const list=seg.line.stations;seg.direction=list.indexOf(seg.stations[0])<list.indexOf(seg.stations.at(-1))?list.at(-1):list[0];}
 const stops=segments.reduce((n,s)=>n+s.stations.length-1,0),transfers=Math.max(0,segments.length-1);
 return {segments,stops,transfers,minutes:stops*2+transfers*5,path:nodes.map(n=>n[0]).filter((n,i,a)=>i===0||n!==a[i-1])};
}

// Generate distinct detours by excluding one connection of the preferred path.
// Alternatives are suggestions, not an exhaustive enumeration of all paths.
export function findRoutes(from,to,mode='fast') {
 const first=findRoute(from,to,mode);if(!first)return [];
 if(!first.stops)return [first];
 const candidates=[first,findRoute(from,to,mode==='fast'?'transfers':'fast')];
 const key=(s,l)=>JSON.stringify([s,l]);
 for(let i=0;i<first.segments.length;i++){
  const seg=first.segments[i];
  for(let j=1;j<seg.stations.length;j++){
   const edge=[key(seg.stations[j-1],seg.line.id),key(seg.stations[j],seg.line.id)].sort().join('::');
   candidates.push(findRoute(from,to,mode,new Set([edge])));
  }
  if(i){const prev=first.segments[i-1];const edge=[key(seg.stations[0],prev.line.id),key(seg.stations[0],seg.line.id)].sort().join('::');candidates.push(findRoute(from,to,mode,new Set([edge])));}
 }
 const seen=new Set();const valid=candidates.filter(r=>{
  if(!r||new Set(r.path).size!==r.path.length||r.minutes>first.minutes+30)return false;
  const id=JSON.stringify(r.segments.map(s=>[s.line.id,s.stations]));if(seen.has(id))return false;seen.add(id);return true;
 });
 valid.sort((a,b)=>mode==='transfers'?(a.transfers-b.transfers||a.minutes-b.minutes):(a.minutes-b.minutes||a.transfers-b.transfers));
 return valid.slice(0,3);
}

