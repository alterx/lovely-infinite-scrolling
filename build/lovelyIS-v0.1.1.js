 /*
 * Viewport - jQuery selectors for finding elements in viewport
 *
 * Copyright (c) 2008-2009 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *  http://www.appelsiini.net/projects/viewport
 *
 */
(function($) {
    
    $.belowthefold = function(element, settings) {
        var fold = $(window).height() + $(window).scrollTop();
        return fold <= $(element).offset().top - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var top = $(window).scrollTop();
        return top >= $(element).offset().top + $(element).height() - settings.threshold;
    };
    
    $.rightofscreen = function(element, settings) {
        var fold = $(window).width() + $(window).scrollLeft();
        return fold <= $(element).offset().left - settings.threshold;
    };
    
    $.leftofscreen = function(element, settings) {
        var left = $(window).scrollLeft();
        return left >= $(element).offset().left + $(element).width() - settings.threshold;
    };
    
    $.inviewport = function(element, settings) {
        return !$.rightofscreen(element, settings) && !$.leftofscreen(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };
    
    $.extend($.expr[':'], {
        "below-the-fold": function(a, i, m) {
            return $.belowthefold(a, {threshold : 0});
        },
        "above-the-top": function(a, i, m) {
            return $.abovethetop(a, {threshold : 0});
        },
        "left-of-screen": function(a, i, m) {
            return $.leftofscreen(a, {threshold : 0});
        },
        "right-of-screen": function(a, i, m) {
            return $.rightofscreen(a, {threshold : 0});
        },
        "in-viewport": function(a, i, m) {
            return $.inviewport(a, {threshold : 0});
        }
    });

    
})(jQuery);

/**
 * @author Carlos Vega
 * @version 0.1
 * Lovely Infinite Scrolling (LovelyIS)
 * Don't you think infinite scroll should do better? Why can't I continue where I left if I reload my page or hit the back button?
 * I think you should, that's the way infinite scrolling should work everywhere. 
 *
 * Lovely Infinite scrolling adds this functionality to your current implemententation in no time.
 * It's as easy as initializing LovelyIS with a couple of selectors (for your items and footer (last element in the list), the target for the binding)
 * and attaching two functions to your current implementation: duringScroll() and afterAppend(). As you can tell by their names the first one needs to
 * be invoked every time you track the scroll event and the second after you've already appended the new page. That's it! Sit back and enjoy :)
 *
 * Special thanks to Paul Irish & Luke Shumard for providing their infinite scroll plugin
 * http://www.infinite-scroll.com/
 * which inspired Johnathon Sanders to start implementing history on that plugin.
 * https://github.com/outdooricon/infinite-scroll-with-history
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */


;(function(window, document, $, undefined){

    var LovelyIS = (function(opts){

        var options = {
            ready : false,
            state : {
                currentViewPage : 1,
                currPage : 1
            },
            paused : false,
            pageBreakPxLocation : [],
            pageBreakList : [],
            pixelsFromNavToBottom : undefined,
            extendable : {               
                updateWhileScroll : false,
                binder : $(window),
                usingData : false,
                selectors : {
                    item : 'li',
                    container : 'div',
                    footer : 'li.navigation'
                },
                devMode : true,
                dataIdAttr : 'id',
                scrollTimeout : 2500,
                animationDuration : 2000,
                enabled : true
            }          
        };

        //Core functions, borowed a bit from Johnathon Sanders :), thanks man

        function _calculateBreakPoint() {
            return 0 + $(document).height() - options.pixelsFromNavToBottom + $(options.extendable.selectors.footer).height(); // take in accunt the last element of the page
        }


        function _updateUrlForPageIfNeeded() {

            for (var iteratorLocation = 0; iteratorLocation < options.pageBreakPxLocation.length; iteratorLocation++) {
                var scrolledPastThisPageBreak = ((options.extendable.binder.scrollTop()) >= (options.pageBreakPxLocation[iteratorLocation]));
                var pageNumberForIteratorLocation = iteratorLocation+1;
                
                if (scrolledPastThisPageBreak) {
                    var thereIsNoNextPageBreakStored = (iteratorLocation+1 === options.pageBreakPxLocation.length);
                    var notYetScrolledToNextPageBreak = (options.extendable.binder.scrollTop()) < options.pageBreakPxLocation[iteratorLocation+1];
                    
                    if (thereIsNoNextPageBreakStored || notYetScrolledToNextPageBreak) {

                        var urlNeedsUpdating = options.state.currentViewPage !==  options.pageBreakList[iteratorLocation];

                        if (urlNeedsUpdating) {
                             _updateUrl(options.pageBreakList[iteratorLocation]);
                            return;
                        }
                    }
                }
            }

        }
    
        function _updateUrl(pageNum, itemId) {
            if(!pageNum) return;
            options.state.currentViewPage = pageNum;
            var newUrl =  processParams(pageNum, itemId, window.location.pathname);
            window.history.replaceState(null,null, newUrl);
        }


        function _trackSelectedItem(){    
            $(options.extendable.selectors.item).on('click', function(e){
                setTimeout(function(){
                    var itemId = (!options.extendable.usingData) ? $(e.currentTarget).attr('id') : $(e.currentTarget).data(options.extendable.dataIdAttr),
                    page = ( options.pageBreakPxLocation[options.state.currentViewPage] < $(e.currentTarget).offset().top + $(e.currentTarget).height() ) ? options.state.currentViewPage + 1: options.state.currentViewPage;
                    _updateUrl(page, itemId);
                }, 0);
            })
        }


        function whenScrolling(){
            if(!options.ready || options.paused || !options.enabled) return;

            _updateUrlForPageIfNeeded();
            if(options.extendable.updateWhileScroll){
                var itemId = (!options.extendable.usingData) ? $(options.extendable.selectors.item + ":in-viewport").first().attr('id') : $(options.extendable.selectors.item + ":in-viewport").first().data(options.extendable.dataIdAttr);
                 _updateUrl(options.state.currentViewPage, itemId);
            }
        }

        function whenAppended(){
            if(!options.ready || !options.enabled) return;

            detachListeners();

            options.pageBreakPxLocation[options.pageBreakPxLocation.length] =  _calculateBreakPoint();
            options.state.currPage++;
            options.pageBreakList[options.pageBreakList.length] = options.state.currPage;

            _trackSelectedItem();
        }

        // Utils

        function getElementByDataOrId(dataAttr, dataAttrValue){
            return (options.extendable.usingData) ? $('*[data-'+ dataAttr +'="'+ dataAttrValue +'"]') : $('#'+dataAttrValue);
        }

        function detachListeners() {
            $(options.extendable.selectors.item).off('click');
            log('Detaching click listeners to avoid multiple bindings.');
        }

        function scrollToElement(element){
            if(!element) return;

            options.paused = true;
            setTimeout(function(){              
                $('html, body').animate({
                     scrollTop: element.offset().top
                 }, options.extendable.animationDuration, function(){
                  options.paused = false; 
              });
            }, options.extendable.scrollTimeout);         
        }

        function getParam(sname){
          var params = location.search.substr(location.search.indexOf("?")+1);
          var sval = "";
          params = params.split("&");

            for (var i=0; i<params.length; i++)
               {
                 temp = params[i].split("=");
                 if ( [temp[0]] == sname ) { sval = temp[1]; }
               }
          return sval;
        }

        function processParams(page, itemId, path) {
            var params = location.search.substr(location.search.indexOf("?")+1),
            processed = path + "?",
            addPage = true,
            addId = true,
            params = params.split("&");

            if(params[0] != ""){
                for (var i=0; i<params.length; i++){
                  temp = params[i].split("=");
                  if(temp != "") {
                      if ( [temp[0]] == "page" ) { temp[1] = page; addPage = false; }
                      if ( [temp[0]] == "itemId" && itemId) { temp[1] = itemId; addId = false; }
                      processed += ((i!=0)?'&':"") + temp[0] + "=" + temp[1];
                  }
                }
            }

            if(addPage) {
                processed += ((params[0] != "")?'&':"") + "page=" + page;
            }

            return (addId && itemId)? processed+= ((params[0] != "" || addPage)?'&':"") + "itemId="+itemId : processed;
        }

        function log(text){
            if(!options.extendable.devMode) return;

            console.log('Lovely Infinite Scrolling: ' + text + ' {Running in dev mode}')
        }


        function init(opts) {

            $.extend(options.extendable,opts);  

            if($(options.extendable.selectors.footer).length <= 0 || !options.enabled) return;

            var param = getParam('itemId');
            if(typeof param != 'undefined' && param != ''){
                scrollToElement(getElementByDataOrId(options.extendable.dataIdAttr,param));
            }
            options.pixelsFromNavToBottom = $(document).height() - $(options.extendable.selectors.footer).last().offset().top;  
            options.state.currentViewPage=  getParam('page') || 1;
            options.state.currPage=  getParam('page') || 1;
            options.pageBreakPxLocation = [0,  _calculateBreakPoint()];
            options.pageBreakList = [options.state.currPage];

            _trackSelectedItem();
            options.ready = true && (window.history && window.history.pushState);
            log((options.ready)?'Ready to roll :D':'Ooops, seems like this browser doesn\'t support the newest stuff D:');
            
        }

        _expose = {
            duringScroll : whenScrolling,
            afterAppend : whenAppended,
            init : init
        }

        return _expose;
    })();


    window.LovelyIS = LovelyIS;
    
})(window, document, jQuery);