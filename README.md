Lovely Infinite Scrolling (LovelyIS)


Don't you think infinite scroll should do better? Why can't I continue where I left if I reload my page or hit the back button?
I think you should, that's the way infinite scrolling should work everywhere. 
 
Lovely Infinite scrolling adds this functionality to your current implemententation in no time.
It's as easy as initializing LovelyIS with a couple of selectors (for your items and footer (last element in the list), the target for the binding)
and attaching two functions to your current implementation: duringScroll() and afterAppend(). As you can tell by their names the first one needs to
be invoked every time you track the scroll event and the second after you've already appended the new page. That's it! Sit back and enjoy :)
 
Requisites:

-jQuery
-All your list items should have an unique id that can be either the html elemnt id ( <element id="unique-id" ... /> )
or a data-id attribute (<element data-id="unique-id" ... /> ).

 
Pros: 
-It makes any* implementation work as described with just a couple of steps.
-Doesn't break the back button (for the sake of the UX!) 

Cons:
-You can bookmark items, but since you have a dinamically created list at some point the items will probably move to the next
page and the bookmark will no longer work. 
