tinto-bind
==========

A binding mechanism for Angular allowing to reduce the number of watchers when:

* You only need one-way data binding
* You have multiple expressions depending on a single object's values

This is typically the case in read-only tables, feeds, etc...

> INSTALL bower install tinto-bind --save

In many cases where performance is crucial, like on mobile, you will want to get the number of watchers under control. Most often, one watcher is enough to trigger multiple view changes. Let's start with an example, a simple information feed:

```html
<div ng-repeat="item in feed | orderBy: '-time'" class="feed-item">
  <div class="header">
    <a href="/user?id={{item.by.id}}" ng-bind="item.by.name"></span>
    <span ng-bind="item.when"></span>
  </div>
  <div class="body">
    <img ng-src="/pictures?id={{item.picture}}"/>
    <div class="body-text" ng-bind="item.message"></div>
  </div>
</div>
```
We thus have 5 watchers for every item in our feed and all of them are bound to the item object. If our feed is 100 items long, that means 500 watchers!

One thing we see here is that all 5 watchers are dependent on the "item" object. Now with tinto-bind:

```html
<div ng-repeat="item in feed | orderBy: '-time'" class="feed-item" tinto-watch="item">
  <div class="header">
    <a tinto-href="/user?id={{item.by.id}}" tinto-bind="item.by.name"></span>
    <span tinto-bind="item.when"></span>
  </div>
  <div class="body">
    <img tinto-src="/pictures?id={{item.picture}}"/>
    <div class="body-text" tinto-bind="item.message"></div>
  </div>
</div>
```
The tinto directives will register themselves to the tintoWatch directive. When the watched expression changes (here 'item'), the directive will update the underlying tinto expressions.

The tinto-bind directive can accept multiple expressions separated by a comma

Doing this we've reduced the number of watchers by 5. Naturally, this means deep watching the 'item' object, so the dirty checking on the 'item' object is costlier than the 5 expressions separately. We're effectively exchanging 5 'light' watchers for one heavier one. Yet there are use-cases where this is actually beneficial: when the watched item does not change often, for example, or when you would have 1000+ watchers based on only a few root expressions.

In our Tinto app, each feed item required 20+ watchers. Doing this significantly reduced the number of watchers in our feed screen. 

