// PRACTICE PAGE
const { useState, useEffect } = React;

const QUESTIONS = [
  {
    id:1, subject:'Science', chapter:'Newton\'s Laws', difficulty:'Medium',
    text: 'A player kicks a football. According to Newton\'s Third Law, which of the following is correct?',
    opts: ['Only the football experiences a force','Only the player\'s foot experiences a force','Both the football and foot experience equal and opposite forces','No forces are involved in kicking'],
    ans: 2,
    explanation: 'Newton\'s Third Law states that for every action there is an equal and opposite reaction. When the foot kicks the ball (action), the ball exerts an equal force back on the foot (reaction). Both forces are equal in magnitude but opposite in direction.',
  },
  {
    id:2, subject:'Math', chapter:'Quadratic Equations', difficulty:'Hard',
    text: 'What are the roots of the quadratic equation x² - 5x + 6 = 0?',
    opts: ['x = 1, x = 6','x = 2, x = 3','x = -2, x = -3','x = -1, x = -6'],
    ans: 1,
    explanation: 'Using factorization: x² - 5x + 6 = (x-2)(x-3) = 0. Therefore x = 2 or x = 3. We can verify: 2² - 5(2) + 6 = 4 - 10 + 6 = 0 ✓ and 3² - 5(3) + 6 = 9 - 15 + 6 = 0 ✓',
  },
  {
    id:3, subject:'Science', chapter:'Life Processes', difficulty:'Easy',
    text: 'Which organelle is known as the "powerhouse of the cell"?',
    opts: ['Nucleus','Ribosome','Mitochondria','Golgi apparatus'],
    ans: 2,
    explanation: 'Mitochondria are called the powerhouse of the cell because they produce ATP (adenosine triphosphate) through the process of cellular respiration. ATP is the primary energy currency of the cell.',
  },
  {
    id:4, subject:'Math', chapter:'Triangles', difficulty:'Medium',
    text: 'In a right triangle, if one angle is 30°, what is the third angle?',
    opts: ['30°','45°','60°','90°'],
    ans: 2,
    explanation: 'The sum of angles in a triangle = 180°. We have 90° + 30° + x = 180°, so x = 60°. The angles are 90°, 30°, and 60°.',
  },
  {
    id:5, subject:'Science', chapter:'Chemical Reactions', difficulty:'Medium',
    text: 'What type of reaction is: 2H₂ + O₂ → 2H₂O?',
    opts: ['Decomposition reaction','Displacement reaction','Combination reaction','Double displacement reaction'],
    ans: 2,
    explanation: 'This is a combination (synthesis) reaction because two or more reactants (H₂ and O₂) combine to form a single product (H₂O). The general form is: A + B → AB.',
  },
];

const DIFF_COLORS = { Easy:'#16A34A', Medium:'#B45309', Hard:'#DC2626' };
const SUB_COLORS  = { Science:'#2563EB', Math:'#16A34A', English:'#7C3AED', SST:'#B45309' };

