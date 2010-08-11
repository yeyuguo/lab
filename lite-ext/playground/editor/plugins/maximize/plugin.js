/**
 * maximize editor
 * @author:yiminghe@gmail.com
 * @note:firefox ������ȫ�군�ˣ�����ȫ�����firefox
 */
KISSYEDITOR.add("editor-plugin-maximize", function(KE) {
    var S = KISSY,
        UA = S.UA,
        Node = S.Node,
        Event = S.Event,
        TripleButton = KE.TripleButton,
        DOM = S.DOM,
        iframe = new Node("<iframe style='position:absolute;top:-9999px;left:-9999px;' frameborder='0'>" +
            "</iframe>");
    S.ready(function() {
        document.body.appendChild(iframe[0]);
    });

    function Maximize(editor) {
        this.editor = editor;
        this._init();
    }

    S.augment(Maximize, {
        _init:function() {
            var self = this,editor = self.editor;
            self.el = new TripleButton({
                container:editor.toolBarDiv,
                cls:"ke-tool-editor-source",
                text:"maximize"
            });

            self.el.on("offClick", self.maximize, self);
            self.el.on("onClick", self.restore, self);
        },
        restore:function() {
            var self = this,
                editor = self.editor;
            Event.remove(window, "resize", self._maximize, self);
            //editor.focus();
            //console.log(editor.iframeFocus);

            this._saveEditorStatus();
            editor.iframe.css({
                width: self.iframeWidth,
                height:self.iframeHeight
            });
            editor.textarea.css({
                width: self.textareaWidth,
                height:self.textareaHeight
            });
            new Node(document.body).css({
                width:"",
                height:"",
                overflow:""
            });
            editor.editorWrap.css({
                position:"static",
                width:self.editorWrapWidth
            });
            iframe.css({
                left:"-99999px",
                top:"-99999px"
            });
            window.scrollTo(self.scrollLeft, self.scrollTop);
            self.el.set("state", TripleButton.OFF);
            //firefox ����timeout
            setTimeout(function() {
                //editor.focus();
                self._restoreEditorStatus();
            }, 30);
        },

        _saveSate:function() {
            var self = this,
                editor = self.editor;
            self.iframeWidth = editor.iframe._4e_style("width");
            self.iframeHeight = editor.iframe._4e_style("height");
            self.editorWrapWidth = editor.editorWrap._4e_style("width");
            self.textareaWidth = editor.textarea._4e_style("width");
            self.textareaHeight = editor.textarea._4e_style("height");
            //�����ڹ�����ҲҪ����Ŷ
            self.scrollLeft = DOM.scrollLeft();
            self.scrollTop = DOM.scrollTop();
            window.scrollTo(0, 0);
        },
        //firefox������iframe layout�仯ʱ��range����
        _saveEditorStatus:function() {
            var self = this,
                editor = self.editor;
            if (!UA.gecko || !editor.iframeFocus) return;
            var sel = editor.getSelection();
            //firefox ��궪ʧbug,λ�ö�ʧ���������ﱣ����
            self.savedRanges = sel && sel.getRanges();
        },

        _restoreEditorStatus:function() {
            var self = this,
                editor = self.editor;
            var sel;

            //firefox����bug
            if (UA.gecko && editor.iframeFocus) {

                //ԭ���Ǿ۽�������ˢ��designmode
                sel = editor.getSelection();
                editor.focus();
                if (self.savedRanges && sel) {
                    sel.selectRanges(self.savedRanges);
                }

            }
            //firefox �н���ʱ�����¾۽�


            if (editor.iframeFocus && sel) {
                var element = sel.getStartElement();
                //ʹ��ԭ�����еģ���ʹ�����ڹ���
                //element[0] && element[0].scrollIntoView(true);
                element && element[0] && element.scrollIntoView(editor.document, false);
            }

            //firefox����bug
            if (UA.gecko) {
                //ԭ�����۽�
                if (!editor.iframeFocus) {
                    //�Ƶ�����mousedown�ж�
                    //ˢ��designmode
                    //editor.focus();
                    //����ϳ�
                    //editor.blur();
                }
            }

        },
        _maximize:function() {
            var self = this,
                editor = self.editor;
            var viewportHeight = DOM.viewportHeight(),
                viewportWidth = DOM.viewportWidth(),
                statusHeight = editor.statusDiv ? editor.statusDiv.height() : 0,
                toolHeight = editor.toolBarDiv.height();
            editor.iframe.css({
                width:(viewportWidth - 5) + "px"
            });

            editor.textarea.css({
                width:(viewportWidth - 5) + "px"
            });
            if (!UA.ie)
                new Node(document.body).css({
                    width:0,
                    height:0,
                    overflow:"hidden"
                });
            else
                document.body.style.overflow = "hidden";
            editor.editorWrap.css({
                position:"absolute",
                zIndex:9999,
                width:viewportWidth + "px"
            });
            iframe.css({
                zIndex:9998,
                height:viewportHeight + "px",
                width:viewportWidth + "px"
            });
            editor.editorWrap.offset({
                left:0,
                top:0
            });
            iframe.css({
                left:0,
                top:0
            });
            editor.iframe.css({
                height:(viewportHeight - statusHeight - toolHeight - 6) + "px"
            });
            editor.textarea.css({
                height:(viewportHeight - toolHeight - 4) + "px"
            });
        },
        maximize:function() {
            var self = this,
                editor = self.editor;
            //editor.focus();
            this._saveEditorStatus();
            this._saveSate();
            this._maximize();
            //firefox��һ�����bug������һ��
            if (true || UA.gecko) {
                this._maximize();
            }
            Event.on(window, "resize", self._maximize, self);
            this.el.set("state", TripleButton.ON);
            //if (editor.iframeFocus)

            setTimeout(function() {
                self._restoreEditorStatus();
            }, 30);

        }
    });


    KE.on("instanceCreated", function(ev) {
        var editor = ev.editor;
        new Maximize(editor);
    });

});