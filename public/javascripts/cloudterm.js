;$(function(){
  var $editor = $("#editor");
  var $run = $("#run")
  var $form= $("#execform")
  if($editor.length==0) {
    return;
  }
  docName=$editor.data("sessionId");
  docHeight =  $(window).height() - $(".editor-row").offset().top - 40;
  $("#editor").css("height",docHeight+"px");
  $("#results").css("height",docHeight+"px");
  var editor = ace.edit("editor");
  var socket= new io.connect('http://'+window.location.host);
  var rubyMode = new (require("ace/mode/ruby").Mode);
  var pythonMode = new (require("ace/mode/python").Mode);
  var jsMode = new (require("ace/mode/javascript").Mode);
  editor.setReadOnly(true);
  editor.getSession().setUseSoftTabs(true);
  editor.getSession().setTabSize(2);
  editor.getSession().setMode(rubyMode);
  editor.setTheme("ace/theme/idle_fingers");


  socket.on('/results/'+docName,function(data){
    $('<pre>'+data.output+'</pre>').hide().prependTo($("#results")).slideDown();
  });
  
  $("#execform select[name='language']").change(function(){
    var modes = {"ruby":rubyMode,"python":pythonMode,"node":jsMode};
    editor.getSession().setMode(modes[$(this).val()]);
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

