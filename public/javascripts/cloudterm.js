;$(function(){
  var $editor = $("#editor");
  var $run = $("#run")
  var $form= $("#execform")
  if($editor.length==0) {
    return;
  }
  var editor = ace.edit("editor");
  var socket= new io.connect('http://'+window.location.host);
  
  editor.setReadOnly(true);
  editor.getSession().setUseSoftTabs(true);
  editor.getSession().setTabSize(2);
  editor.getSession().setMode(new (require("ace/mode/ruby").Mode));
  editor.setTheme("ace/theme/idle_fingers");

  docName=$editor.data("sessionId");

  socket.on('/results/'+docName,function(data){
    $("#results").prepend('<pre>'+data.output+'</pre>');
  });

  sharejs.open(docName, 'text', function(error, doc) {
    if (error) {
      console.error(error);
      return;
    }

    if (doc.created) {
      doc.insert(0, "# do something great here")
    }

    doc.attach_ace(editor);
    editor.setReadOnly(false);
    //editor.resize();
  });
  
  $run.on('click',function(evt){
    evt.preventDefault();
    var lang=$("#execform select[name='language']").val();
    socket.emit('run',{sessionId: docName,language: lang});
  });
});

