(function(){
  var $=function(id){return document.getElementById(id)};
  var d=document.body.dataset;
  var sets={up:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",lo:"abcdefghijklmnopqrstuvwxyz",nu:"0123456789",sy:"!@#$%^&*()-_=+[]{};:,.?/"};

  var defLen=parseInt(d.len,10)||16;
  $('len').value=defLen;
  $('lenVal').textContent=defLen;
  if(d.fixed==='1'){$('lenWrap').style.display='none';}
  ['up','lo','nu','sy','am'].forEach(function(k){
    if(d[k]==='0'){$(k).checked=false;}
    if(d[k]==='1'){$(k).checked=true;}
  });

  function rnd(n){
    var max=Math.floor(4294967296/n)*n, a=new Uint32Array(1);
    do{crypto.getRandomValues(a)}while(a[0]>=max);
    return a[0]%n;
  }

  function generate(){
    var len=parseInt($('len').value,10), keys=[], pool="";
    var amb=$('am').checked, re=/[O0lI1|]/g;
    ['up','lo','nu','sy'].forEach(function(k){
      if($(k).checked){
        var s=amb?sets[k].replace(re,''):sets[k];
        if(s){keys.push(s);pool+=s;}
      }
    });
    if(!keys.length){$('msg').textContent='Select at least one character type.';return;}
    $('msg').textContent='';
    var out=[];
    keys.forEach(function(s){out.push(s[rnd(s.length)]);});
    while(out.length<len){out.push(pool[rnd(pool.length)]);}
    for(var i=out.length-1;i>0;i--){var j=rnd(i+1),t=out[i];out[i]=out[j];out[j]=t;}
    var pw=out.slice(0,len).join('');
    $('pw').value=pw;
    rate(pw.length,pool.length);
  }

  function rate(len,poolSize){
    var bits=len*Math.log2(poolSize), bar=$('bar'), label, color, w;
    if(bits<40){label='Weak';color='#c0392b';w=25;}
    else if(bits<60){label='Fair';color='#d98a1a';w=50;}
    else if(bits<80){label='Good';color='#7aa62b';w=75;}
    else{label='Strong';color='#00643C';w=100;}
    bar.style.width=w+'%';bar.style.background=color;
    $('strength').textContent='Strength: '+label+' (about '+Math.round(bits)+' bits)';
  }

  function copy(){
    var v=$('pw').value; if(!v) return;
    var done=function(){$('copy').textContent='Copied';setTimeout(function(){$('copy').textContent='Copy'},1500)};
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(v).then(done,function(){fallback(v,done)});
    }else fallback(v,done);
  }
  function fallback(v,done){
    $('pw').select();$('pw').setSelectionRange(0,v.length);
    try{document.execCommand('copy');done();}catch(e){}
  }

  $('len').oninput=function(){$('lenVal').textContent=this.value;generate();};
  ['up','lo','nu','sy','am'].forEach(function(k){$(k).onchange=generate;});
  $('gen').onclick=generate;
  $('copy').onclick=copy;
  generate();
})();
