KISSY.Editor.add("removeformat",function(m){function n(b){this.editor=b;this._init()}function t(b,c){for(var d=0;d<c.length;d++)b.removeAttr(c[d])}var e=KISSY.Editor,u=KISSY,v=e.RANGE,w=e.ElementPath,o=e.NODE,i=e.TripleButton,j="b,big,code,del,dfn,em,font,i,ins,kbd,q,samp,small,span,strike,strong,sub,sup,tt,u,var,s",x="class,style,lang,width,height,align,hspace,valign".split(",");j=RegExp("^(?:"+j.replace(/,/g,"|")+")$","i");u.augment(n,{_init:function(){var b=this.editor;this.el=new i({title:"清除格式",
contentCls:"ke-toolbar-removeformat",container:b.toolBarDiv});this.el.on("offClick",this._remove,this);e.Utils.sourceDisable(b,this)},disable:function(){this.el.set("state",i.DISABLED)},enable:function(){this.el.set("state",i.OFF)},_remove:function(){var b=this.editor,c=j;c.lastIndex=0;var d=b.getSelection().getRanges();b.fire("save");for(var p=0,f;f=d[p];p++)if(!f.collapsed){f.enlarge(v.ENLARGE_ELEMENT);var k=f.createBookmark(),a=k.startNode,q=k.endNode,h=function(r){for(var l=new w(r),y=l.elements,
s=1,g;g=y[s];s++){if(g._4e_equals(l.block)||g._4e_equals(l.blockLimit))break;c.test(g._4e_name())&&r._4e_breakParent(g)}};h(a);h(q);for(a=a._4e_nextSourceNode(true,o.NODE_ELEMENT);a;){if(a._4e_equals(q))break;h=a._4e_nextSourceNode(false,o.NODE_ELEMENT);a._4e_name()=="img"&&a.attr("_cke_realelement")||(c.test(a._4e_name())?a._4e_remove(true):t(a,x));a=h}f.moveToBookmark(k)}b.getSelection().selectRanges(d);b.fire("save")}});m.addPlugin(function(){new n(m)})});