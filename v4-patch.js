(()=>{
  const SAFE='MT_PRE_V4_';
  function preserveData(){
    ['test','production'].forEach(m=>{
      const x=localStorage.getItem('MT_DATA_'+m);
      if(x&&!localStorage.getItem(SAFE+m)) localStorage.setItem(SAFE+m,x);
    });
    const mode=localStorage.getItem('MT_MODE');
    if(mode&&!localStorage.getItem(SAFE+'MODE')) localStorage.setItem(SAFE+'MODE',mode);
  }
  function addStyles(){
    if(document.getElementById('mt-v4-style')) return;
    const style=document.createElement('style');
    style.id='mt-v4-style';
    style.textContent=`
      .mt-topbar{padding:10px 12px}.mt-top-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
      .mt-top-actions .primary{min-width:145px}.mt-nav{padding:9px 11px}.mt-more{margin-left:auto}
      .mt-more summary{list-style:none;cursor:pointer;background:#e7eef3;color:#183044;border-radius:10px;padding:9px 11px;font-weight:800}
      .mt-more summary::-webkit-details-marker{display:none}.mt-more-menu{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}
      .mt-filter{display:grid;grid-template-columns:auto minmax(150px,240px);gap:10px;align-items:center;margin-top:8px;padding-top:8px;border-top:1px solid var(--line)}
      .mt-filter label{margin:0}.mt-baselines{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px}
      .mt-base-cell{padding:7px;border-radius:8px;background:#f4f7f9}.mt-base-label{font-size:10px;text-transform:uppercase;color:var(--muted)}
      .mt-base-value{font-size:17px;font-weight:900;margin-top:3px}
      @media(max-width:720px){.mt-more{margin-left:0}.mt-filter{grid-template-columns:1fr}.mt-top-actions .primary{flex:1}.mt-nav{flex:1 1 auto}}
    `;
    document.head.appendChild(style);
  }
  function cleanTop(){
    if(typeof app==='undefined'||!app) return;
    const groups=[...app.children].filter(el=>el.classList&&el.classList.contains('actions')&&el.classList.contains('noPrint'));
    const filter=[...app.children].find(el=>el.classList&&el.classList.contains('card')&&el.classList.contains('noPrint'));
    if(groups.length<2||!filter||app.querySelector('.mt-topbar')) return;
    const bar=document.createElement('div');
    bar.className='card mt-topbar noPrint';
    bar.innerHTML=`<div class="mt-top-actions">
      <button class="primary" onclick="scan()">📷 Scan Machine</button>
      <button class="secondary mt-nav" onclick="render()">Dashboard</button>
      <button class="secondary mt-nav" onclick="graphs()">📈 Graphs</button>
      <button class="secondary mt-nav" onclick="history()">🕒 History</button>
      <button class="secondary mt-nav" onclick="report()">📄 Report</button>
      <details class="mt-more"><summary>More ▾</summary><div class="mt-more-menu">
        <button class="secondary" onclick="baseline()">Set Baseline</button>
        <button class="secondary" onclick="backup()">Backup</button>
        <button class="secondary" onclick="transferOut()">Coworker Export</button>
        <button class="secondary" onclick="transferIn()">Coworker Import</button>
        <button class="secondary" onclick="settings()">⚙ Settings</button>
      </div></details></div>
      <div class="mt-filter"><label>Time Frame</label><select id="range" onchange="S.range=this.value;save();render()">
      <option value="today">Today</option><option value="yesterday">Yesterday</option><option value="week">This Week</option><option value="lastweek">Last Week</option><option value="month">This Month</option><option value="lastmonth">Last Month</option><option value="custom">Custom</option></select></div>`;
    app.insertBefore(bar,groups[0]);
    groups[0].remove(); groups[1].remove(); filter.remove();
    const sel=bar.querySelector('#range'); if(sel) sel.value=S.range;
    if(S.range==='custom'){
      const f=bar.querySelector('.mt-filter');
      f.insertAdjacentHTML('beforeend',`<div><label>Start</label><input id="cs" type="date" value="${S.cs||''}"></div><div><label>End</label><input id="ce" type="date" value="${S.ce||''}"></div><button class="primary" onclick="S.cs=cs.value;S.ce=ce.value;save();render()">Apply</button>`);
    }
  }
  function showHaasFeedBaseline(){
    if(typeof S==='undefined'||!S||!Array.isArray(S.machines)) return;
    const m=S.machines.find(x=>x.id===S.selected); if(!m||m.type!=='haas') return;
    const detail=[...app.children].filter(el=>el.classList&&el.classList.contains('card')).find(el=>el.querySelector('.pill')&&el.querySelector('.pill').textContent.includes('HAAS'));
    if(!detail) return;
    const cards=detail.querySelectorAll('.kpis > .card.kpi'); if(cards.length<4) return;
    const b=typeof base==='function'?base(m.id):null;
    cards[3].innerHTML=`<div class="l">Baselines</div><div class="mt-baselines"><div class="mt-base-cell"><div class="mt-base-label">Cycle</div><div class="mt-base-value">${b?Number(b.cycle).toFixed(2):'—'}</div></div><div class="mt-base-cell"><div class="mt-base-label">Feed</div><div class="mt-base-value">${b?Number(b.feed).toFixed(2):'—'}</div></div></div>`;
  }
  function patchDashboard(){addStyles();cleanTop();showHaasFeedBaseline()}
  preserveData();
  if(typeof render==='function'){
    const originalRender=render;
    render=function(){const out=originalRender();patchDashboard();return out};
    patchDashboard();
  }
})();
