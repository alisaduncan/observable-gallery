import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

const initialPhotos = [
    {
        url: "https://66.media.tumblr.com/dff05f90167b5e50eab4df4f61a309aa/tumblr_o1ro152Q1m1rbkxlgo1_500.jpg",
        description: "",
        categoryID: "pub",
    },
    {
        url: "https://66.media.tumblr.com/be45669e5825a1db9c22c730c00eb5db/tumblr_o6ckp64vBe1vnm7bio1_500.jpg",
        description: "",
        categoryID: "priv",
    },
    {
        url: "https://66.media.tumblr.com/9251ed46399400b08d15993800972c08/tumblr_pw9iqdF4Qr1tfqi0so1_500.jpg",
        description: "",
        categoryID: "priv",
    }
]

@Injectable({
    providedIn: 'root'
})
export class PhotosService {
    constructor() {
        this.newPhotos$.subscribe(a => console.log(a))

        this.newPhotos$.subscribe(photos => this.addPhotos(photos))
    }

    private photos = initialPhotos

    newPhotos$ = new Subject()

    addPhotos(photos) {
        console.log(photos)

        this.photos.push(...photos);
    }

    getPhotosList() {
        return this.photos
    }
}
