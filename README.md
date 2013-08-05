Lovely Infinite Scrolling (LovelyIS)
------------------------------------


Don't you think infinite scroll should do better? Why can't I continue where I left if I reload my page or hit the back button?
I think you should, that's the way infinite scrolling should work everywhere. 
 
Lovely Infinite scrolling adds this functionality to your current implemententation in no time.
It's as easy as initializing LovelyIS with a couple of selectors (for your items and footer (last element in the list), the target for the binding)
and attaching two functions to your current implementation: duringScroll() and afterAppend(). As you can tell by their names the first one needs to
be invoked every time you track the scroll event and the second after you've already appended the new page. That's it! Sit back and enjoy :)
 
Requisites
----------

* jQuery
* All your list items should have an unique id that can be either the html elemnt id ( id="unique-id" )
or a data-id attribute ( data-id="unique-id" ).
* History API support ( or include a polyfill :) like this one --> https://github.com/devote/HTML5-History-API ) 

 
Pros
----
* It makes any* implementation work as described with just a couple of steps.
* Doesn't break the back button (for the sake of the UX!) 
* Continue right where you ended up while scrolling down 

Cons
----
* You can bookmark items, but since you have a dinamically created list at some point the items will probably move to the next
page and the bookmark will no longer work. 
* If your feed updates really quick ( like twitter or facebook ) you might lose the relation between the page and the item id (so you won't reach the correct item when hitting back) 
* Your site might end up being so awesome it could explode D: 

TODOs
-----
* Figure out something to work out the quickly-updated-feed issue (the bigger the number of items per page the less possibilities of this happening)

How to
------

Just include the minified (or unminified version) of the plugin in your page and configure it as follows:

        LovelyIS.init({
                selectors : {
                    item: 'item selector',
                    footer: 'last item selector'
                },
                binder : $(window),  
                usingData : true     //default is false and will use the element's id
            });

Then just make sure to call: 

        LovelyIS.afterAppend(); //Just after the new content is appended.

and   

        LovelyIS.duringScroll(); //Everytime you track the scroll event.

And Voila! :D
