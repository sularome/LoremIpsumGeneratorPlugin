var content = window["content"] = [];

opera.isReady(function(){

	function $(id, parent) {
	  if (parent != undefined) return parent.getElementById(id); else return document.getElementById(id);
	}
	var $ = window["$"] = $;
	
	function $$(selector, parent, first) {
	  if (first != undefined) {
		if (parent != undefined) {
		  return parent.querySelector(selector);
		} else return document.querySelector(selector);
	  } else {
		if (parent != undefined) return parent.querySelectorAll(selector); else return document.querySelectorAll(selector);
	  }
	}
	var $$ = window["$$"] = $$;
	
	
	
	function Popup(_){
		this.loadingLang = true;
		this._ = _;
        this.filter =   null;
        this.lang = "default";
		_.load("js/lang/"+this.lang+".js",_.proxy(this.langLoaded, this));
		this.init();
	}
	var Popup = window["Popup"] = Popup;
	
	Popup.prototype.langLoaded = function() {
        this.loadingLang = false;
        this.populate();
    }
	Popup.prototype.copyToClipboard = function(withHtml, e) {
        if(e && e.preventDefault) e.preventDefault();
        var tempNode = $("copy_holder");
        if(withHtml){
            tempNode.innerHTML = this._.safe_tags_replace($("content").innerHTML);
        }else{
            tempNode.innerHTML = this.getInnerText($("content"));
        }
        
        // select the contents of the element
        var r = document.createRange();
        r.selectNodeContents(tempNode);
        
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(r);
        document.execCommand("copy");
        tempNode.innerHTML = "";
    }
	Popup.prototype.populate = function() {
		if(this.loadingLang) return;
		var count, 
			start_lorem = $('start_lorem').checked, 
			temp_array = content.clone(),
			_ = this._;
			
		count = (isNaN($('paragraph_count').value) || $('paragraph_count').value == "") ? 25 : $('paragraph_count').value;
		if (start_lorem == true) {
			var lorem = temp_array.shift();
			temp_array = _.shuffle(temp_array);
			temp_array.splice(Math.floor((Math.random() * (temp_array.length - 1)) + 1), 0, lorem);
		}
        
		switch (this.filter) {
			case '0':
				$('content').innerHTML = "";
				for (var i = 0, max = 10; i < count; i++) {
					$('content').innerHTML += "<p>" + temp_array[i % max] + "</p>";
				}
            break;
			case '1':
                $('content').innerHTML = this.getWordList(count,temp_array).join(" ");
            break;
			case '24':
                var output = "" ;
				output = "<ul>";
				for (var i = 0, max = 10; i < count; i++) {
					output += "<li>" + temp_array[i % max] + "</li>";
				}
				$('content').innerHTML = output+"</ul>";
            break;
			case '21':
                $('content').innerHTML = "<ul><li>"+this.getWordList(count,temp_array).join("</li><li>")+"</li></ul>";
            break;
			case '22':
                $('content').innerHTML = "<ul><li>"+this.getFewWordsList(count,4,10,temp_array).join("</li><li>")+"</li></ul>";
            break;
			case '23':
			case '2':
                $('content').innerHTML = "<ul><li>"+this.getSentenceList(count,temp_array).join("</li><li>")+"</li></ul>";
            break;
		}
        
	}
	
	Popup.prototype.init = function() {
        var  self = this,
        _ = this._;
        
        [].forEach.call($$(".filter_wrap li"), function(li) {
            li.addEventListener('click', function(e) {
                e.preventDefault();
                var li = e.target;
                self.filter =  li.getAttribute('data-value');
                $$(".filter_wrap .holder", document, 1).innerHTML = li.getAttribute('data-label');
                self.populate();
            });
        });
        
        var first = $$(".filter_wrap li", document, 1);
        $$(".filter_wrap .holder", document, 1).innerHTML = first.innerHTML;
        self.filter =  first.getAttribute('data-value');
        
        Array.prototype.forEach.call($$(".lang_wrap li"), function(li) {
            li.addEventListener('click', function(e) {
                e.preventDefault();
                var li = e.target;
                self.lang =  li.getAttribute('data-value');
                $$(".lang_wrap .holder", document, 1).innerHTML = li.getAttribute('data-label');
                self.loadingLang = true;
                _.load("js/lang/"+self.lang+".js",_.proxy(self.langLoaded, self));
            });
        });
        
        var first = $$(".lang_wrap li", document, 1);
        $$(".lang_wrap .holder", document, 1).innerHTML = first.getAttribute('data-label');
        self.lang =  first.getAttribute('data-value');
        
        
        
        $("paragraph_count").addEventListener('change', function(e) {
            e.preventDefault();
            self.populate();
        });
        
        $("start_lorem").style.display = 'none';
        
        $("start_lorem_wrap").addEventListener('click', function() {
            if ($("start_lorem_wrap").classList.contains("on")) {
                $("start_lorem").checked = false;
                $("start_lorem_wrap").classList.remove("on");
            } else {
              $("start_lorem").checked = true;
              $("start_lorem_wrap").classList.add("on");
            }
            self.populate();
        });
		$('filter_form').addEventListener('submit', function(e) {
            e.stopPropagation();
            e.preventDefault();
            self.populate();
		});
		$('copy_btn').addEventListener('click', _.proxy(this.copyToClipboard, this, false));
		$('copy_btn_html').addEventListener('click', _.proxy(this.copyToClipboard, this,true));
        
		$('start_lorem_wrap').addEventListener('mouseover', function(e) {
            var tooltip = $('tooltip'), pos = _.findPos(this);
            tooltip.innerHTML = this.getAttribute('title');
            this.setAttribute('title', '');
            tooltip.style.display = 'block';
            tooltip.style.left = (pos[0] + 30 - 0) + "px";
            tooltip.style.top = (pos[1] + 30 - 0) + "px";
		});
		$('start_lorem_wrap').addEventListener('mouseout', function(e) {
            var tooltip = $('tooltip');
            this.setAttribute('title', tooltip.innerHTML);
            tooltip.style.display = 'none';
		});
	}
	Popup.prototype.getInnerText = function(el) {
        var output = "";
        if(this.hasTagChildNodes(el)){
           var children = el.childNodes;
           for(var i =0, l = children.length; i < l; i++ ){
                if(children[i].nodeType == document.ELEMENT_NODE){
                    output += this.getInnerText(children[i]);
                }
           }
        }else{
            output = el.innerText;
            if(el.nodeName.toLowerCase() == "p"){
                output += "<br /><br />";
            }else{
                output += "<br />";
            }
        } 
        return output;
    }
    
	Popup.prototype.hasTagChildNodes = function(el) {
        if(el.hasChildNodes()){
           var children = el.childNodes;
           for(var i =0, l = children.length; i < l; i++ ){
                if(children[i].nodeType == document.ELEMENT_NODE){
                    return true;
                } 
           }
        }
        return false;
    }
    
	Popup.prototype.getWordList = function(count,temp_array) {
          var output = [], counter = 0  ,max = temp_array.length, i=0;
            while(true){
                var s = temp_array[i].replace(/(^\s*)|(\s*$)/gi, "");
                s = s.replace(/[ ]{2,}/gi, " ");
                s = s.replace(/\n /, "\n");
                var wordList = s.split(' ');
                for (var j = 0, jMax = wordList.length; j < jMax; j++) {
                      output.push(wordList[j].toLowerCase());
                      counter++;
                    if (counter >= count) {
                        return output;
                    }
                }
                i++;
                if(i > 10) i = 0;
            }
    }
	Popup.prototype.getFewWordsList = function(count,minCount, maxWordCount,temp_array) {
          var output = [], counter = 0 ,max = temp_array.length, i=0;
            while(true){
                var s = temp_array[i].replace(/(^\s*)|(\s*$)/gi, "").replace(/([\s]+)/g, " ");
                var wordList = s.split(' ');
                console.log(s.split(' ')); 
                console.log(temp_array);
                console.log(wordList.length);
                console.log(wordList);
                for (var j = 0, jMax = wordList.length - maxWordCount; j < jMax; ) {
                    var step = Math.ceil(minCount + Math.random()*(maxWordCount - minCount));
                    output.push(wordList.slice(j, j + step).join(" ").toLowerCase());
                    //console.log("|step "+step + " - j " + j +"|");
                    counter++;
                    j += step;
                    if (counter >= count) {
                        return output;
                    }
                }
                i++;
                if(i > temp_array.length) i = 0;
            }
    }
	Popup.prototype.getSentenceList = function(count,temp_array) {
          var output = [], counter = 0  , i=0;
            while(true){
                var s = temp_array[i].replace(/(^\s*)|(\s*$)/gi, "");
                s = s.replace(/[ ]{2,}/gi, " ");
                s = s.replace(/\n /, "\n");
                var wordList = s.split('. ');
                for (var j = 0, jMax = wordList.length; j < jMax; j++) {
                  output.push(wordList[j].toLowerCase());
                  counter++;
                  if (counter >= count) {
                    return output;
                  }
                }
                i++;
                if(i >= temp_array.length) i = 0;
            }
    }

	var popup = new Popup(new Utils());
	popup.populate();
});