function Practice({ navigate }) {
  const [qIndex, setQIndex]   = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore]     = useState({ correct:0, wrong:0, total:0 });
  const [filterDiff, setFilterDiff] = useState('All');
  const [filterSub,  setFilterSub]  = useState('All');

  const filtered = QUESTIONS.filter(q =>
    (filterDiff === 'All' || q.difficulty === filterDiff) &&
    (filterSub  === 'All' || q.subject   === filterSub)
  );
  const q = filtered[qIndex % filtered.length];

  const choose = (i) => {
    if (revealed) return;
    setSelected(i);
  };

  const checkAnswer = () => {
    if (selected === null) return;
    setRevealed(true);
    if (selected === q.ans) setScore(s => ({...s, correct:s.correct+1, total:s.total+1}));
    else setScore(s => ({...s, wrong:s.wrong+1, total:s.total+1}));
  };

  const nextQ = () => {
    setSelected(null); setRevealed(false);
    setQIndex(i => (i + 1) % filtered.length);
  };

  const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  const S = {
    page:   { padding:'28px 32px',minHeight:'calc(100vh - 60px)',background:'#F8FAFC',fontFamily:"'Sora',sans-serif" },
    layout: { display:'grid',gridTemplateColumns:'1fr 320px',gap:20,alignItems:'start' },
    filterRow: { display:'flex',gap:8,marginBottom:20,flexWrap:'wrap',alignItems:'center' },
    filterLbl: { fontSize:12,fontWeight:600,color:'#64748B',marginRight:4 },
    fBtn:   (act,col) => ({ padding:'5px 14px',borderRadius:999,fontSize:12,fontWeight:600,border:'1.5px solid',borderColor:act?(col||'#2563EB'):'#E2E8F0',background:act?(col+'18'||'#EFF6FF'):'#fff',color:act?(col||'#2563EB'):'#64748B',cursor:'pointer',fontFamily:"'Sora',sans-serif",transition:'all .2s' }),
    qCard:  { background:'#fff',border:'1px solid #E2E8F0',borderRadius:16,padding:'28px',marginBottom:16 },
    qMeta:  { display:'flex',gap:8,marginBottom:18,alignItems:'center' },
    qText:  { fontSize:17,fontWeight:600,color:'#0F172A',lineHeight:1.55,marginBottom:24 },
    opts:   { display:'flex',flexDirection:'column',gap:10 },
    opt:    (i,sel,rev,correct) => {
      let bg='#F8FAFC',border='#E2E8F0',color='#0F172A';
      if(rev && i===correct){ bg='#DCFCE7';border='#86EFAC';color='#16A34A'; }
      else if(rev && i===sel && i!==correct){ bg='#FFF1F2';border='#FCA5A5';color='#DC2626'; }
      else if(!rev && i===sel){ bg='#EFF6FF';border='#93C5FD';color='#2563EB'; }
      return { display:'flex',alignItems:'center',gap:12,padding:'13px 16px',border:`1.5px solid ${border}`,borderRadius:10,background:bg,color,cursor:rev?'default':'pointer',transition:'all .2s',fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:500 };
    },
    optLbl: { width:26,height:26,borderRadius:'50%',background:'rgba(0,0,0,.06)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0 },
    explBox:{ background:'#F0FDF4',border:'1px solid #86EFAC',borderRadius:12,padding:'16px',marginTop:16 },
    explH:  { fontSize:13,fontWeight:700,color:'#16A34A',marginBottom:6 },
    explT:  { fontSize:13,color:'#166534',lineHeight:1.65 },
    btnRow: { display:'flex',gap:10,marginTop:20 },
    checkBtn:{ flex:1,padding:'12px',background:'linear-gradient(135deg,#2563EB,#16A34A)',color:'#fff',border:'none',borderRadius:10,fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:700,cursor:'pointer',transition:'all .2s',boxShadow:'0 2px 10px rgba(37,99,235,.2)' },
    nextBtn: { padding:'12px 20px',background:'#F8FAFC',border:'1.5px solid #E2E8F0',borderRadius:10,fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:600,color:'#64748B',cursor:'pointer',transition:'all .2s' },
    panel:  { display:'flex',flexDirection:'column',gap:16 },
    pCard:  { background:'#fff',border:'1px solid #E2E8F0',borderRadius:14,padding:20 },
    pH:     { fontSize:12,fontWeight:700,color:'#64748B',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:14 },
    bigN:   { fontSize:36,fontWeight:800,color:'#0F172A',letterSpacing:'-.04em',lineHeight:1,marginBottom:4 },
    progList:{ display:'flex',flexDirection:'column',gap:10,marginTop:4 },
    progRow: { display:'flex',alignItems:'center',gap:10 },
    progBar: { flex:1,height:5,background:'#F1F5F9',borderRadius:3,overflow:'hidden' },
    progFill:(w,c) => ({ height:'100%',width:`${w}%`,background:c,borderRadius:3,transition:'width 1s ease' }),
  };

  return (
    <div style={S.page}>
      {/* Filters */}
      <div style={S.filterRow}>
        <span style={S.filterLbl}>Subject:</span>
        {['All','Science','Math','English','SST'].map(f => (
          <button key={f} style={S.fBtn(filterSub===f, SUB_COLORS[f]||'#2563EB')} onClick={()=>{setFilterSub(f);setQIndex(0);setSelected(null);setRevealed(false);}}>
            {f}
          </button>
        ))}
        <span style={{...S.filterLbl,marginLeft:8}}>Difficulty:</span>
        {['All','Easy','Medium','Hard'].map(f => (
          <button key={f} style={S.fBtn(filterDiff===f, DIFF_COLORS[f]||'#2563EB')} onClick={()=>{setFilterDiff(f);setQIndex(0);setSelected(null);setRevealed(false);}}>
            {f}
          </button>
        ))}
        <div style={{ marginLeft:'auto',fontSize:13,color:'#64748B' }}>
          Q {(qIndex % filtered.length)+1} of {filtered.length}
        </div>
      </div>

      <div style={S.layout}>
        {/* Question area */}
        <div>
          <div style={S.qCard}>
            <div style={S.qMeta}>
              <Badge color="blue">{q.subject}</Badge>
              <Badge color={q.difficulty==='Easy'?'green':q.difficulty==='Hard'?'red':'orange'}>{q.difficulty}</Badge>
              <span style={{ fontSize:12,color:'#94A3B8' }}>{q.chapter}</span>
            </div>
            <div style={S.qText}>{q.text}</div>
            <div style={S.opts}>
              {q.opts.map((opt,i) => (
                <div key={i} style={S.opt(i,selected,revealed,q.ans)} onClick={() => choose(i)}>
                  <div style={S.optLbl}>{['A','B','C','D'][i]}</div>
                  {opt}
                  {revealed && i === q.ans && <span style={{ marginLeft:'auto',color:'#16A34A',fontWeight:700 }}>✓</span>}
                  {revealed && i === selected && i !== q.ans && <span style={{ marginLeft:'auto',color:'#DC2626',fontWeight:700 }}>✗</span>}
                </div>
              ))}
            </div>

            {revealed && (
              <div style={S.explBox}>
                <div style={S.explH}>💡 Explanation</div>
                <div style={S.explT}>{q.explanation}</div>
              </div>
            )}

            <div style={S.btnRow}>
              {!revealed ? (
                <button style={{...S.checkBtn, opacity: selected===null?0.5:1}} onClick={checkAnswer}>
                  Check Answer
                </button>
              ) : (
                <button style={S.checkBtn} onClick={nextQ}>Next Question →</button>
              )}
              {!revealed && (
                <button style={S.nextBtn} onClick={nextQ}>Skip →</button>
              )}
              {!revealed && (
                <button style={{...S.nextBtn,color:'#2563EB',borderColor:'#BFDBFE',background:'#EFF6FF'}} onClick={() => navigate('tutor')}>
                  Ask AI
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div style={S.panel}>
          <div style={S.pCard}>
            <div style={S.pH}>Session Score</div>
            <div style={{ display:'flex',alignItems:'flex-end',gap:8,marginBottom:12 }}>
              <div style={S.bigN}>{score.correct}</div>
              <div style={{ fontSize:14,color:'#64748B',paddingBottom:6 }}>/ {score.total} correct</div>
            </div>
            <div style={S.progList}>
              <div style={S.progRow}>
                <span style={{ fontSize:12,color:'#16A34A',fontWeight:600,width:52 }}>Correct</span>
                <div style={S.progBar}><div style={S.progFill(score.total?score.correct/score.total*100:0,'#16A34A')}></div></div>
                <span style={{ fontSize:12,fontWeight:700,color:'#16A34A' }}>{score.correct}</span>
              </div>
              <div style={S.progRow}>
                <span style={{ fontSize:12,color:'#DC2626',fontWeight:600,width:52 }}>Wrong</span>
                <div style={S.progBar}><div style={S.progFill(score.total?score.wrong/score.total*100:0,'#DC2626')}></div></div>
                <span style={{ fontSize:12,fontWeight:700,color:'#DC2626' }}>{score.wrong}</span>
              </div>
            </div>
            <div style={{ marginTop:14,padding:'10px',background: accuracy>=70?'#F0FDF4':'#FFF7ED',borderRadius:8,textAlign:'center' }}>
              <div style={{ fontSize:24,fontWeight:800,color:accuracy>=70?'#16A34A':'#B45309' }}>{accuracy}%</div>
              <div style={{ fontSize:11,color:'#64748B' }}>Accuracy</div>
            </div>
          </div>

          <div style={S.pCard}>
            <div style={S.pH}>Chapter Progress</div>
            {[['Newton\'s Laws',78,'#2563EB'],['Life Processes',45,'#16A34A'],['Chemical Rxns',92,'#7C3AED']].map(([name,pct,col],i)=>(
              <div key={i} style={{ marginBottom:12 }}>
                <div style={{ display:'flex',justifyContent:'space-between',marginBottom:4 }}>
                  <span style={{ fontSize:12,fontWeight:500,color:'#0F172A' }}>{name}</span>
                  <span style={{ fontSize:12,fontWeight:700,color:col }}>{pct}%</span>
                </div>
                <div style={S.progBar}><div style={S.progFill(pct,col)}></div></div>
              </div>
            ))}
          </div>

          <button onClick={() => navigate('tests')} style={{ width:'100%',padding:'12px',background:'#F5F3FF',border:'1px solid rgba(124,58,237,.2)',borderRadius:12,fontFamily:"'Sora',sans-serif",fontSize:14,fontWeight:600,color:'#7C3AED',cursor:'pointer',transition:'all .2s' }}
            onMouseEnter={e=>{ e.currentTarget.style.background='#EDE9FE'; }}
            onMouseLeave={e=>{ e.currentTarget.style.background='#F5F3FF'; }}>
            Take a Full Mock Test →
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Practice });
