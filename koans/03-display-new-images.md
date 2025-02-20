# Merging Observables
*Merge new images with existing images*
Wow, how far we came! We can use Observables to handle user events, but also to synchronize data processing events. Isn’t it beautiful, when you have API that's simple but powerful enough to be useful in many situations? You may have started to discover that Rx.js is powerful not only because it provides us with Observables and operators but, also, because it give us very nice language to speak about asynchronous events. It has answers for most of your asynchronous problems.

So what do we do now? Let’s think what we have in Photos service? List of photos and Observable with new photos, uploaded by user. That’d be great if we could just merge them. Take one list, take second list, put them together and update every time there are new photos coming. Sound reasonable? I think it does, so I’ll do it. You can follow me and we'll do it together!

First, let's create new Observable. It'll be the one that merges existing photos with new ones. We'll use `combineLatest` function. It does what it says – takes latest value from each Observable it's given and combine them together. `combineLatest` produces new value everytime once of it's arguments produces a value. Then all values are combined into array and passed to next Observable. 

```
photos$ = combineLatest(
    of(this.photos),
    this.allNewPhotos$,
)
```

Function `of` takes one argument and return Observable that will produce this argument as its value. It makes it easier for us to combine existing photos wih new ones. If we deal with Observables everywhere it's simple to combine them, without much thinking.

Because `newPhotos$` changes everytime user uploads some photo, we have to accumulate all uploads into one array. We'll do it in `allNewPhotos$` Observable, with operator `scan`.

```
allNewPhotos$ = this.newPhotos$.pipe(
     scan((allPhotos, newPhotos) => allPhotos.concat(newPhotos), []),
     startWith([]),
)
```

`scan` tells us: I'm gonna take every value you give me and accumulate into one, aggregate value. Meaning… what, when, why? Ok. You see `scan` think: huge, huge snowball. Everytime you add little snowball to it, it gets bigger, but it's the same, huge snowball. So `scan` takes many little snowballs as inputs and produces huge one as output. Our particular `scan`, instead of snow, takes lots of photos uploaded over time, and concatenates them into one, huge list of uploaded photos. There's also `startWith` to make sure that our `allNewPhotos$` Observable has starting value before `scan` produces anything.

Last one thing! We've combined existing photos with new photos. We've accumulated photos uploaded over time into one, huge list of all uploaded photos. But we have to tell our new `photos$` Observable how to exactly combine those two. It goes like this:

```
photos$ = combineLatest(
     of(this.photos),
     this.allNewPhotos$,
).pipe(
     map(([photos, uploadedPhotos]) => flatten([photos, uploadedPhotos])),
)
```

After `combineLatest` produces new array with existing and uploaded photos, let's take these two arrays, put them into one and flatten. That way we're getting one array with all photos. If you'd like to make this code a bit shorter, you could do something like:

```
photos$ = combineLatest(
     of(this.photos),
     this.allNewPhotos$,
).pipe(
     map((collection: Array<Array<Photo>>) => flatten(collection)),
)
```

or even, a one liner:


```
photos$ = combineLatest(of(this.photos), this.allNewPhotos$).pipe(map(flatten))
```

Take all arrays that are sent here and flatten them all into one. So elegant!

And what do we have to do, to display these new photos on our photos list? Just one real change in our `gallery` component.

First we change photosList to `photosList$`:

```
photosList$: Observable<Photo[]> = this.photosService.photos$;
```

and we make sure that HTML knows our list is now Observable

```
<div *ngFor="let photo of photosList$ | async" class="photo">…
```

Great! We're uploading photos to gallery, displaying all of them and opening active photo still works like it did. It's so nice, it'd be a crime not to add some more features!
