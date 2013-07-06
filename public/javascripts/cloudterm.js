;$(function(){
  var $editor = $("#editor");
  var $run = $("#run")
  var $form= $("#execform")
  if($editor.length==0) {
    return;
  }
  var editor = ace.edit("editor");

  editor.setReadOnly(true);
  editor.getSession().setUseSoftTabs(true);
  editor.getSession().setTabSize(2);
  editor.getSession().setMode(new (require("ace/mode/ruby").Mode));
  editor.setTheme("ace/theme/idle_fingers");

  docName=$editor.data("sessionId");

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
    var url = '/sessions/'+docName+'/exec';
    console.log(url);
    $.post(url,$form.serialize(),function(results){
      $("#results").append(results);
    });
  });
});

